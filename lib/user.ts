import { prisma } from "./prisma";
import { SubscriptionStatus } from "@prisma/client";

export interface UserStats {
  // User info
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;

  // Subscription
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: Date;
  trialDaysRemaining: number;
  isTrialActive: boolean;

  // AI Credits
  aiCreditsUsed: number;
  aiCreditsLimit: number;
  aiCreditsRemaining: number;
  aiCreditsResetAt: Date;

  // Resumes
  totalResumes: number;

  // Computed
  profileScore: number;
  hasActiveSubscription: boolean;
}

// AI credits limits by subscription status
const AI_CREDITS_LIMITS: Record<SubscriptionStatus, number> = {
  TRIAL: 10,
  TRIAL_EXPIRED: 0,
  ACTIVE: 50,
  PAST_DUE: 50,
  CANCELLED: 0,
};

/**
 * Get user stats from database
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { resumes: true },
        },
      },
    });

    if (!user) return null;

    const now = new Date();
    const trialEndsAt = new Date(user.trialEndsAt);
    const trialDaysRemaining = Math.max(
      0,
      Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
    const isTrialActive = user.subscriptionStatus === "TRIAL" && trialDaysRemaining > 0;

    const aiCreditsLimit = AI_CREDITS_LIMITS[user.subscriptionStatus];
    const aiCreditsRemaining = Math.max(0, aiCreditsLimit - user.aiCreditsUsed);

    // Calculate profile score based on user completeness
    const profileScore = calculateProfileScore(user);

    // Check if user has active subscription
    const hasActiveSubscription =
      user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "PAST_DUE" ||
      isTrialActive;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt,
      trialDaysRemaining,
      isTrialActive,
      aiCreditsUsed: user.aiCreditsUsed,
      aiCreditsLimit,
      aiCreditsRemaining,
      aiCreditsResetAt: user.aiCreditsResetAt,
      totalResumes: user._count.resumes,
      profileScore,
      hasActiveSubscription,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
}

/**
 * Calculate profile completeness score
 */
function calculateProfileScore(user: { name: string | null; email: string }): number {
  let score = 0;
  const checks = [
    { condition: !!user.email, weight: 30 },
    { condition: !!user.name, weight: 30 },
    { condition: user.name && user.name.includes(" "), weight: 20 }, // Full name
    { condition: true, weight: 20 }, // Base score for having account
  ];

  for (const check of checks) {
    if (check.condition) {
      score += check.weight;
    }
  }

  return Math.min(100, score);
}

/**
 * Get or create user in database from Supabase auth
 */
export async function getOrCreateUser(authUser: {
  id: string;
  email?: string;
  user_metadata?: { name?: string };
}): Promise<UserStats | null> {
  if (!authUser.email) return null;

  try {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    // Create if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || null,
        },
      });
    }

    return getUserStats(authUser.id);
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    return null;
  }
}

/**
 * Sync user data from Supabase auth to database
 */
export async function syncUserFromAuth(authUser: {
  id: string;
  email?: string;
  user_metadata?: { name?: string };
  created_at?: string;
}): Promise<void> {
  if (!authUser.email) return;

  try {
    await prisma.user.upsert({
      where: { id: authUser.id },
      create: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || null,
      },
      update: {
        email: authUser.email,
        name: authUser.user_metadata?.name || undefined,
      },
    });
  } catch (error) {
    console.error("Error syncing user:", error);
  }
}
