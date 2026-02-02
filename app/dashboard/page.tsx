"use client";

import { StatCard } from "@/module/dashboard/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getDashboardStats,
  getMonthlyActivity,
} from "@/module/dashboard/actions";
import { useQuery } from "@tanstack/react-query";
import { FileCheck, GitBranch, GitCommit, GitPullRequest } from "lucide-react";
import ContributionGraph from "@/module/dashboard/components/contribution-graph";
import { Spinner } from "@/components/ui/spinner";
import BarGraph from "@/module/dashboard/components/bar-graph";
import Header from "@/components/header";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => await getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  const { data: monthlyActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: async () => await getMonthlyActivity(),
    refetchOnWindowFocus: false,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      {/* Animated Grid Background */}
      <AnimatedBackground />

      <div className="relative z-10 space-y-6 px-6 md:px-12">

        <Header
          title="Dashboard"
          description="Snapshot of Your AI Review Activity:"
        />

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Repos"
            value={stats?.totalRepos || 0}
            icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
            helperText="Connected Repos"
            isLoading={isLoading}
          />

          <StatCard
            title="Total Commits"
            value={stats?.totalCommits || 0}
            icon={<GitCommit className="h-4 w-4 text-muted-foreground" />}
            helperText="In the last year"
            isLoading={isLoading}
          />

          <StatCard
            title="Total PRs"
            value={stats?.totalPRs || 0}
            icon={<GitPullRequest className="h-4 w-4 text-muted-foreground" />}
            helperText="In the last year"
            isLoading={isLoading}
          />

          <StatCard
            title="Total Reviews"
            value={stats?.totalAiReviews || 0}
            icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
            helperText="PRizm AI Generated reviews"
            isLoading={isLoading}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Snapshot of your Contribution Activity</CardTitle>
            <CardDescription>
              A quick overview of your last year of GitHub contributions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContributionGraph />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>
                Monthly Snapshot of your commits, PRs and reviews (last 6 months)
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isLoadingActivity ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="h-80 w-full">
                  <BarGraph data={monthlyActivity || []} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
};

export default Dashboard;
