"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import { getContributionStats } from "../actions";

const ContributionGraph = () => {
  const { theme } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => await getContributionStats(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">
          Wait Loading Your Contribution...
        </div>
      </div>
    );
  }

  if (!data || !data.contributions?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="text-muted-foreground">
          No Contribution Available Yet
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {data.totalContributions}
        </span>
        <span className="ml-2">Contributions in the last year.</span>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex justify-center min-w-max px-4">
          <ActivityCalendar
            data={data.contributions}
            colorScheme={theme === "dark" ? "dark" : "light"}
            blockSize={11}
            blockMargin={4}
            fontSize={14}
            showWeekdayLabels
            showMonthLabels
            theme={{
              light: [
                "hsl(0, 0%, 96%)", 
                "hsl(210, 90%, 88%)", 
                "hsl(210, 85%, 72%)",
                "hsl(210, 80%, 60%)", 
                "hsl(210, 85%, 45%)", 
              ],
              dark: [
                "#0b1120", 
                "hsl(210, 80%, 40%)",
                "hsl(210, 85%, 50%)",
                "hsl(210, 90%, 60%)",
                "hsl(210, 95%, 70%)",
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
