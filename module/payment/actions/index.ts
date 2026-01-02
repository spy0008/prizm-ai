"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { getRemainingLimits, updateUserTier } from "../lib/subscription";
import { subscriptionData } from "@/types/apiType";
import { polarClient } from "../config/polar";

export async function getSubscriptionData(): Promise<subscriptionData> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { user: null, limits: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      polarCustomerId: true,
      polarSubscriptionId: true,
    },
  });

  if (!user) {
    return { user: null, limits: null };
  }

  const limits = await getRemainingLimits(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      subscriptionTier: user.subscriptionTier ?? "FREE",
      subscriptionStatus: user.subscriptionStatus ?? null,
      polarCustomerId: user.polarCustomerId ?? null,
      polarSubscriptionId: user.polarSubscriptionId ?? null,
    },
    limits,
  };
}

export async function syncSubscriptionStatus() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Not Authenticated!");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, polarCustomerId: true },
  });

  if (!user?.polarCustomerId) {
    return {
      success: false,
      message: "No Polar customer ID found",
    };
  }

  try {
    // Fetch subs from Polar
    const result = await polarClient.subscriptions.list({
      customerId: user.polarCustomerId,
    });

    const subscriptions = result.result?.items || [];

    // Find active subscription (most important)
    const activeSub = subscriptions.find((sub) => sub.status === "active");

    if (activeSub) {
      await updateUserTier(user.id, "PRO", "ACTIVE", activeSub.id);
      return { success: true, status: "ACTIVE" };
    }

    // No active subs - downgrade
    if (subscriptions.length > 0) {
      const latestSub = subscriptions[0];
      const status = latestSub.status === "canceled" ? "CANCELLED" : "EXPIRED";
      await updateUserTier(user.id, "FREE", status);
      return { success: true, status: "SYNCED_TO_FREE" };
    }

    // No subscriptions at all
    await updateUserTier(user.id, "FREE", "EXPIRED");
    return { success: true, status: "NO_SUBSCRIPTIONS" };
  } catch (error) {
    console.error("Polar sync failed:", error);
    return {
      success: false,
      message: "Polar API error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
