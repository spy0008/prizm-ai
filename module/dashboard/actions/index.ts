"use server";

import {
  fetchUserontributions,
  getGithubToken,
} from "@/module/github/lib/github";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";
import { ContributionCalendar } from "@/types/apiType";

export const getContributionStats = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized user");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    // Get users GitHub username
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;

    const calendar = (await fetchUserontributions(
      token,
      username
    )) as ContributionCalendar | null;

    if (!calendar) {
      return null;
    }

    const contributions = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => {
        const c = day.contributionCount;
        let level = 0;

        if (c === 1) level = 1;
        else if (c === 2 || c === 3) level = 2;
        else if (c >= 4 && c <= 6) level = 3;
        else if (c > 6) level = 4;

        return { date: day.date, count: c, level };
      })
    );

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    console.error("Error fetching contribution stats for graph:", error);
    return null;
  }
};

export const getDashboardStats = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized user");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    // Get users GitHub username
    const { data: user } = await octokit.rest.users.getAuthenticated();

    // TODO: fetch total connected repos from DB
    const totalRepos = 45;

    const calendar = (await fetchUserontributions(
      token,
      user.login
    )) as ContributionCalendar | null;

    const totalCommits = calendar?.totalContributions ?? 0;

    // Count PRs from GitHub
    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPRs = prs.total_count ?? 0;

    // TODO: count AI reviews from database
    const totalAiReviews = 40;

    return {
      totalCommits,
      totalAiReviews,
      totalPRs,
      totalRepos,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalCommits: 0,
      totalAiReviews: 0,
      totalPRs: 0,
      totalRepos: 0,
    };
  }
};

export const getMonthlyActivity = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized user");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    // Get users GitHub username
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calendar = (await fetchUserontributions(
      token,
      user.login
    )) as ContributionCalendar | null;

    if (!calendar) {
      return [];
    }

    type MonthlyBucket = { commits: number; prs: number; reviews: number };

    const monthlydata: Record<string, MonthlyBucket> = {};

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // e.g. "2025-Jan"
    const makeMonthKey = (d: Date) => {
      const year = d.getFullYear();
      const monthName = monthNames[d.getMonth()];
      return `${year}-${monthName}`;
    };

    // Last 6 months of data including current month
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = makeMonthKey(date);
      monthlydata[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    // Fill commits from contribution calendar
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const monthKey = makeMonthKey(date);
        if (monthlydata[monthKey]) {
          monthlydata[monthKey].commits += day.contributionCount;
        }
      });
    });

    // Last 6 months range for PRs / reviews
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // TODO: replace with real DB reviews
    const generateSampleReviews = () => {
      const sampleReviews: { createdAt: Date }[] = [];
      const now = new Date();

      // generate random reviews over the past ~6 months
      for (let i = 0; i < 40; i++) {
        const randomDayAgo = Math.floor(Math.random() * 180);
        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() - randomDayAgo);

        sampleReviews.push({ createdAt: reviewDate });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();

    reviews.forEach((review) => {
      const monthKey = makeMonthKey(review.createdAt);
      if (monthlydata[monthKey]) {
        monthlydata[monthKey].reviews += 1;
      }
    });

    // PRs in last 6 months
    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${
        sixMonthsAgo.toISOString().split("T")[0]
      }`,
      per_page: 100,
    });

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = makeMonthKey(date);
      if (monthlydata[monthKey]) {
        monthlydata[monthKey].prs += 1;
      }
    });

    const orderedKeys = Object.keys(monthlydata).sort((a, b) => {
      const [yearA, monthA] = a.split("-");
      const [yearB, monthB] = b.split("-");
      const idxA = monthNames.indexOf(monthA);
      const idxB = monthNames.indexOf(monthB);
      if (yearA === yearB) return idxA - idxB;
      return Number(yearA) - Number(yearB);
    });

    return orderedKeys.map((key) => ({
      name: key,
      ...monthlydata[key],
    }));
  } catch (error) {
    console.error("Error fetching monthly activity:", error);
    return [];
  }
};
