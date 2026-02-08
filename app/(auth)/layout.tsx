"use client";

import { motion } from "framer-motion";
import { slideUp } from "@/lib/animations";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { PremiumBackground } from "@/components/shared/PremiumBackground";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
      {/* Theme & Language Switchers - Top Right */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      {/* Premium animated background */}
      <PremiumBackground variant="auth" />

      {/* Content */}
      <div className="relative w-full max-w-md px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-8"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-ai/20 group-hover:from-primary/30 group-hover:to-ai/30 transition-all">
              <span className="text-2xl">📝</span>
            </div>
            <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              CV Rizz
            </span>
          </Link>
        </motion.div>

        {/* Card container with animation */}
        <motion.div
          {...slideUp}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          {t("termsAgreement")}{" "}
          <Link href="/terms" className="text-primary hover:underline">
            {t("termsOfService")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            {t("privacyPolicy")}
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
