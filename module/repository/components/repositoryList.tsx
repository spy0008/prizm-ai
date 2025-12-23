import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  disconnectAllRepository,
  disconnectRepository,
  getConnectedRepositories,
} from "@/module/settings/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const RepositoryList = () => {
  const queryClient = useQueryClient();
  const [disconnectedAllOpen, setDisconnectedAllOpen] = useState(false);

  const { data: repositories, isLoading } = useQuery({
    queryKey: ["connected-repositories"],
    queryFn: async () => await getConnectedRepositories(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const disconnectMutation = useMutation({
    mutationFn: async (repositoryId: string) => {
      return await disconnectRepository(repositoryId);
    },
    onSuccess: (result) => {
      if (result === true || result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Repository disconnected successfully!!!");
      } else {
        toast.error(result?.error || "Failed to disconnected Repository!!!");
      }
    },
  });

  const disconnectAllMutation = useMutation({
    mutationFn: async () => {
      return await disconnectAllRepository();
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success(
          `disconnected ${result.count} repositories successfully!!!`
        );
        setDisconnectedAllOpen(false);
      } else {
        toast.error(
          result?.error || "Failed to disconnected all Repository!!!"
        );
      }
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>Manage your connected Github repos:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>
              Manage your connected Github repos:
            </CardDescription>
          </div>

          {repositories && repositories.length > 0 && (
            <AlertDialog
              open={disconnectedAllOpen}
              onOpenChange={setDisconnectedAllOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect All
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    your want to Disconnected All Repositories?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disconnect your all {repositories.length}{" "}
                    repositories and delete all associated AI reviews. This
                    action connot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => disconnectAllMutation.mutate()}
                    className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
                    disabled={disconnectAllMutation.isPending}
                  >
                    {disconnectAllMutation.isPending
                      ? "Disconnecting..."
                      : "Disconnect All"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!repositories || repositories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No repositories connected for now.</p>
            <p className="text-sm mt-2">
              Connect repositories from the{" "}
              <Link
                className="underline hover:text-primary"
                href="/dashboard/repository"
              >
                Repository page
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{repo.fullName}</h3>
                    <Link
                      href={repo.url}
                      target="_blank"
                      rel="noonpener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="cursor-pointer"
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        your want to Disconnected Repository?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disconnect your{" "}
                        <strong>{repo.fullName}</strong> and delete all
                        associated AI reviews. This action connot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => disconnectMutation.mutate(repo.id)}
                        className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
                        disabled={disconnectMutation.isPending}
                      >
                        {disconnectMutation.isPending
                          ? "Disconnecting..."
                          : "Disconnect "}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepositoryList;
