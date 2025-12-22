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

export type UseRepoConnection = {
  owner: string;
  repo: string;
  githubId: number
};

export type updateUserProfileType = {
  name?: string;
  email?: string;
}
