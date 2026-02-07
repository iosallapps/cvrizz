"use client";

import { useState, useEffect } from "react";
import { getCurrentUserStats } from "@/app/actions/user";
import type { UserStats } from "@/lib/user";

interface UseUserStatsReturn {
  stats: UserStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage user stats
 */
export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCurrentUserStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user stats"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Format trial days remaining for display
 */
export function formatTrialDays(days: number): string {
  if (days <= 0) return "Expired";
  if (days === 1) return "1 day";
  return `${days} days`;
}

/**
 * Format member since date
 */
export function formatMemberSince(date: Date, language: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString(
    language === "ro" ? "ro-RO" : "en-US",
    options
  );
}
