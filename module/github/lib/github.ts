import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import {
  ContributionCalendar,
  UserContributionsResponse,
  webhookType,
} from "@/types/apiType";
import { data } from "motion/react-client";

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
