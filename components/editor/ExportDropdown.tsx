"use client";

import { useState } from "react";
import { Download, FileText, File, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

interface ExportDropdownProps {
  resumeId: string;
  disabled?: boolean;
  className?: string;
  onExportPdf?: () => Promise<void>;
}

export function ExportDropdown({
  resumeId,
  disabled,
  className,
  onExportPdf,
}: ExportDropdownProps) {
  const { t } = useLanguage();
  const [exporting, setExporting] = useState<"pdf" | "word" | null>(null);

  const handleExportPdf = async () => {
    setExporting("pdf");
    try {
      if (onExportPdf) {
        // Use client-side PDF export
        await onExportPdf();
        toast.success(t("exportSuccess"));
      } else {
        // Fallback to API
        const response = await fetch(`/api/resumes/${resumeId}/pdf`);

        if (response.status === 401) {
          toast.error(t("signIn"));
          return;
        }

        if (response.status === 402) {
          toast.error(t("upgradeToPro"));
          return;
        }

        if (!response.ok) {
          throw new Error("Export failed");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(t("exportSuccess"));
      }
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(t("exportError"));
    } finally {
      setExporting(null);
    }
  };

  const handleExportWord = async () => {
    setExporting("word");
    try {
      const response = await fetch(`/api/resumes/${resumeId}/word`);

      if (response.status === 401) {
        toast.error(t("signIn"));
        return;
      }

      if (response.status === 402) {
        toast.error(t("upgradeToPro"));
        return;
      }

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(t("exportSuccess"));
    } catch (error) {
      console.error("Word export error:", error);
      toast.error(t("exportError"));
    } finally {
      setExporting(null);
    }
  };

  const getExportingText = () => {
    if (exporting === "pdf") return t("exportingPdf");
    if (exporting === "word") return t("exportingWord");
    return t("download");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="glow"
          size="sm"
          disabled={disabled || !!exporting}
          className={className}
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {getExportingText()}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleExportPdf}
          disabled={!!exporting}
        >
          <FileText className="h-4 w-4 mr-2" />
          {t("downloadPdf")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportWord}
          disabled={!!exporting}
        >
          <File className="h-4 w-4 mr-2" />
          {t("downloadWord")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mobile version - icon only with dropdown
export function ExportDropdownMobile({
  resumeId,
  disabled,
  className,
  onExportPdf,
}: ExportDropdownProps) {
  const { t } = useLanguage();
  const [exporting, setExporting] = useState<"pdf" | "word" | null>(null);

  const handleExportPdf = async () => {
    setExporting("pdf");
    try {
      if (onExportPdf) {
        await onExportPdf();
        toast.success(t("exportSuccess"));
      } else {
        const response = await fetch(`/api/resumes/${resumeId}/pdf`);

        if (response.status === 401) {
          toast.error(t("signIn"));
          return;
        }

        if (response.status === 402) {
          toast.error(t("upgradeToPro"));
          return;
        }

        if (!response.ok) {
          throw new Error("Export failed");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(t("exportSuccess"));
      }
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(t("exportError"));
    } finally {
      setExporting(null);
    }
  };

  const handleExportWord = async () => {
    setExporting("word");
    try {
      const response = await fetch(`/api/resumes/${resumeId}/word`);

      if (response.status === 401) {
        toast.error(t("signIn"));
        return;
      }

      if (response.status === 402) {
        toast.error(t("upgradeToPro"));
        return;
      }

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(t("exportSuccess"));
    } catch (error) {
      console.error("Word export error:", error);
      toast.error(t("exportError"));
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="glow"
          size="icon"
          disabled={disabled || !!exporting}
          className={className}
        >
          {exporting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleExportPdf}
          disabled={!!exporting}
        >
          <FileText className="h-4 w-4 mr-2" />
          {t("downloadPdf")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportWord}
          disabled={!!exporting}
        >
          <File className="h-4 w-4 mr-2" />
          {t("downloadWord")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
