"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconDocument, IconSettings, IconLogout, IconBilling, IconSparkles, IconMenu } from "@/components/icons";
import { Crown, Clock } from "lucide-react";
import { useSidebar } from "@/lib/sidebar";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useLanguage } from "@/lib/i18n";
import { useUserStats } from "@/hooks/useUserStats";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { toggle } = useSidebar();
  const { stats: userStats, isLoading: statsLoading } = useUserStats();

  // Subscription data
  const trialDaysRemaining = userStats?.trialDaysRemaining ?? 14;
  const isTrialActive = userStats?.isTrialActive ?? true;
  const hasActiveSubscription = userStats?.hasActiveSubscription ?? false;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success(t("signOut"));
    router.push("/");
    router.refresh();
  };

  const initials =
    user.user_metadata?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || user.email?.[0].toUpperCase();

  return (
    <header className="bg-surface/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2">
          {/* Hamburger menu - doar pe mobile/tablet */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 min-h-[44px] min-w-[44px]"
            onClick={toggle}
          >
            <IconMenu className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <IconDocument className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              ResumeAI
            </span>
          </Link>
        </div>

        {/* Trial Badge + Theme + Language + User Menu */}
        <div className="flex items-center gap-3">
          {/* Subscription Badge */}
          {!statsLoading && (
            hasActiveSubscription ? (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <Crown className="h-3.5 w-3.5 text-success" />
                <span className="text-sm font-medium text-success">Pro</span>
              </div>
            ) : isTrialActive ? (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ai/10 border border-ai/20">
                <IconSparkles className="h-3.5 w-3.5 text-ai" />
                <span className="text-sm font-medium text-ai">{t("trialDaysLeft", { days: trialDaysRemaining })}</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
                <Clock className="h-3.5 w-3.5 text-warning" />
                <span className="text-sm font-medium text-warning">{t("trialExpired")}</span>
              </div>
            )
          )}

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-hover"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-elevated border-border"
              align="end"
              forceMount
            >
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.user_metadata?.name && (
                    <p className="font-medium text-foreground">
                      {user.user_metadata.name}
                    </p>
                  )}
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer text-foreground hover:text-foreground"
                >
                  <IconSettings className="mr-2 h-4 w-4" />
                  {t("settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/billing"
                  className="cursor-pointer text-foreground hover:text-foreground"
                >
                  <IconBilling className="mr-2 h-4 w-4" />
                  {t("billing")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                className="cursor-pointer text-error focus:text-error hover:text-error"
                onClick={handleSignOut}
              >
                <IconLogout className="mr-2 h-4 w-4" />
                {t("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
