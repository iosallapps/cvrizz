"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import {
  getResume,
  updateResume,
  updateResumeMetadata,
  createResume,
} from "@/app/actions/resume";
import { createClient } from "@/lib/supabase/client";
import type { ResumeData, ResumeMetadata, SaveStatus } from "@/types/resume";

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

export function useResume(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const pendingSave = useRef<ResumeData | null>(null);
  const retryCount = useRef(0);
  const isNewResume = id === "new";

  // Handle "new" resume creation
  useEffect(() => {
    if (isNewResume) {
      createResume()
        .then((resume) => {
          router.replace(`/editor/${resume.id}`);
        })
        .catch((error) => {
          toast.error("Failed to create resume");
          router.push("/dashboard");
        });
    }
  }, [isNewResume, router]);

  // Fetch existing resume
  const query = useQuery({
    queryKey: ["resume", id],
    queryFn: () => getResume(id),
    enabled: !isNewResume && !!id,
    retry: 2,
  });

  // Check session before saving
  const checkSession = useCallback(async (): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Session expired. Please sign in again.");
      router.push("/login?redirect=/editor/" + id);
      return false;
    }
    return true;
  }, [id, router]);

  // Save with retry logic
  const saveWithRetry = useCallback(
    async (data: ResumeData): Promise<boolean> => {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          // Check session on first attempt
          if (attempt === 0 && !(await checkSession())) {
            return false;
          }

          await updateResume(id, data);
          retryCount.current = 0;
          return true;
        } catch (error) {
          console.error(`Save attempt ${attempt + 1} failed:`, error);

          if (attempt < MAX_RETRIES - 1) {
            await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
          }
        }
      }
      return false;
    },
    [id, checkSession]
  );

  // Debounced auto-save
  const debouncedSave = useDebouncedCallback(async (data: ResumeData) => {
    if (isNewResume) return;

    setSaveStatus("saving");
    pendingSave.current = data;

    const success = await saveWithRetry(data);

    if (success) {
      setSaveStatus("saved");
      pendingSave.current = null;
      // Update cache
      queryClient.setQueryData(["resume", id], (old: any) => ({
        ...old,
        data,
        updatedAt: new Date(),
      }));
    } else {
      setSaveStatus("error");
      toast.error("Failed to save. Your changes may be lost.", {
        action: {
          label: "Retry",
          onClick: () => debouncedSave(data),
        },
      });
    }
  }, 1500);

  // Update resume data (triggers auto-save)
  const setResumeData = useCallback(
    (updater: ResumeData | ((prev: ResumeData) => ResumeData)) => {
      queryClient.setQueryData(["resume", id], (old: any) => {
        if (!old) return old;
        const newData =
          typeof updater === "function" ? updater(old.data) : updater;
        debouncedSave(newData);
        return { ...old, data: newData };
      });
    },
    [id, queryClient, debouncedSave]
  );

  // Immediate metadata save
  const metadataMutation = useMutation({
    mutationFn: (data: ResumeMetadata) => updateResumeMetadata(id, data),
    onMutate: async (newMetadata) => {
      await queryClient.cancelQueries({ queryKey: ["resume", id] });
      const previous = queryClient.getQueryData(["resume", id]);
      queryClient.setQueryData(["resume", id], (old: any) => ({
        ...old,
        metadata: { ...old?.metadata, ...newMetadata },
      }));
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["resume", id], context.previous);
      }
      toast.error("Failed to update");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] }); // Update dashboard
    },
  });

  // Save pending changes before unmount
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingSave.current) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return {
    resume: query.data?.data ?? null,
    metadata: query.data?.metadata ?? null,
    isLoading: isNewResume || query.isLoading,
    isError: query.isError,
    error: query.error?.message ?? null,
    saveStatus,
    setResumeData,
    setResumeMetadata: metadataMutation.mutate,
    hasPendingChanges: pendingSave.current !== null,
  };
}
