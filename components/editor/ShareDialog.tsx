"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Share2, Copy, Check, ExternalLink, Globe, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { togglePublicLink, getPublicLinkInfo } from "@/app/actions/resume";

interface ShareDialogProps {
  resumeId: string;
  disabled?: boolean;
}

export function ShareDialog({ resumeId, disabled }: ShareDialogProps) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fetch current public link status when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      getPublicLinkInfo(resumeId)
        .then((info) => {
          setIsPublic(info.isPublic);
          setPublicUrl(info.publicUrl);
        })
        .catch((error) => {
          console.error("Failed to get public link info:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, resumeId]);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      const result = await togglePublicLink(resumeId, checked);
      setIsPublic(result.isPublic);
      setPublicUrl(result.publicUrl);
      toast.success(
        checked
          ? language === "ro"
            ? "Link public activat"
            : "Public link enabled"
          : language === "ro"
          ? "Link public dezactivat"
          : "Public link disabled"
      );
    } catch (error) {
      console.error("Failed to toggle public link:", error);
      toast.error(
        language === "ro"
          ? "Eroare la actualizarea link-ului"
          : "Failed to update link"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    const fullUrl = `${window.location.origin}${publicUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast.success(
      language === "ro" ? "Link copiat!" : "Link copied!"
    );
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenLink = () => {
    if (!publicUrl) return;
    window.open(publicUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Share2 className="h-4 w-4 mr-2" />
          {language === "ro" ? "Distribuie" : "Share"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {language === "ro" ? "Distribuie CV-ul" : "Share Resume"}
          </DialogTitle>
          <DialogDescription>
            {language === "ro"
              ? "Creează un link public pentru a distribui CV-ul tău."
              : "Create a public link to share your resume."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Public Link Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <div className="p-2 rounded-full bg-success/10">
                  <Globe className="h-5 w-5 text-success" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-muted">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <Label htmlFor="public-toggle" className="text-base font-medium">
                  {language === "ro" ? "Link Public" : "Public Link"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isPublic
                    ? language === "ro"
                      ? "Oricine cu link-ul poate vedea CV-ul"
                      : "Anyone with the link can view"
                    : language === "ro"
                    ? "Doar tu poți vedea CV-ul"
                    : "Only you can view"}
                </p>
              </div>
            </div>
            <Switch
              id="public-toggle"
              checked={isPublic}
              onCheckedChange={handleToggle}
              disabled={isLoading}
            />
          </div>

          {/* Public URL */}
          {isPublic && publicUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <Label>{language === "ro" ? "Link de distribuire" : "Share Link"}</Label>
              <div className="flex gap-2">
                <Input
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}${publicUrl}`}
                  readOnly
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleOpenLink}
                  className="shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
