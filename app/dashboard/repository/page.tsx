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
import { Input } from "@/components/ui/input";
import { RepositoryListSkeleton } from "@/module/repository/components/repositoryListSkeleton";
import { useConnectRepository } from "@/module/repository/hooks/use-connect-repository";
import { useRepositories } from "@/module/repository/hooks/use-repositories";
import { ExternalLink, Star, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  isConnected?: boolean;
}

const RepositoryPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRepositories();

  const { mutate: connectRepo } = useConnectRepository();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(
    null
  );
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage and checkout all your Github Repositories:
          </p>
        </div>
        <RepositoryListSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div>Failed to load your repositories.</div>;
  }

  const allRepositories = data?.pages.flatMap((page) => page) || [];

  const filteredRepositories = allRepositories.filter((repo: Repository) =>
    debouncedQuery
      ? repo.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(debouncedQuery.toLowerCase())
      : true
  );

  const handleConnect = (repo: Repository) => {
    setLocalConnectingId(repo.id);

    connectRepo(
      {
        owner: repo.full_name.split("/")[0],
        repo: repo.name,
        githubId: repo.id,
      },
      {
        onSuccess: (data) => {
          toast.success(
            `✅ ${repo.name} connected! 
           ${data?.rateLimit?.remaining ?? "?"} left this hour`
          );
        },
        onError: (error: any) => {
          toast.error(error.message);

          if (error.message?.includes("limit")) {
            toast("⚡ Pro: 100 connections/hour vs Free: 5/hour", {
              action: {
                label: "Upgrade",
                onClick: () => (window.location.href = "/subscription"),
              },
              duration: 10000,
            });
          }
        },
        onSettled: () => setLocalConnectingId(null),
      }
    );
  };

  return (
    <div className="space-y-4">
      <Header
        title="Repositories"
        description="Manage and checkout all your Github Repositories:"
      />

      <div className="relative">
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search your repositorie..."
          className="pl-8 w-fit"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredRepositories.map((repo: Repository) => (
          <Card key={repo.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{repo.name}</CardTitle>
                    <Badge variant="outline">
                      {repo.language || "Unknown"}
                    </Badge>
                  </div>
                  <CardDescription>{repo.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferror"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    className="cursor-pointer"
                    onClick={() => handleConnect(repo)}
                    disabled={localConnectingId === repo.id || repo.isConnected}
                    variant={repo.isConnected ? "outline" : "default"}
                  >
                    {localConnectingId === repo.id
                      ? "Connecting..."
                      : repo.isConnected
                      ? "Connected"
                      : "Connect"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {repo.stargazers_count > 0 ? (
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    ) : (
                      <Star className="h-4 w-4 bg-transparent text-primary" />
                    )}
                    <span className="text-sm font-medium">
                      {repo.stargazers_count}
                    </span>
                    {repo.isConnected && (
                      <Badge variant="secondary">Connected</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && <RepositoryListSkeleton />}
        {!hasNextPage && allRepositories.length > 0 && (
          <p className="text-center text-muted-foreground">
            No More Repositories
          </p>
        )}
      </div>
    </div>
  );
};

export default RepositoryPage;
