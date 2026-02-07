"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="space-y-8 pb-8">
      <Card className="bg-surface/60 backdrop-blur-xl border-error/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-error/20 to-error/10 border border-error/30 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-error" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            Failed to load dashboard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md mb-6"
          >
            We couldn&apos;t load your dashboard. This might be a temporary issue.
            Please try again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <Button onClick={reset} variant="glow" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go home
              </Link>
            </Button>
          </motion.div>

          {process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-4 bg-elevated/50 border border-border rounded-xl text-left max-w-lg w-full"
            >
              <p className="text-sm font-mono text-error break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
