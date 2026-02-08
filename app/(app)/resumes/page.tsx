"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  FileText,
  Clock,
  MoreVertical,
  Trash2,
  Copy,
  Search,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useLanguage } from "@/lib/i18n";
import { useResumes } from "@/hooks/useResumes";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumesPage() {
  const { t } = useLanguage();
  const { resumes, isLoading, create, isCreating, remove, isDeleting } =
    useResumes();
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (deleteResumeId) {
      await remove(deleteResumeId);
      setDeleteResumeId(null);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {t("allResumes")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("allResumesDesc")}
          </p>
        </div>
        <Button
          variant="glow"
          className="group"
          onClick={() => create()}
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          )}
          {t("createNewResume")}
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchResumes")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface/80 border-border/50"
          />
        </div>
      </motion.div>

      {/* Resumes Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-surface/80 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <Skeleton className="h-14 w-14 rounded-xl" />
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredResumes.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50 bg-surface/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? t("noResumesFound") : t("noResumesYet")}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {t("createFirstResume")}
            </p>
            {!searchQuery && (
              <Button variant="glow" onClick={() => create()}>
                <Plus className="h-4 w-4 mr-2" />
                {t("createNewResume")}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredResumes.map((resume) => (
            <motion.div key={resume.id} variants={staggerItem}>
              <Card className="group hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-surface/80 backdrop-blur-xl">
                <Link href={`/editor/${resume.id}`} className="block">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-18 rounded-xl bg-gradient-to-br from-primary/10 to-ai/10 border border-primary/20 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-elevated/95 backdrop-blur-xl border-border"
                        >
                          <DropdownMenuItem className="text-foreground">
                            <Copy className="h-4 w-4 mr-2" />
                            {t("duplicate")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem
                            className="text-error focus:text-error"
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteResumeId(resume.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {resume.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs mt-2">
                      <Clock className="h-3 w-3" />
                      {t("lastEdited")}{" "}
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteResumeId}
        onOpenChange={(open) => !open && setDeleteResumeId(null)}
      >
        <AlertDialogContent className="bg-elevated border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete")} CV</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-error hover:bg-error/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
