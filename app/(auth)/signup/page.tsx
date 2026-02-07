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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n";
import { Lock, Mail, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created! Please check your email to verify.");
      router.push("/login");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    } catch {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const features = [
    { emoji: "✨", text: t("aiPowered"), desc: t("aiPoweredDesc") },
    { emoji: "🎯", text: t("atsOptimized"), desc: t("atsOptimizedDesc") },
    { emoji: "🎨", text: t("premiumTemplates"), desc: t("premiumTemplatesDesc") },
  ];

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
            <span className="text-3xl">🚀</span>
          </div>
        </motion.div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("createYourAccount")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("startBuildingResume")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {/* Features Banner */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-ai/5 border border-border/50"
          >
            {features.map((feature) => (
              <div key={feature.text} className="text-center p-2">
                <span className="text-xl">{feature.emoji}</span>
                <p className="text-xs font-medium text-foreground mt-1 leading-tight">
                  {feature.text}
                </p>
              </div>
            ))}
          </motion.div>

          <form onSubmit={handleSignup} className="space-y-4">
            <motion.div variants={staggerItem} className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                {t("fullName")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  size="lg"
                  className="pl-10 bg-elevated border-border focus:border-primary transition-colors"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  size="lg"
                  className="pl-10 bg-elevated border-border focus:border-primary transition-colors"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                {t("password")}
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
                    {t("creatingAccount")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("createAccountBtn")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div variants={staggerItem} className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full bg-elevated border-border hover:bg-hover hover:border-border-hover transition-all"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("continueWithGoogle")}
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-center pt-4 pb-6">
        <p className="text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            {t("signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
