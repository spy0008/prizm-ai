"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectRepository } from "../actions";
import { toast } from "sonner";
import { UseRepoConnection } from "@/types/apiType";

export const useConnectRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ owner, repo, githubId }: UseRepoConnection) => {
      return await connectRepository(owner, repo, githubId);
    },
    onSuccess: () => {
      toast.success("Repository connected successfully!!!"),
        queryClient.invalidateQueries({ queryKey: ["repositories"] });
    },
    onError: (error) => {
      toast.error("Failed to connect repository!!!");
      console.error(error);
    },
  });
};
