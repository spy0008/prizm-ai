"use server";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { proRepoLimiter, repoLimiter } from "@/lib/rate-limit";
import { createWebhook, getRepositories } from "@/module/github/lib/github";
import {
  canConnectRepository,
  incrementRepositoryCount,
} from "@/module/payment/lib/subscription";
import { headers } from "next/headers";

export const fetchRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized user");
    }

    const githubRepos = await getRepositories(page, perPage);

    const dbRepos = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const connetctedReposIds = new Set(dbRepos.map((repo) => repo.githubId));

    return githubRepos.map((repo: any) => ({
      ...repo,
      isConnected: connetctedReposIds.has(BigInt(repo.id)),
    }));
  } catch (error) {
    console.error("Error while fetchinh repo data: ", error);
    return [];
  }
};

export const connectRepository = async (
  owner: string,
  repo: string,
  githubId: number
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    });

    const isPro = user?.subscriptionTier === "PRO";
    const limiter = isPro ? proRepoLimiter : repoLimiter;

    const { success, remaining, retryAfter } = await limiter(userId);

    if (!success) {
      throw new Error(
        isPro
          ? `Rate limited. Try again in ${retryAfter}s.`
          : `Free limit reached (${
              5 - remaining
            }/hour). Upgrade to Pro for 100x more! Retry in ${retryAfter}s`
      );
    }

    const canConnect = await canConnectRepository(userId);

    if (!canConnect) {
      throw new Error(
        "Repository limits reached, Please upgrade to Pro for unlimited repositories connections."
      );
    }

    const webhook = await createWebhook(owner, repo);

    if (webhook) {
      await prisma.repository.create({
        data: {
          githubId: BigInt(githubId),
          name: repo,
          owner,
          fullName: `${owner}/${repo}`,
          url: `https://github.com/${owner}/${repo}`,
          userId: session.user.id,
        },
      });

      await incrementRepositoryCount(session.user.id);

      try {
        await inngest.send({
          name: "repository.connected",
          data: {
            owner,
            repo,
            userId: session.user.id,
          },
        });
      } catch (error) {
        console.error("Failed to trigger repository indexing: ", error);
      }
    }

    return {
      success: true,
      webhook,
      rateLimit: {
        remaining,
        isPro,
        nextReset: Math.floor(Date.now() / 3600000 + 1) * 3600000,
      },
    };
  } catch (error) {
    console.error("Error while connecting repo: ", error);
  }
};
