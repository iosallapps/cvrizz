"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  Lock,
  Check,
  Eye,
  Sparkles,
  X,
  Palette,
  LayoutGrid,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  templates,
  categoryInfo,
  getTemplatesByCategory,
  searchTemplates,
  type Template,
  type TemplateCategory,
} from "@/lib/templates";
import { ResumeRenderer } from "@/components/templates";
import { sampleResumeData, sampleResumeDataEn } from "@/lib/resume";

export default function TemplatesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories: (TemplateCategory | "all")[] = [
    "all",
    "professional",
    "modern",
    "creative",
    "minimalist",
    "executive",
    "academic",
  ];

  const filteredTemplates = useMemo(() => {
    let result = templates;

    // Filter by search
    if (searchQuery) {
      result = searchTemplates(searchQuery);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Filter by premium
    if (showPremiumOnly) {
      result = result.filter((t) => t.isPremium);
    }

    return result;
  }, [searchQuery, selectedCategory, showPremiumOnly]);

  const getCategoryLabel = (cat: TemplateCategory | "all") => {
    if (cat === "all") {
      return language === "ro" ? "Toate" : "All";
    }
    return language === "ro" ? categoryInfo[cat].nameRo : categoryInfo[cat].name;
  };

  const getCategoryIcon = (cat: TemplateCategory | "all") => {
    if (cat === "all") return "📋";
    return categoryInfo[cat].icon;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header - Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 p-6 md:p-8"
      >
        {/* Animated background */}
        <motion.div
          className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.63 0.23 295 / 0.1) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.63 0.19 250 / 0.1) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="relative flex items-start gap-4">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ai/20 to-primary/20 border border-ai/30 flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Palette className="h-7 w-7 text-ai" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {language === "ro" ? "Catalog Template-uri" : "Template Gallery"}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              {language === "ro"
                ? `${templates.length} template-uri profesionale pentru CV-ul tău perfect`
                : `${templates.length} professional templates for your perfect resume`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters - Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search Bar - Enhanced */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={language === "ro" ? "Caută template-uri..." : "Search templates..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-surface/60 backdrop-blur-sm border-border/50 focus:border-primary"
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-hover transition-all"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        {/* Category Tabs - Premium Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-gradient-to-r from-primary to-ai text-white shadow-lg shadow-primary/25"
                  : "bg-surface/60 backdrop-blur-sm border border-border/50 text-foreground hover:bg-hover/50 hover:border-border"
              )}
            >
              <span className="mr-2">{getCategoryIcon(cat)}</span>
              {getCategoryLabel(cat)}
              {cat !== "all" && (
                <span className="ml-2 text-xs opacity-70">
                  ({getTemplatesByCategory(cat).length})
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Premium Filter & Results Count */}
        <div className="flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowPremiumOnly(!showPremiumOnly)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              showPremiumOnly
                ? "bg-gradient-to-r from-ai/20 to-purple-500/20 text-ai border border-ai/40 shadow-lg shadow-ai/10"
                : "bg-surface/60 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Sparkles className="h-4 w-4" />
            {language === "ro" ? "Doar Premium" : "Premium Only"}
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            {language === "ro"
              ? `${filteredTemplates.length} template-uri găsite`
              : `${filteredTemplates.length} templates found`}
          </motion.p>
        </div>
      </motion.div>

      {/* Templates Grid - Premium */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
      >
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            variants={staggerItem}
            className="h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <TemplateCard
              template={template}
              language={language}
              onPreview={() => setPreviewTemplate(template)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State - Premium */}
      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔍
          </motion.div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {language === "ro" ? "Niciun template găsit" : "No templates found"}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {language === "ro"
              ? "Încearcă să modifici filtrele sau căutarea"
              : "Try adjusting your filters or search query"}
          </p>
          <Button
            variant="glow"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setShowPremiumOnly(false);
            }}
          >
            {language === "ro" ? "Resetează filtrele" : "Reset filters"}
          </Button>
        </motion.div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreviewModal
            template={previewTemplate}
            language={language}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Template Card Component - Premium
function TemplateCard({
  template,
  language,
  onPreview,
}: {
  template: Template;
  language: string;
  onPreview: () => void;
}) {
  return (
    <Card className="group relative overflow-hidden bg-surface/60 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Premium Badge */}
      {template.isPremium && (
        <motion.div
          className="absolute top-3 right-3 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Badge className="bg-gradient-to-r from-ai to-purple-500 text-white border-0 shadow-lg shadow-ai/25">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </motion.div>
      )}

      {/* Template Preview - Fixed aspect ratio */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden flex-shrink-0">
        {/* Real template preview */}
        <div className="absolute inset-3 rounded-xl shadow-lg overflow-hidden ring-1 ring-black/5">
          <ResumeRenderer
            template={template}
            data={language === "ro" ? sampleResumeData : sampleResumeDataEn}
          />
        </div>

        {/* Hover Overlay - Enhanced */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              size="sm"
              variant="secondary"
              onClick={onPreview}
              className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              {language === "ro" ? "Preview" : "Preview"}
            </Button>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Button
              size="sm"
              variant="glow"
              asChild
            >
              <Link href={`/editor/new?template=${template.id}`}>
                {language === "ro" ? "Folosește" : "Use"}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Card Content - Fixed height structure */}
      <CardContent className="p-4 flex flex-col flex-grow bg-gradient-to-b from-transparent to-surface/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {language === "ro" ? template.nameRo : template.name}
          </h3>
          {/* ATS Score */}
          <div className="flex items-center gap-1 text-xs flex-shrink-0 bg-yellow-500/10 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">{template.atsScore}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow min-h-[40px]">
          {language === "ro" ? template.descriptionRo : template.description}
        </p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <Badge variant="outline" className="text-xs flex-shrink-0 bg-surface/50">
            {getCategoryIcon(template.category)}{" "}
            {language === "ro"
              ? categoryInfo[template.category].nameRo
              : categoryInfo[template.category].name}
          </Badge>
          {template.atsScore >= 95 ? (
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30 flex-shrink-0">
              <Check className="h-3 w-3 mr-1" />
              ATS
            </Badge>
          ) : (
            <div className="w-[52px]" /> // Placeholder for consistent width
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getCategoryIcon(category: TemplateCategory): string {
  return categoryInfo[category].icon;
}

// Template Preview Modal - Premium
function TemplatePreviewModal({
  template,
  language,
  onClose,
}: {
  template: Template;
  language: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-surface/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-surface to-surface/80">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {language === "ro" ? template.nameRo : template.name}
            </h2>
            <p className="text-muted-foreground mt-1">
              {language === "ro" ? template.descriptionRo : template.description}
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-hover transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex gap-6">
            {/* Template Preview */}
            <div className="flex-1">
              <motion.div
                className="aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden border border-border/50 ring-1 ring-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ResumeRenderer
                  template={template}
                  data={language === "ro" ? sampleResumeData : sampleResumeDataEn}
                />
              </motion.div>
            </div>

            {/* Template Details */}
            <motion.div
              className="w-64 space-y-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-4 rounded-2xl bg-elevated/50 border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  {language === "ro" ? "Detalii" : "Details"}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {language === "ro" ? "Categorie" : "Category"}
                    </span>
                    <Badge variant="outline" className="bg-surface/50">
                      {language === "ro"
                        ? categoryInfo[template.category].nameRo
                        : categoryInfo[template.category].name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {language === "ro" ? "Scor ATS" : "ATS Score"}
                    </span>
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">{template.atsScore}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {language === "ro" ? "Layout" : "Layout"}
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {template.layout.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {language === "ro" ? "Tip" : "Type"}
                    </span>
                    {template.isPremium ? (
                      <Badge className="bg-gradient-to-r from-ai/20 to-purple-500/20 text-ai border-ai/30">
                        <Lock className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        <Check className="h-3 w-3 mr-1" />
                        {language === "ro" ? "Gratuit" : "Free"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-elevated/50 border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  {language === "ro" ? "Culori" : "Colors"}
                </h4>
                <div className="flex gap-2">
                  {Object.entries(template.colorScheme).slice(0, 4).map(([name, color]) => (
                    <motion.div
                      key={name}
                      className="w-10 h-10 rounded-xl shadow-sm border border-border/50"
                      style={{ backgroundColor: color }}
                      title={name}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-elevated/50 border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  {language === "ro" ? "Tags" : "Tags"}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-surface/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50 bg-gradient-to-r from-elevated/80 to-elevated/60">
          <Button variant="outline" onClick={onClose} className="border-border/50">
            {language === "ro" ? "Închide" : "Close"}
          </Button>
          <Button variant="glow" asChild className="group">
            <Link href={`/editor/new?template=${template.id}`}>
              {template.isPremium && <Lock className="h-4 w-4 mr-2 group-hover:animate-pulse" />}
              {language === "ro" ? "Folosește acest template" : "Use this template"}
            </Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
