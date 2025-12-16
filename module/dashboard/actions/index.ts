"use server";

import {
  fetchUserontributions,
  getGithubToken,
} from "@/module/github/lib/github";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";

export const getDashboardStates = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized User!!!");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    //Get users github username
    const { data: user } = await octokit.rest.users.getAuthenticated();

    //Todo : FETCH TOTAL CONNECTED REPO FROM DB
    const totalRepos = 45; // for now

    const calendar = await fetchUserontributions(token, user.login);
    const totalCommits = calendar?.totalContributions || 0;

    //count PRs from DB or Github
    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPRs = prs.total_count;

    // Todo: COUNT AI REVIEWS FROM DATABASE
    const totalAiReviews = 40;

    return {
      totalCommits,
      totalAiReviews,
      totalPRs,
      totalRepos,
    };
  } catch (error) {
    console.error("Error to fetching dashboard states", error);
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
      throw new Error("Unauthorized User!!!");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    //Get users github username
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calendar = await fetchUserontributions(token, user.login);

    if (!calendar) {
      return [];
    }

    const monthlydata: {
      [key: string]: { commits: number; prs: number; reviews: number };
    } = {};

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

    // Last 6 month of data
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthNames[date.getMonth()];
      monthlydata[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const date = new Date(day.date);
        const monthKey = monthNames[date.getMonth()];
        if (monthlydata[monthKey]) {
          monthlydata[monthKey].commits += day.contributionCount;
        }
      });
    });

    //FETCH reviews from database fot last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    //todo: REVIEWS REAL DATA
    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      //generate random review over the past 6 month
      for (let i = 0; i < 40; i++) {
        const randomDayAgo = Math.floor(Math.random() * 180);
        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() - randomDayAgo);

        sampleReviews.push({
          createdAt: reviewDate,
        });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();

    reviews.forEach((review) => {
      const monthKey = monthNames[review.createdAt.getMonth()];
      if (monthlydata[monthKey]) {
        monthlydata[monthKey].reviews += 1;
      }
    });

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${
        sixMonthsAgo.toISOString().split("T")[0]
      }`,
      per_page: 100,
    });

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = monthNames[date.getMonth()];
      if (monthlydata[monthKey]) {
        monthlydata[monthKey].prs += 1;
      }
    });

    return Object.keys(monthlydata).map((name) => ({
      name,
      ...monthlydata[name],
    }));
  } catch (error) {
    console.error("Error to fetching monthly activity: ", error);
    return [];
  }
};
