"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useUserStats, formatMemberSince } from "@/hooks/useUserStats";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, deleteAccount } from "@/app/actions/settings";
import { toast } from "sonner";
import {
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  AlertTriangle,
  ChevronRight,
  Camera,
  Smartphone,
  Laptop,
  Check,
  Settings,
  Sparkles,
  Loader2,
} from "lucide-react";

type SettingsSection =
  | "profile"
  | "language"
  | "appearance"
  | "notifications"
  | "security"
  | "danger";

const sectionIcons = {
  profile: { icon: User, color: "text-primary", bg: "bg-primary/10", gradient: "from-primary/20 to-primary/5", border: "border-primary/30" },
  language: { icon: Globe, color: "text-success", bg: "bg-success/10", gradient: "from-success/20 to-success/5", border: "border-success/30" },
  appearance: { icon: Palette, color: "text-ai", bg: "bg-ai/10", gradient: "from-ai/20 to-ai/5", border: "border-ai/30" },
  notifications: { icon: Bell, color: "text-warning", bg: "bg-warning/10", gradient: "from-warning/20 to-warning/5", border: "border-warning/30" },
  security: { icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10", gradient: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
  danger: { icon: AlertTriangle, color: "text-error", bg: "bg-error/10", gradient: "from-error/20 to-error/5", border: "border-error/30" },
};

export default function SettingsPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { stats: userStats, isLoading } = useUserStats();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  // Form state
  const [profileName, setProfileName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Sync profile name when stats load
  useEffect(() => {
    if (userStats?.name) setProfileName(userStats.name);
  }, [userStats?.name]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile(profileName);
      toast.success(t("profileUpdated"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPwd) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("passwordTooShort"));
      return;
    }
    setIsSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success(t("passwordUpdated"));
      setNewPassword("");
      setConfirmPwd("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update password";
      toast.error(message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success(t("accountDeleted"));
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  // User data from database
  const user = {
    name: userStats?.name || "",
    email: userStats?.email || "",
    memberSince: userStats?.createdAt
      ? formatMemberSince(userStats.createdAt, language)
      : "",
  };

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || user.email?.[0]?.toUpperCase() || "?";

  const sections: { id: SettingsSection; label: string }[] = [
    { id: "profile", label: t("profileInformation") },
    { id: "language", label: t("language") },
    { id: "appearance", label: t("appearance") },
    { id: "notifications", label: t("notifications") },
    { id: "security", label: t("security") },
    { id: "danger", label: t("dangerZone") },
  ];

  const languages = [
    { code: "ro", label: "Romana", flag: "🇷🇴" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ] as const;

  const themes = [
    { value: "light", label: t("light"), emoji: "☀️" },
    { value: "dark", label: t("dark"), emoji: "🌙" },
    { value: "system", label: t("system"), emoji: "💻" },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header - Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 p-6"
      >
        {/* Animated background */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.63 0.19 250 / 0.1) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative flex items-center gap-4">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20 border border-primary/30"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Settings className="h-7 w-7 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {t("settings")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("accountSettings")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile Section Tabs - Premium */}
      <div className="md:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {sections.map((section, index) => {
            const iconData = sectionIcons[section.id];
            const Icon = iconData.icon;
            const isActive = activeSection === section.id;

            return (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all text-sm font-medium",
                  isActive
                    ? "bg-gradient-to-r from-primary to-ai text-white shadow-lg shadow-primary/25"
                    : "bg-surface/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{section.label.split(" ")[0]}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Desktop Sidebar Navigation - Premium */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:block w-64 flex-shrink-0"
        >
          <Card className="sticky top-24 bg-surface/60 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
            <CardContent className="p-3">
              <nav className="space-y-1.5">
                {sections.map((section, index) => {
                  const iconData = sectionIcons[section.id];
                  const Icon = iconData.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left",
                        isActive
                          ? cn("bg-gradient-to-r shadow-lg border", iconData.gradient, iconData.border)
                          : "text-muted-foreground hover:text-foreground hover:bg-hover/50"
                      )}
                    >
                      <motion.div
                        className={cn("p-2 rounded-xl transition-all", isActive ? iconData.bg : "bg-muted/50")}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? iconData.color : "text-muted-foreground")} />
                      </motion.div>
                      <span className={cn("font-medium text-sm flex-1", isActive && "text-foreground")}>{section.label}</span>
                      <motion.div
                        animate={{ x: isActive ? 0 : -5, opacity: isActive ? 1 : 0 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </motion.button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Card className="bg-surface/60 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-5">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-24 w-24 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-6 w-32 rounded-full" />
                          </div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            className="relative group"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-ai text-white text-2xl font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <motion.button
                              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Camera className="h-6 w-6 text-white" />
                            </motion.button>
                            {/* Online indicator */}
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-surface" />
                          </motion.div>
                          <div className="flex-1">
                            <CardTitle className="text-foreground text-xl">
                              {t("profileInformation")}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">
                              {t("updatePersonalInfo")}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                                {t("memberSince")}: {user.memberSince}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {isLoading ? (
                      <>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground font-medium">
                            {t("fullName")}
                          </Label>
                          <Input
                            id="name"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder={t("name")}
                            className="bg-elevated/50 border-border/50 focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground font-medium">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={user?.email || ""}
                            disabled
                            className="bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed"
                          />
                          <p className="text-xs text-muted-foreground">
                            {t("emailCannotChange")}
                          </p>
                        </div>
                        <Button
                          variant="glow"
                          className="mt-2"
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                        >
                          {isSavingProfile ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("updatingProfile")}</>
                          ) : (
                            t("saveChanges")
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Language Section */}
            {activeSection === "language" && (
              <motion.div
                key="language"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Card className="bg-surface/60 backdrop-blur-xl border-border/50 shadow-xl shadow-success/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={cn("p-3 rounded-2xl", sectionIcons.language.bg, "border", sectionIcons.language.border)}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        <Globe className={cn("h-6 w-6", sectionIcons.language.color)} />
                      </motion.div>
                      <div>
                        <CardTitle className="text-foreground text-xl">{t("language")}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {t("chooseLanguage")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {languages.map((lang, index) => (
                        <motion.button
                          key={lang.code}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setLanguage(lang.code)}
                          className={cn(
                            "relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all overflow-hidden group",
                            language === lang.code
                              ? "border-success bg-gradient-to-br from-success/10 to-success/5 shadow-lg shadow-success/10"
                              : "border-border/50 bg-elevated/30 hover:border-border hover:bg-elevated/50"
                          )}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                          </div>

                          <span className="text-4xl">{lang.flag}</span>
                          <div className="text-left flex-1">
                            <p className="font-semibold text-foreground text-lg">{lang.label}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{lang.code}</p>
                          </div>
                          {language === lang.code && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="p-1.5 rounded-full bg-success"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Appearance Section */}
            {activeSection === "appearance" && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Card className="bg-surface/60 backdrop-blur-xl border-border/50 shadow-xl shadow-ai/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={cn("p-3 rounded-2xl", sectionIcons.appearance.bg, "border", sectionIcons.appearance.border)}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        <Palette className={cn("h-6 w-6", sectionIcons.appearance.color)} />
                      </motion.div>
                      <div>
                        <CardTitle className="text-foreground text-xl">{t("appearance")}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {t("customizeAppearance")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {themes.map((themeOption, index) => (
                        <motion.button
                          key={themeOption.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setTheme(themeOption.value as "light" | "dark" | "system")}
                          className={cn(
                            "relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all overflow-hidden group",
                            theme === themeOption.value
                              ? "border-ai bg-gradient-to-br from-ai/10 to-ai/5 shadow-lg shadow-ai/10"
                              : "border-border/50 bg-elevated/30 hover:border-border hover:bg-elevated/50"
                          )}
                        >
                          <motion.span
                            className="text-4xl"
                            animate={theme === themeOption.value ? { rotate: [0, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {themeOption.emoji}
                          </motion.span>
                          <span className="text-sm font-semibold text-foreground">
                            {themeOption.label}
                          </span>
                          {theme === themeOption.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="p-1 rounded-full bg-ai"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Card className="bg-surface/60 backdrop-blur-xl border-border/50 shadow-xl shadow-warning/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={cn("p-3 rounded-2xl", sectionIcons.notifications.bg, "border", sectionIcons.notifications.border)}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        <Bell className={cn("h-6 w-6", sectionIcons.notifications.color)} />
                      </motion.div>
                      <div>
                        <CardTitle className="text-foreground text-xl">{t("notifications")}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {t("chooseNotifications")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between p-5 rounded-2xl bg-elevated/30 border border-border/50 hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{t("emailNotifications")}</p>
                          <p className="text-sm text-muted-foreground">{t("receiveEmails")}</p>
                        </div>
                      </div>
                      <Switch />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center justify-between p-5 rounded-2xl bg-elevated/30 border border-border/50 hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-ai/10">
                          <Sparkles className="h-5 w-5 text-ai" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{t("marketingEmails")}</p>
                          <p className="text-sm text-muted-foreground">{t("receiveTips")}</p>
                        </div>
                      </div>
                      <Switch />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                className="space-y-6"
              >
                {/* Change Password */}
                <Card className="bg-surface/60 backdrop-blur-xl border-border/50 shadow-xl shadow-blue-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={cn("p-3 rounded-2xl", sectionIcons.security.bg, "border", sectionIcons.security.border)}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        <Shield className={cn("h-6 w-6", sectionIcons.security.color)} />
                      </motion.div>
                      <div>
                        <CardTitle className="text-foreground text-xl">{t("changePassword")}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {t("changePasswordDesc")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">{t("newPassword")}</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-elevated/50 border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">{t("confirmPassword")}</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        className="bg-elevated/50 border-border/50 focus:border-primary"
                      />
                      <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                    </div>
                    <Button
                      variant="glow"
                      onClick={handleChangePassword}
                      disabled={isSavingPassword || !newPassword}
                    >
                      {isSavingPassword ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("updatingPassword")}</>
                      ) : (
                        t("updatePassword")
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className="bg-surface/60 backdrop-blur-xl border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">{t("sessions")}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t("sessionsDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/20">
                          <Laptop className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">MacBook Pro</p>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-success/20 text-success font-semibold">
                              {t("currentSession")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Chrome · Bucharest, Romania
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-elevated/30 border border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-muted/50">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">iPhone 15 Pro</p>
                          <p className="text-sm text-muted-foreground">
                            Safari · {t("lastActive")}: 2h ago
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    <Button variant="outline" className="w-full mt-4 border-border/50 hover:bg-hover/50">
                      {t("signOutAll")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Danger Zone */}
            {activeSection === "danger" && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Card className="bg-surface/60 backdrop-blur-xl border-error/30 shadow-xl shadow-error/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={cn("p-3 rounded-2xl", sectionIcons.danger.bg, "border", sectionIcons.danger.border)}
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <AlertTriangle className={cn("h-6 w-6", sectionIcons.danger.color)} />
                      </motion.div>
                      <div>
                        <CardTitle className="text-error text-xl">{t("dangerZone")}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {t("irreversibleActions")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-5 rounded-2xl bg-error/5 border border-error/20">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-error/10 mt-0.5">
                          <AlertTriangle className="h-5 w-5 text-error" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground text-lg mb-1">
                            {t("deleteAccount")}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {t("deleteWarning")}
                          </p>
                          <Button
                            variant="destructive"
                            className="bg-error hover:bg-error/90"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            {t("deleteAccount")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-elevated border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-error">
              {t("deleteAccountConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAccountConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-sm text-muted-foreground">
              {t("typeDeleteToConfirm")}
            </Label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="bg-elevated/50 border-border/50"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-error hover:bg-error/90"
              disabled={deleteConfirmText !== "DELETE" || isDeletingAccount}
            >
              {isDeletingAccount ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("deletingAccount")}</>
              ) : (
                t("deleteAccount")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
