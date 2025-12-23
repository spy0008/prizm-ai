"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { deleteWebhook } from "@/module/github/lib/github";
import { updateUserProfileType } from "@/types/apiType";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getUserProfile = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error while getting user profile: ", error);
    return null;
  }
};

export async function updateUserProfile(data: updateUserProfileType) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const updateUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/dashboard/settings", "page");

    return {
      success: true,
      user: updateUser,
    };
  } catch (error) {
    console.error("Error while updating user profile: ", error);
    return null;
  }
}

export async function getConnectedRepositories() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return repositories;
  } catch (error) {
    console.error("Error while get connected repo: ", error);
  }
}

export async function disconnectRepository(reposotoryId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const repository = await prisma.repository.findUnique({
      where: {
        id: reposotoryId,
        userId: session.user.id,
      },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    await deleteWebhook(repository.owner, repository.name);
    await prisma.repository.delete({
      where: {
        id: repository.id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");

    return true;
  } catch (error) {
    console.error("Error while disconnecting repository: ", error);
    return {
      success: false,
      error: "Failed to disconnect repository",
    };
  }
}

export async function disconnectAllRepository() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (!repositories) {
      throw new Error("Repositories not found");
    }

    await Promise.all(
      repositories.map(async (repo) => {
        await deleteWebhook(repo.owner, repo.name);
      })
    );

    const result = await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");

    return {
      success: true,
      count: result.count,
    };
  } catch (error) {
    console.error("Error while disconnecting repository: ", error);
    return {
      success: false,
      error: "Failed to disconnect repository",
    };
  }
}
