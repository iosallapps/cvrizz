"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Clock, MoreVertical, Trash2, Copy, ArrowRight, TrendingUp, Zap, Target, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useUserStats } from "@/hooks/useUserStats";
import { useResumes } from "@/hooks/useResumes";
import { Skeleton } from "@/components/ui/skeleton";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { stats: userStats, isLoading: statsLoading } = useUserStats();
  const { resumes, isLoading: resumesLoading, create, isCreating, remove, isDeleting } = useResumes();
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteResumeId) {
      await remove(deleteResumeId);
      setDeleteResumeId(null);
    }
  };

  const isLoading = statsLoading || resumesLoading;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("goodMorning");
    if (hour < 18) return t("goodAfternoon");
    return t("goodEvening");
  };

  const stats = [
    {
      label: t("totalResumes"),
      value: userStats?.totalResumes ?? 0,
      icon: FileText,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      borderColor: "border-primary/20",
    },
    {
      label: t("aiCreditsLeft"),
      value: userStats?.aiCreditsRemaining ?? 0,
      icon: Zap,
      gradient: "from-ai/20 to-ai/5",
      iconBg: "bg-ai/10",
      iconColor: "text-ai",
      borderColor: "border-ai/20",
    },
    {
      label: t("trialDaysLeftStat"),
      value: userStats?.trialDaysRemaining ?? 0,
      icon: Clock,
      gradient: "from-success/20 to-success/5",
      iconBg: "bg-success/10",
      iconColor: "text-success",
      borderColor: "border-success/20",
    },
    {
      label: "Profile Score",
      value: userStats?.profileScore ?? 0,
      suffix: "%",
      icon: Target,
      gradient: "from-warning/20 to-warning/5",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      borderColor: "border-warning/20",
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Welcome Section - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 p-6 md:p-8"
      >
        {/* Animated background decorations */}
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.63 0.19 250 / 0.15) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.63 0.23 295 / 0.12) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium text-primary flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {getGreeting()}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            >
              {t("welcomeToDashboard")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground max-w-md text-base"
            >
              {t("dashboardSubtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button variant="outline" size="lg" className="bg-surface/50 backdrop-blur-sm border-border/50 hover:bg-surface/80" asChild>
              <Link href="/templates">
                {t("browseTemplates")}
              </Link>
            </Button>
            <Button variant="glow" size="lg" className="group" asChild>
              <Link href="/editor/new">
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                {t("createNewResume")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats Row - Premium Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsLoading ? (
          // Skeleton loading for stats
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-surface/80 backdrop-blur-xl border-border/50">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="w-4 h-4" />
                  </div>
                  <Skeleton className="h-10 w-20 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + index * 0.08,
                ease: [0.25, 0.4, 0.25, 1]
              }}
            >
              <Card className={cn(
                "relative overflow-hidden group cursor-default",
                "bg-gradient-to-br",
                stat.gradient,
                "border",
                stat.borderColor,
                "hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
                "hover:-translate-y-1"
              )}>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                <CardContent className="p-4 md:p-5 relative">
                  <div className="flex items-start justify-between mb-3">
                    <motion.div
                      className={cn("p-2.5 rounded-xl", stat.iconBg)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                    </motion.div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                    </div>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resumes Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">{t("myResumes")}</h2>
            {resumes.length > 0 && (
              <Button variant="ghost" size="sm" className="group" asChild>
                <Link href="/resumes">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
          </div>

          {resumesLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-surface/80 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="relative overflow-hidden border-dashed border-2 border-border/50 bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl">
                {/* Animated background */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, oklch(0.63 0.19 250 / 0.08) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <CardContent className="relative flex flex-col items-center justify-center py-16 md:py-20 text-center">
                  {/* Animated illustration */}
                  <motion.div
                    className="relative mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/30 to-ai/30 blur-3xl rounded-full scale-150"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-primary/20 to-ai/20 border border-primary/30 flex items-center justify-center backdrop-blur-xl">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <FileText className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-3xl font-bold text-foreground mb-3"
                  >
                    {t("noResumesYet")}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground max-w-sm mb-8 text-base"
                  >
                    {t("createFirstResume")}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <Button variant="outline" size="lg" className="bg-surface/50" asChild>
                      <Link href="/templates">{t("browseTemplates")}</Link>
                    </Button>
                    <Button variant="glow" size="lg" className="group" asChild>
                      <Link href="/editor/new">
                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        {t("createYourFirstResume")}
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid sm:grid-cols-2 gap-4"
            >
              {resumes.slice(0, 4).map((resume) => (
                <motion.div key={resume.id} variants={staggerItem}>
                  <Card className="group hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-surface/80 backdrop-blur-xl">
                    <Link href={`/editor/${resume.id}`} className="block">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="w-14 h-18 rounded-xl bg-gradient-to-br from-primary/10 to-ai/10 border border-primary/20 flex items-center justify-center">
                            <FileText className="h-7 w-7 text-primary" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.preventDefault()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-elevated/95 backdrop-blur-xl border-border">
                              <DropdownMenuItem className="text-foreground">
                                <Copy className="h-4 w-4 mr-2" />
                                {t("duplicate")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem
                                className="text-error focus:text-error"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDeleteResumeId(resume.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {resume.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-xs mt-2">
                          <Clock className="h-3 w-3" />
                          {t("lastEdited")} {new Date(resume.updatedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}

              {/* Add new card */}
              <motion.div variants={staggerItem}>
                <Card className="border-dashed border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full min-h-[180px] group">
                  <Link href="/editor/new" className="flex flex-col items-center justify-center h-full p-6">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-ai/10 flex items-center justify-center mb-3 border border-primary/20"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Plus className="h-6 w-6 text-primary" />
                    </motion.div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {t("createNewResume")}
                    </p>
                  </Link>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Tips & Upgrade */}
        <div className="space-y-4">
          {/* Quick Tips - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="overflow-hidden bg-surface/80 backdrop-blur-xl border-border/50">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="text-base flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Zap className="h-5 w-5 text-primary" />
                  </motion.div>
                  {t("quickTips")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-sm">
                  {[
                    t("tip1"),
                    t("tip2"),
                    t("tip3"),
                  ].map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-3 text-muted-foreground group"
                    >
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </span>
                      <span className="group-hover:text-foreground transition-colors">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upgrade Card - Premium */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="relative overflow-hidden border-primary/30 bg-surface/80 backdrop-blur-xl">
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-ai/15"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, oklch(0.63 0.19 250 / 0.25) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <CardContent className="relative p-5">
                <motion.div
                  className="flex items-center gap-2 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-primary to-ai px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    PRO
                  </span>
                </motion.div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t("upgradeToPro")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("unlockFeatures")}
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground mb-5">
                  {[
                    "Unlimited resumes",
                    "50 AI credits/month",
                    "Premium templates",
                  ].map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                        <span className="text-success text-xs">✓</span>
                      </span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <Button variant="glow" className="w-full group" asChild>
                  <Link href="/billing">
                    {t("viewPlans")}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteResumeId} onOpenChange={(open) => !open && setDeleteResumeId(null)}>
        <AlertDialogContent className="bg-elevated border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-error hover:bg-error/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
