import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import {
  ContributionCalendar,
  getPullRequestDiffType,
  getRepoFileContentsTypes,
  postReviewCommentType,
  UserContributionsResponse,
} from "@/types/apiType";

// Getting the GitHub access token
export const getGithubToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized user");
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
    select: {
      accessToken: true,
    },
  });

  if (!account?.accessToken) {
    throw new Error("No GitHub access token found");
  }

  return account.accessToken;
};

// Getting the user GitHub contributions
export const fetchUserontributions = async (
  token: string,
  username: string
): Promise<ContributionCalendar | null> => {
  const octokit = new Octokit({ auth: token });

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql<UserContributionsResponse>(query, {
      username,
    });

    if (!response.user) {
      return null;
    }

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return null;
  }
};

// Getting the user GitHub Repositories
export const getRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  try {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      visibility: "all",
      per_page: perPage,
      page,
    });

    return data;
  } catch (error) {
    console.log("Error while getRepositories data from github: ", error);
    return [];
  }
};

// create webhook
export const createWebhook = async (owner: string, repo: string) => {
  try {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const exitingHook = hooks.find((hook) => hook.config.url === webhookUrl);

    if (exitingHook) {
      return exitingHook;
    }

    const { data } = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: "json",
      },
      events: ["pull_request"],
    });

    return data;
  } catch (error) {
    console.error("Error while create webhook: ", error);
  }
};

//delete webhook
export const deleteWebhook = async (owner: string, repo: string) => {
  try {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const hookToDelete = hooks.find((hook) => hook.config.url === webhookUrl);

    if (hookToDelete) {
      await octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookToDelete.id,
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error while deleting webhook: ", error);
  }
};

// fetch repo files
export async function getRepoFileContents({
  token,
  owner,
  repo,
  path = "",
}: getRepoFileContentsTypes): Promise<{ path: string; content: string }[]> {
  const octokit = new Octokit({ auth: token });

  try {
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });
    const defaultBranch = repoData.default_branch;

    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: "1" as const,
    });

    const isTextFile = (filePath: string) =>
      !/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz|exe|dmg|bin)$/i.test(
        filePath
      );

    const textFilePaths = tree.tree
      .filter((item: any) => item.type === "blob")
      .filter((item: any) => isTextFile(item.path))
      .map((item: any) => item.path);

    const files: { path: string; content: string }[] = [];
    const chunkSize = 10;

    for (let i = 0; i < textFilePaths.length; i += chunkSize) {
      const chunk = textFilePaths.slice(i, i + chunkSize);

      const chunkPromises = chunk.map(async (filePath) => {
        try {
          const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
          });

          if (!Array.isArray(data) && data.type === "file" && data.content) {
            return {
              path: data.path!,
              content: Buffer.from(data.content, "base64").toString("utf-8"),
            };
          }
        } catch (error) {
          console.warn(`Failed to fetch ${filePath}:`, error);
        }
        return null;
      });

      const chunkFiles = (await Promise.all(chunkPromises)).filter(
        (file): file is { path: string; content: string } => file !== null
      );
      files.push(...chunkFiles);
    }

    return files;
  } catch (error) {
    console.error(`Failed to fetch repo contents for ${owner}/${repo}:`, error);
    throw new Error(`Unable to fetch repository contents: ${error}`);
  }
}

// get PR Diff (new change in file)
export async function getPullRequestDiff({
  token,
  owner,
  repo,
  prNumber,
}: getPullRequestDiffType) {
  try {
    const octokit = new Octokit({ auth: token });

    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    const { data: diff } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: "diff",
      },
    });

    return {
      diff: diff as unknown as string,
      title: pr.title,
      description: pr.body || "",
    };
  } catch (error) {
    console.error("Error while getting PR Diff: ", error);
  }
}

// create post PR review comment
export async function postReviewComment({
  token,
  owner,
  repo,
  prNumber,
  review,
}: postReviewCommentType) {
  const octokit = new Octokit({ 
    auth: token,
    userAgent: 'PRizm/1.0.0'
  });

  try {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `##  PRizm AI Code Review\n\n${review}\n\n---\n*Powered by PRizmai*`
    });
  } catch (error) {
    console.error("postReviewComment API error:", {
      owner, repo, prNumber, 
      tokenLength: token.length,
      error: error
    });
    throw error;
  }
}


