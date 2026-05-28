"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.63 0.19 250 / 0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.63 0.23 295 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative text-center space-y-6 p-8 max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/10 border border-primary/30 flex items-center justify-center">
              <FileQuestion className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gradient">404</h1>
          <h2 className="text-xl font-semibold text-foreground">
            {t("pageNotFound")}
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {t("notFoundDesc")}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="glow" asChild>
            <Link href="/">{t("goHome")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">{t("dashboard")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
