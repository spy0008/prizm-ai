"use server";

import prisma from "@/lib/db";
import {
  subscriptionStatusType,
  subscriptionTierType,
  userLimits,
} from "@/types/apiType";

const TIER_LIMITS = {
  FREE: {
    repositories: { limit: 3 },
    reviews: { limit: 10 }, // per repo/month
  },
  PRO: {
    repositories: { limit: null }, // unlimited
    reviews: { limit: null },
  },
} as const satisfies Record<
  subscriptionTierType,
  {
    repositories: { limit: number | null };
    reviews: { limit: number | null };
  }
>;

export async function getUserTier(
  userId: string
): Promise<subscriptionTierType> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      subscriptionTier: true,
    },
  });

  return (user?.subscriptionTier as subscriptionTierType) ?? "FREE";
}

export async function getUserUsage(userId: string) {
  let usage = await prisma.userUsage.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      repositoryCount: 0,
      reviewCounts: {},
    },
  });

  return usage;
}

export async function canConnectRepository(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);

  if (tier === "PRO") {
    return true; // unlimited for PRO users
  }

  const usage = await getUserUsage(userId);
  const limit = TIER_LIMITS.FREE.repositories.limit;

  return usage.repositoryCount < limit;
}

export async function canCreateReview(
  userId: string,
  repositoryId: string
): Promise<boolean> {
  const tier = await getUserTier(userId);

  if (tier === "PRO") {
    return true; // unlimited for PRO users
  }

  const usage = await getUserUsage(userId);
  const reviewCounts = usage.reviewCounts as Record<string, number>;
  const currentCount = reviewCounts[repositoryId] || 0;
  const limit = TIER_LIMITS.FREE.reviews.limit;

  return currentCount < limit;
}

export async function incrementRepositoryCount(userId: string): Promise<void> {
  await getUserUsage(userId);

  await prisma.userUsage.upsert({
    where: { userId },
    create: {
      userId,
      repositoryCount: 1,
      reviewCounts: {},
    },
    update: {
      repositoryCount: {
        increment: 1,
      },
    },
  });
}

export async function decrementRepositoryCount(userId: string): Promise<void> {
  const usage = await getUserUsage(userId);

  await prisma.userUsage.update({
    where: { userId },
    data: {
      repositoryCount: Math.max(0, usage.repositoryCount - 1),
    },
  });
}

export async function incrementReviewCount(
  userId: string,
  repositoryId: string
): Promise<void> {
  const usage = await getUserUsage(userId);
  const reviewCounts = usage.reviewCounts as Record<string, number>;

  const updatedReviewCounts = {
    ...reviewCounts,
    [repositoryId]: (reviewCounts[repositoryId] || 0) + 1,
  };

  await prisma.userUsage.update({
    where: { userId },
    data: {
      reviewCounts: updatedReviewCounts,
    },
  });
}

export async function getRemainingLimits(userId: string): Promise<userLimits> {
  const tier = await getUserTier(userId);
  const usage = await getUserUsage(userId);
  const reviewCounts = usage.reviewCounts as Record<string, number>;

  const freeRepoLimit = TIER_LIMITS.FREE.repositories.limit;
  const freeReviewLimit = TIER_LIMITS.FREE.reviews.limit;

  const limits: userLimits = {
    tier,
    repositories: {
      current: usage.repositoryCount,
      limit: tier === "PRO" ? null : freeRepoLimit,
      canAdd: tier === "PRO" || usage.repositoryCount < freeRepoLimit,
    },
    reviews: {},
  };

  // Get user's repositories
  const repositories = await prisma.repository.findMany({
    where: { userId },
    select: { id: true },
  });

  // Per-repo review limits
  for (const repo of repositories) {
    const currentCount = reviewCounts[repo.id] || 0;
    limits.reviews[repo.id] = {
      current: currentCount,
      limit: tier === "PRO" ? null : freeReviewLimit,
      canAdd: tier === "PRO" || currentCount < freeReviewLimit,
    };
  }

  return limits;
}

export async function updateUserTier(
  userId: string,
  tier: subscriptionTierType,
  status: subscriptionStatusType,
  polarSubscriptionId?: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: status,
    },
  });
}

export async function updatePolarCustomerId(
  userId: string,
  polarCustomerId: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      polarCustomerId,
    },
  });
}
