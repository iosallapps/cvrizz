"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserStats, getOrCreateUser, syncUserFromAuth, type UserStats } from "@/lib/user";

/**
 * Get current user's stats (server action)
 */
export async function getCurrentUserStats(): Promise<UserStats | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Sync user data and get stats
    await syncUserFromAuth(user);
    return await getUserStats(user.id);
  } catch (error) {
    console.error("Error in getCurrentUserStats:", error);
    return null;
  }
}

/**
 * Get user's resumes count
 */
export async function getUserResumesCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return 0;

    const stats = await getUserStats(user.id);
    return stats?.totalResumes ?? 0;
  } catch (error) {
    console.error("Error in getUserResumesCount:", error);
    return 0;
  }
}
