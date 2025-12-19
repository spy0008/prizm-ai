type MonthlyActivity = {
  name: string;
  commits: number;
  prs: number;
  reviews: number;
};

export type ActivityBarChartProps = {
  data: MonthlyActivity[] | undefined;
};