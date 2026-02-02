"use client";

import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReviews } from "@/module/review/actions";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

const ReviewsPage = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      return await getReviews();
    },
  });

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      {/* Animated Grid Background */}
      <AnimatedBackground />

      <div className="relative z-10 space-y-4 px-6 md:px-12">

        <Header
          title="Review History"
          description="View All PRizm AI Code Reviews:"
        />

        {reviews?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No Reviews now. Connect a repository and open a PR to GitHub
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reviews?.map((review: any) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{review.prTitle}</CardTitle>
                        {review.status === "completed" && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                        {review.status === "failed" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                        {review.status === "pending" && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {review.repository.fullName} + PR #{review.prNumber}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={review.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </div>

                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-xs">
                          {review.review.substring(0, 300)}...
                        </pre>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link
                        href={review.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Full Review on Github
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default ReviewsPage;
