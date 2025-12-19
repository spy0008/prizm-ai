import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import {
  ContributionCalendar,
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
