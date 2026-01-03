// Dashboard actions types
export type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type ContributionCalendar = {
  totalContributions: number;
  weeks: ContributionWeek[];
};

//github actions
export type UserContributionsResponse = {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  } | null;
};

export type webhookType = {
  owner: string;
  repo: string;
};

export type UseRepoConnection = {
  owner: string;
  repo: string;
  githubId: number;
};

export type updateUserProfileType = {
  name?: string;
  email?: string;
};

export type getRepoFileContentsTypes = {
  token: string;
  owner: string;
  repo: string;
  path?: string;
};

export type reviewPullRequestType = {
  owner: string;
  repo: string;
  prNumber: number;
  userId?: string;
};

export type getPullRequestDiffType = {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
};

export type postReviewCommentType = {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
  review: string;
};

// patyment and user tracking types
export type subscriptionTierType = "FREE" | "PRO";
export type subscriptionStatusType = "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface userLimits {
  tier: subscriptionTierType;
  repositories: {
    current: number;
    limit: number | null; // null = unlimited
    canAdd: boolean;
  };
  reviews: {
    [repositoryId: string]: {
      current: number;
      limit: number | null; // null = unlimited
      canAdd: boolean;
    };
  };
}

export interface subscriptionData {
  user: {
    id: string;
    name: string;
    email: string;
    subscriptionTier: string;
    subscriptionStatus: string | null;
    polarCustomerId: string | null;
    polarSubscriptionId: string | null;
  } | null;
  limits: {
    tier: subscriptionTierType;
    repositories: {
      current: number;
      limit: number | null; // null = unlimited
      canAdd: boolean;
    };
    reviews: {
      [repositoryId: string]: {
        current: number;
        limit: number | null; // null = unlimited
        canAdd: boolean;
      };
    };
  } | null;
}
