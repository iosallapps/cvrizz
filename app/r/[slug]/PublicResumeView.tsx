"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ResumeRenderer } from "@/components/templates";
import type { Template } from "@/lib/templates";
import type { ResumeData } from "@/lib/resume";
import { ZoomIn, ZoomOut, Download, Printer } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { exportToPDF, printResume } from "@/lib/export";
import { toast } from "sonner";

interface PublicResumeViewProps {
  template: Template;
  templateData: ResumeData;
  title: string;
}

export function PublicResumeView({ template, templateData, title }: PublicResumeViewProps) {
  const { t, language } = useLanguage();
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await exportToPDF("public-resume-view", `${title}.pdf`);
      toast.success(t("exportSuccess"));
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(t("exportError"));
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    try {
      printResume("public-resume-view");
    } catch (error) {
      console.error("Print error:", error);
      toast.error(t("error"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-muted/50">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-semibold text-foreground truncate">{title}</h1>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setZoom(Math.min(150, zoom + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:flex"
            >
              <Printer className="h-4 w-4 mr-2" />
              {t("print")}
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? t("exportingPdf") : t("downloadPdf")}
            </Button>
          </div>
        </div>
      </header>

      {/* Resume View */}
      <main className="p-4 md:p-8">
        <motion.div
          className="mx-auto transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            id="public-resume-view"
            className="mx-auto shadow-2xl shadow-primary/10 rounded-xl overflow-hidden bg-white"
            style={{
              width: "210mm",
              minHeight: "297mm",
            }}
          >
            <ResumeRenderer
              template={template}
              data={templateData}
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>
          {language === "ro"
            ? "CV creat cu ResumeAI"
            : "Resume created with ResumeAI"
          }
        </p>
      </footer>
    </div>
  );
}
