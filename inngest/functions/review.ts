import {
  getPullRequestDiff,
  postReviewComment,
} from "@/module/github/lib/github";
import { inngest } from "../client";
import { retrieveContent } from "@/module/ai/lib/rag";
import { google } from "@ai-sdk/google";
import prisma from "@/lib/db";
import { generateText } from "ai";
import { proReviewLimiter, reviewLimiter } from "@/lib/rate-limit";

export const generateReview = inngest.createFunction(
  { id: "generate-review", concurrency: 5 },
  { event: "pr.review.requested" },

  async ({ event, step }) => {
    const { owner, repo, prNumber, userId } = event.data;

    const rateLimitResult = await step.run("check-rate-limit", async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true },
      });
      const isPro = user?.subscriptionTier === "PRO";
      return {
        isPro,
        limiter: isPro ? proReviewLimiter : reviewLimiter,
      } as { isPro: boolean; limiter: typeof reviewLimiter };
    });

    const { limiter } = rateLimitResult as {
      isPro: boolean;
      limiter: typeof reviewLimiter;
    };

    const { success, retryAfter } = await step.run(
      "apply-rate-limit",
      async () => await limiter(`${userId}:review`)
    );

    if (!success) {
      console.log(`⏳ Rate limited ${userId}: retry in ${retryAfter}s`);
      throw new Error(`Rate limited. Retry in ${retryAfter}s`);
    }

    const { diff, title, description, token } = await step.run(
      "fetch-pr-data",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No Github access token found!!!");
        }

        const data = await getPullRequestDiff({
          token: account.accessToken,
          owner,
          repo,
          prNumber,
        });

        if (!data) {
          throw new Error("Failed to fetch PR data");
        }

        return { ...data, token: account.accessToken };
      }
    );

    const context = await step.run("retrieve-context", async () => {
      const query = `${title}\n${description}`;

      return await retrieveContent(query, `${owner}/${repo}`);
    });

    const review = await step.run("generate-ai-review", async () => {
      const prompt = `You are an expert code reviewer for PRizm. Provide a professional, actionable review.

PR TITLE: ${title}
DESCRIPTION: ${description || "No description"}

REPO CONTEXT: ${context.join("\n\n")}

DIFF:
\`\`\`diff
${diff}
\`\`\`

**REQUIRED FORMAT (markdown only):**

## 📋 Walkthrough
File-by-file analysis of changes

## 🔄 Flow (if applicable)
\`\`\`mermaid
sequenceDiagram
  participant A
  participant B
  Note over A,B: Keep simple, no quotes/braces in labels
\`\`\`

## 📊 Summary
2-3 sentences overview

## ✅ Strengths
What works well

## ⚠️ Issues (Critical → Minor)
- [SEVERITY] Description + line numbers
- Use **BLOCKER**, **HIGH**, **MEDIUM**, **LOW**

## 💡 Suggestions
Specific, copy-pasteable improvements

## 🎉 Poem
4-line summary poem

**RULES:**
- Reference exact line numbers from diff
- Quote code with line numbers: \`line 42: if (x)\`
- No generic advice - be specific to this diff
- Valid Mermaid syntax only (no quotes/braces in labels)
- Professional tone for production code review`;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      return text;
    });

    await step.run("post-commit", async () => {
      await postReviewComment({ token, owner, repo, prNumber, review });
    });

    await step.run("save-review", async () => {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repo,
        },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            prNumber,
            prTitle: title || "Untitled Pull Request",
            prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
            review,
            status: "completed",
          },
        });
      }
    });

    return { success: true };
  }
);
