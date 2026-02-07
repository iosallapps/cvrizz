"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exportToPDF } from "@/lib/export";
import {
  ArrowLeft,
  Download,
  User,
  Briefcase,
  GraduationCap,
  Zap,
  Check,
  Loader2,
  AlertCircle,
  Eye,
  ZoomIn,
  ZoomOut,
  Plus,
  ChevronRight,
  Palette,
  Layout,
  Sparkles,
  WifiOff,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { ResumeRenderer } from "@/components/templates";
import { templates } from "@/lib/templates";
import { useResume } from "@/hooks/useResume";
import { toTemplateFormat, DEFAULT_RESUME_DATA } from "@/types/resume";
import type { ResumeData, WorkExperience, Education, Skill } from "@/types/resume";
import { WorkExperienceForm } from "@/components/editor/WorkExperienceForm";
import { EducationForm } from "@/components/editor/EducationForm";
import { SkillsForm } from "@/components/editor/SkillsForm";
import { ExportDropdown, ExportDropdownMobile } from "@/components/editor/ExportDropdown";
import { ShareDialog } from "@/components/editor/ShareDialog";

export default function EditorPage({ params }: { params: { id: string } }) {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState("basics");
  const [zoom, setZoom] = useState(70);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Use the resume hook for real data
  const {
    resume,
    metadata,
    isLoading,
    isError,
    error,
    saveStatus,
    setResumeData,
    setResumeMetadata,
    hasPendingChanges,
  } = useResume(params.id);

  // Use resume data or defaults
  const resumeData = resume || DEFAULT_RESUME_DATA;
  const selectedTemplateId = metadata?.templateId || "classic-professional";

  // Get the selected template
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Convert DB format to template format for preview
  const templateData = useMemo(() => toTemplateFormat(resumeData), [resumeData]);

  // Helper to update specific fields
  const updateBasics = (field: string, value: string) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        [field]: value,
      },
    }));
  };

  const updateLocation = (field: string, value: string) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        location: {
          ...prev.basics.location,
          [field]: value,
        },
      },
    }));
  };

  // Work Experience CRUD
  const addWorkEntry = (entry: WorkExperience) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      work: [...prev.work, entry],
    }));
  };

  const updateWorkEntry = (id: string, entry: WorkExperience) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      work: prev.work.map((w) => (w.id === id ? entry : w)),
    }));
  };

  const removeWorkEntry = (id: string) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      work: prev.work.filter((w) => w.id !== id),
    }));
  };

  // Education CRUD
  const addEducationEntry = (entry: Education) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, entry],
    }));
  };

  const updateEducationEntry = (id: string, entry: Education) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? entry : e)),
    }));
  };

  const removeEducationEntry = (id: string) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  // Skills CRUD
  const addSkillEntry = (entry: Skill) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, entry],
    }));
  };

  const updateSkillEntry = (id: string, entry: Skill) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? entry : s)),
    }));
  };

  const removeSkillEntry = (id: string) => {
    if (!resume) return;
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // PDF Export handler - uses client-side html2canvas + jsPDF
  const handleExportPdf = useCallback(async () => {
    const filename = `${metadata?.title || "resume"}.pdf`;
    await exportToPDF("resume-pdf-export", filename);
  }, [metadata?.title]);

  const sections = [
    { id: "basics", label: t("personalInfo"), icon: User, gradient: "from-primary/20 to-primary/5", iconBg: "bg-primary/10", iconColor: "text-primary", borderColor: "border-primary/30" },
    { id: "work", label: t("experience"), icon: Briefcase, gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/10", iconColor: "text-blue-500", borderColor: "border-blue-500/30" },
    { id: "education", label: t("education"), icon: GraduationCap, gradient: "from-success/20 to-success/5", iconBg: "bg-success/10", iconColor: "text-success", borderColor: "border-success/30" },
    { id: "skills", label: t("skills"), icon: Zap, gradient: "from-warning/20 to-warning/5", iconBg: "bg-warning/10", iconColor: "text-warning", borderColor: "border-warning/30" },
  ];

  const SaveStatusIndicator = () => {
    switch (saveStatus) {
      case "saved":
        return (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-xs text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20"
          >
            <Check className="h-3 w-3" />
            <span className="hidden sm:inline">{t("allChangesSaved")}</span>
          </motion.span>
        );
      case "saving":
        return (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="hidden sm:inline">{t("saving")}</span>
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1.5 text-xs text-error bg-error/10 px-3 py-1.5 rounded-full border border-error/20">
            <AlertCircle className="h-3 w-3" />
            <span className="hidden sm:inline">{t("errorSaving")}</span>
          </span>
        );
      case "offline":
        return (
          <span className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20">
            <WifiOff className="h-3 w-3" />
            <span className="hidden sm:inline">Offline</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col -m-6 lg:-m-8">
        <header className="bg-surface/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
          <div className="flex h-14 items-center justify-between px-3 md:px-4 gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 flex-1 max-w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden md:flex w-56 lg:w-64 flex-col border-r border-border/50 bg-surface/60 p-3">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </aside>
          <div className="flex-1 p-4 md:p-6">
            <Skeleton className="h-[400px] max-w-2xl mx-auto rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center -m-6 lg:-m-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-error">
              <AlertCircle className="h-5 w-5" />
              Error Loading Resume
            </CardTitle>
            <CardDescription>
              {error || "Unable to load your resume. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen flex flex-col -m-6 lg:-m-8">
      {/* Header - Glass Effect */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="flex h-14 items-center justify-between px-3 md:px-4 gap-2 md:gap-4">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" asChild className="shrink-0 h-10 w-10 min-h-[44px] min-w-[44px] hover:bg-primary/10">
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <div className="min-w-0 flex-1">
              <Input
                className="h-10 text-sm font-medium bg-transparent border-transparent hover:border-border focus:border-primary truncate"
                value={metadata?.title || t("untitledResume")}
                placeholder={t("untitledResume")}
                onChange={(e) => setResumeMetadata({ title: e.target.value })}
              />
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <SaveStatusIndicator />
            <ShareDialog resumeId={params.id} disabled={isLoading} />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <ExportDropdown
                resumeId={params.id}
                className="hidden sm:flex h-10"
                disabled={isLoading}
                onExportPdf={handleExportPdf}
              />
            </motion.div>
            <ExportDropdownMobile
              resumeId={params.id}
              className="sm:hidden h-11 w-11 min-h-[44px] min-w-[44px]"
              disabled={isLoading}
              onExportPdf={handleExportPdf}
            />
          </div>
        </div>

        {/* Mobile Section Navigation */}
        <div className="md:hidden border-t border-border/50 bg-surface/50">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex-1 min-w-[80px] min-h-[56px] flex flex-col items-center justify-center gap-1 px-3 py-3 text-xs font-medium transition-all border-b-2",
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground active:bg-hover"
                  )}
                >
                  <section.icon className="h-5 w-5" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Glass Effect */}
        <aside className="hidden md:flex w-56 lg:w-64 flex-col border-r border-border/50 bg-surface/60 backdrop-blur-xl">
          <nav className="flex-1 p-3 space-y-1.5">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id;
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? cn("bg-gradient-to-r shadow-lg", section.gradient, section.borderColor, "border")
                      : "text-muted-foreground hover:bg-hover/50 hover:text-foreground"
                  )}
                >
                  <motion.div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                      isActive ? section.iconBg : "bg-muted/50"
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <section.icon className={cn("h-4 w-4", isActive ? section.iconColor : "text-muted-foreground")} />
                  </motion.div>
                  <span className={cn("flex-1 text-left", isActive && "text-foreground")}>{section.label}</span>
                  <motion.div
                    animate={{ x: isActive ? 0 : -5, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </motion.button>
              );
            })}

            {/* Template & Color section */}
            <div className="pt-4 mt-4 border-t border-border/50 space-y-1.5">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setShowTemplateSelector(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-hover/50 hover:text-foreground transition-all group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: selectedTemplate.colorScheme.primary + "20" }}
                >
                  <Layout className="h-4 w-4" style={{ color: selectedTemplate.colorScheme.primary }} />
                </div>
                <div className="flex-1 text-left">
                  <span className="block">{language === "ro" ? "Template" : "Template"}</span>
                  <span className="text-xs text-muted-foreground truncate block">
                    {language === "ro" ? selectedTemplate.nameRo : selectedTemplate.name}
                  </span>
                </div>
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-hover/50 hover:text-foreground transition-all group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: selectedTemplate.colorScheme.accent + "20" }}
                >
                  <Palette className="h-4 w-4" style={{ color: selectedTemplate.colorScheme.accent }} />
                </div>
                <div className="flex-1 text-left">
                  <span className="block">{language === "ro" ? "Culori" : "Colors"}</span>
                  <span className="text-xs text-muted-foreground">
                    {language === "ro" ? "Personalizează" : "Customize"}
                  </span>
                </div>
              </motion.button>
            </div>
          </nav>

          {/* AI Assistant Card - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-3 border-t border-border/50"
          >
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-ai/15 via-primary/10 to-ai/5 border border-ai/30">
              {/* Animated glow */}
              <motion.div
                className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, oklch(0.63 0.23 295 / 0.3) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    className="w-8 h-8 rounded-lg bg-ai/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Sparkles className="h-4 w-4 text-ai" />
                  </motion.div>
                  <h4 className="font-semibold text-foreground text-sm">{t("aiAssistant")}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("aiTipDescription")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-ai border-ai/40 hover:bg-ai/10 hover:border-ai/60 transition-all"
                >
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  {t("generateWithAi")}
                </Button>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-transparent to-surface/20">
          <div className="p-4 md:p-6 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Personal Info Section */}
              {activeSection === "basics" && (
                <motion.div
                  key="basics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <Card className="bg-surface/80 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <User className="h-6 w-6 text-primary" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-xl">{t("personalInformation")}</CardTitle>
                          <CardDescription>{t("basicDetails")}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">{t("fullName")}</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="bg-elevated/50"
                            value={resumeData.basics.name}
                            onChange={(e) => updateBasics("name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-medium">{t("jobTitle")}</Label>
                          <Input
                            id="title"
                            placeholder="Software Engineer"
                            className="bg-elevated/50"
                            value={resumeData.basics.label || ""}
                            onChange={(e) => updateBasics("label", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">{t("email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="bg-elevated/50"
                            value={resumeData.basics.email}
                            onChange={(e) => updateBasics("email", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">{t("phone")}</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 000-0000"
                            className="bg-elevated/50"
                            value={resumeData.basics.phone || ""}
                            onChange={(e) => updateBasics("phone", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium">{t("city")}</Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            className="bg-elevated/50"
                            value={resumeData.basics.location?.city || ""}
                            onChange={(e) => updateLocation("city", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-sm font-medium">{t("country")}</Label>
                          <Input
                            id="country"
                            placeholder="United States"
                            className="bg-elevated/50"
                            value={resumeData.basics.location?.countryCode || ""}
                            onChange={(e) => updateLocation("countryCode", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="summary" className="text-sm font-medium">{t("professionalSummary")}</Label>
                          <Button variant="ghost" size="sm" className="text-ai hover:text-ai hover:bg-ai/10 h-8 gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            {t("generateWithAi")}
                          </Button>
                        </div>
                        <Textarea
                          id="summary"
                          placeholder={t("summaryPlaceholder")}
                          rows={4}
                          className="resize-none bg-elevated/50"
                          value={resumeData.basics.summary || ""}
                          onChange={(e) => updateBasics("summary", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Work Experience Section */}
              {activeSection === "work" && (
                <motion.div
                  key="work"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <Card className="bg-surface/80 backdrop-blur-xl border-border/50 shadow-xl shadow-blue-500/5">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/30"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <Briefcase className="h-6 w-6 text-blue-500" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-xl">{t("workExperience")}</CardTitle>
                          <CardDescription>{t("addWorkHistory")}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <WorkExperienceForm
                        entries={resumeData.work}
                        onAdd={addWorkEntry}
                        onUpdate={updateWorkEntry}
                        onRemove={removeWorkEntry}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <Card className="bg-surface/80 backdrop-blur-xl border-border/50 shadow-xl shadow-success/5">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center border border-success/30"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <GraduationCap className="h-6 w-6 text-success" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-xl">{t("education")}</CardTitle>
                          <CardDescription>{t("addEducation")}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <EducationForm
                        entries={resumeData.education}
                        onAdd={addEducationEntry}
                        onUpdate={updateEducationEntry}
                        onRemove={removeEducationEntry}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <Card className="bg-surface/80 backdrop-blur-xl border-border/50 shadow-xl shadow-warning/5">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center border border-warning/30"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <Zap className="h-6 w-6 text-warning" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-xl">{t("skills")}</CardTitle>
                          <CardDescription>{t("skillsDescription")}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <SkillsForm
                        entries={resumeData.skills}
                        onAdd={addSkillEntry}
                        onUpdate={updateSkillEntry}
                        onRemove={removeSkillEntry}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview Panel - Desktop only - Glass Effect */}
        <aside className="hidden lg:flex w-80 xl:w-96 flex-col border-l border-border/50 bg-surface/40 backdrop-blur-xl">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-surface/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{t("livePreview")}</h3>
            </div>
            <div className="flex items-center gap-1 bg-elevated/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-hover"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground w-10 text-center font-medium">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-hover"
                onClick={() => setZoom(Math.min(100, zoom + 10))}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-auto bg-gradient-to-b from-muted/20 to-muted/40">
            <motion.div
              className="mx-auto transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoom / 100})` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Resume Preview - using ResumeRenderer */}
              <div className="shadow-2xl shadow-primary/10 rounded-xl aspect-[8.5/11] w-full max-w-[280px] mx-auto border border-border/50 overflow-hidden ring-1 ring-white/10">
                <ResumeRenderer
                  template={selectedTemplate}
                  data={templateData}
                />
              </div>
            </motion.div>
          </div>

          <div className="p-4 border-t border-border/50 bg-surface/60">
            <p className="text-xs text-muted-foreground text-center">
              {t("startFilling")}
            </p>
          </div>
        </aside>
      </div>

      {/* Template Selector Dialog */}
      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={(id) => setResumeMetadata({ templateId: id as "classic" | "modern" | "minimal" })}
      />

      {/* Mobile Preview Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        onClick={() => setShowMobilePreview(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Eye className="h-6 w-6" />
      </motion.button>

      {/* Mobile Preview Modal */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-base/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold">{t("livePreview")}</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Zoom controls */}
                <div className="flex items-center gap-1 bg-elevated/50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 min-h-[44px] min-w-[44px]"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground w-10 text-center font-medium">{zoom}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 min-h-[44px] min-w-[44px]"
                    onClick={() => setZoom(Math.min(100, zoom + 10))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 min-h-[44px] min-w-[44px]"
                  onClick={() => setShowMobilePreview(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="overflow-auto h-[calc(100vh-64px)] p-4 bg-gradient-to-b from-muted/20 to-muted/40">
              <motion.div
                className="mx-auto transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoom / 100})` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="shadow-2xl shadow-primary/10 rounded-xl aspect-[8.5/11] w-full max-w-[320px] mx-auto border border-border/50 overflow-hidden ring-1 ring-white/10">
                  <ResumeRenderer
                    template={selectedTemplate}
                    data={templateData}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden container for PDF export - renders at A4 size for high quality */}
      <div
        id="resume-pdf-export"
        className="fixed -left-[9999px] top-0 bg-white"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: 0,
        }}
      >
        <ResumeRenderer
          template={selectedTemplate}
          data={templateData}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
