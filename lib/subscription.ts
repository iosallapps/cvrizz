import { prisma } from "@/lib/prisma";

export type AccessLevel = "full" | "trial" | "expired" | "none";

export interface AccessCheck {
  level: AccessLevel;
  trialDaysLeft: number;
  canEdit: boolean;
  canExport: boolean;
  canUseAI: boolean;
  message?: string;
}

/**
 * Check user's access level based on their subscription status
 * Used for page-level access control
 */
export async function checkUserAccess(userId: string): Promise<AccessCheck> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      trialEndsAt: true,
      currentPeriodEnd: true,
    },
  });

  if (!user) {
    return {
      level: "none",
      trialDaysLeft: 0,
      canEdit: false,
      canExport: false,
      canUseAI: false,
      message: "User not found",
    };
  }

  const now = new Date();

  // Active subscription - full access
  if (user.subscriptionStatus === "ACTIVE") {
    return {
      level: "full",
      trialDaysLeft: 0,
      canEdit: true,
      canExport: true,
      canUseAI: true,
    };
  }

  // Trial period
  if (user.subscriptionStatus === "TRIAL" && user.trialEndsAt) {
    const trialEnd = new Date(user.trialEndsAt);
    if (now < trialEnd) {
      const daysLeft = Math.ceil(
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        level: "trial",
        trialDaysLeft: daysLeft,
        canEdit: true,
        canExport: true,
        canUseAI: true,
      };
    }
  }

  // Past due - 7 day grace period (can edit, no export)
  if (user.subscriptionStatus === "PAST_DUE" && user.currentPeriodEnd) {
    const gracePeriodEnd = new Date(user.currentPeriodEnd);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
    if (now < gracePeriodEnd) {
      return {
        level: "trial",
        trialDaysLeft: 0,
        canEdit: true,
        canExport: false,
        canUseAI: false,
        message: "Payment failed. Please update your payment method.",
      };
    }
  }

  // Cancelled - access until period end
  if (user.subscriptionStatus === "CANCELLED" && user.currentPeriodEnd) {
    const periodEnd = new Date(user.currentPeriodEnd);
    if (now < periodEnd) {
      const daysLeft = Math.ceil(
        (periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        level: "trial",
        trialDaysLeft: daysLeft,
        canEdit: true,
        canExport: true,
        canUseAI: true,
        message: `Subscription cancelled. Access ends in ${daysLeft} days.`,
      };
    }
  }

  // Expired
  return {
    level: "expired",
    trialDaysLeft: 0,
    canEdit: false,
    canExport: false,
    canUseAI: false,
    message: "Your trial has expired. Upgrade to continue.",
  };
}

/**
 * Check if user's trial/subscription is expired
 * Lightweight check for middleware (returns boolean only)
 */
export async function isSubscriptionExpired(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      trialEndsAt: true,
      currentPeriodEnd: true,
    },
  });

  if (!user) return true;

  const now = new Date();

  // Active subscription - not expired
  if (user.subscriptionStatus === "ACTIVE") {
    return false;
  }

  // Trial - check if within trial period
  if (user.subscriptionStatus === "TRIAL" && user.trialEndsAt) {
    return now >= new Date(user.trialEndsAt);
  }

  // Past due with grace period
  if (user.subscriptionStatus === "PAST_DUE" && user.currentPeriodEnd) {
    const gracePeriodEnd = new Date(user.currentPeriodEnd);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
    return now >= gracePeriodEnd;
  }

  // Cancelled but still within period
  if (user.subscriptionStatus === "CANCELLED" && user.currentPeriodEnd) {
    return now >= new Date(user.currentPeriodEnd);
  }

  // Everything else is expired
  return true;
}
