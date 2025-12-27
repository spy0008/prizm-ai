import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { indexCodebase } from "@/module/ai/lib/rag";
import { getRepoFileContents } from "@/module/github/lib/github";

export const indexRepo = inngest.createFunction(
  { id: "index-repo", name: "Index Repository Codebase" },
  { event: "repository.connected" },

  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    //fetch files
    const files = await step.run("fetch-file", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: "github",
        },
      });

      if (!account?.accessToken) {
        throw new Error("No Github access token found");
      }

      return await getRepoFileContents({
        token: account.accessToken,
        owner,
        repo,
      });
    });

    await step.run("index-codebase", async () => {
      await indexCodebase(`${owner}/${repo}`, files);
    });

    return { success: true, indexedFile: files.length };
  }
);
