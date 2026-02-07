"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getResumes,
  createResume,
  deleteResume,
} from "@/app/actions/resume";
import { useState, useCallback } from "react";
import type { ResumeListItem } from "@/types/resume";

export function useResumes() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all resumes
  const query = useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });

  // Create mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: createResume,
    onSuccess: (newResume) => {
      queryClient.setQueryData<ResumeListItem[]>(["resumes"], (old) =>
        old ? [newResume, ...old] : [newResume]
      );
      toast.success("Resume created");
      router.push(`/editor/${newResume.id}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create resume"
      );
    },
    onSettled: () => {
      setIsCreating(false);
    },
  });

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["resumes"] });
      const previous = queryClient.getQueryData<ResumeListItem[]>(["resumes"]);
      queryClient.setQueryData<ResumeListItem[]>(["resumes"], (old) =>
        old?.filter((r) => r.id !== id)
      );
      return { previous };
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(["resumes"], context.previous);
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to delete resume"
      );
    },
    onSuccess: () => {
      toast.success("Resume deleted");
    },
  });

  // Prevent double-click on create
  const handleCreate = useCallback(
    async (title?: string) => {
      if (isCreating || createMutation.isPending) return;
      setIsCreating(true);
      createMutation.mutate(title);
    },
    [isCreating, createMutation]
  );

  return {
    resumes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    create: handleCreate,
    isCreating: isCreating || createMutation.isPending,
    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
