"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Editor error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col -m-6 lg:-m-8">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="flex h-14 items-center px-4 gap-4">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">Back to Dashboard</span>
        </div>
      </header>

      {/* Error Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-surface/60 backdrop-blur-xl border-error/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full scale-150" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-error/20 to-error/10 border border-error/30 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-error" />
                </div>
              </div>
            </motion.div>
            <CardTitle className="text-xl">Unable to load resume</CardTitle>
            <CardDescription>
              We encountered an error while loading your resume. Your data is safe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 justify-center">
              <Button onClick={reset} variant="glow" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="p-3 bg-elevated/50 border border-border rounded-lg text-left">
                <p className="text-xs font-mono text-error break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
