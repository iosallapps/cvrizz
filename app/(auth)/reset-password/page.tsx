"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }

    if (password.length < 6) {
      toast.error(t("passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="bg-surface/80 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center"
          >
            <CheckCircle className="h-8 w-8 text-success" />
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">
            {t("passwordResetSuccess")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("redirectingToDashboard")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface/80 backdrop-blur-xl border-border/50 shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mb-2"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20">
            <span className="text-3xl">🔑</span>
          </div>
        </motion.div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("resetPasswordTitle")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("resetPasswordDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={staggerItem} className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                {t("newPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  size="lg"
                  className="pl-10 bg-elevated border-border focus:border-primary transition-colors"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                {t("confirmPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  size="lg"
                  className="pl-10 bg-elevated border-border focus:border-primary transition-colors"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="pt-2">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("resettingPassword")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("resetPassword")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </CardContent>
    </Card>
  );
}
