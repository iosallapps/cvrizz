"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { templates, templateCategories, categoryInfo, type Template, type TemplateCategory } from "@/lib/templates";
import {
  Search,
  Check,
  Crown,
  Briefcase,
  Sparkles,
  Palette,
  Layout,
  Award,
  BookOpen,
} from "lucide-react";

const categoryIcons: Record<TemplateCategory, typeof Briefcase> = {
  professional: Briefcase,
  modern: Sparkles,
  creative: Palette,
  minimalist: Layout,
  executive: Award,
  academic: BookOpen,
};

const categories = templateCategories.map(id => ({
  id,
  name: categoryInfo[id].name,
  nameRo: categoryInfo[id].nameRo,
}));

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({
  open,
  onOpenChange,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory = activeCategory === "all" || template.category === activeCategory;
      const name = language === "ro" ? template.nameRo : template.name;
      const description = language === "ro" ? template.descriptionRo : template.description;
      const matchesSearch =
        searchQuery === "" ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, language]);

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col bg-surface">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {language === "ro" ? "Alege un Template" : "Choose a Template"}
          </DialogTitle>
          <DialogDescription>
            {language === "ro"
              ? "Selectează un template pentru CV-ul tău. Poți schimba oricând."
              : "Select a template for your resume. You can change it anytime."}
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === "ro" ? "Caută template-uri..." : "Search templates..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className="shrink-0"
          >
            {language === "ro" ? "Toate" : "All"}
          </Button>
          {categories.map((category) => {
            const Icon = categoryIcons[category.id];
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="shrink-0"
              >
                <Icon className="h-3.5 w-3.5 mr-1.5" />
                {language === "ro" ? category.nameRo : category.name}
              </Button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => {
                const isSelected = template.id === selectedTemplateId;
                const name = language === "ro" ? template.nameRo : template.name;

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <button
                      onClick={() => handleSelectTemplate(template)}
                      className={cn(
                        "group relative w-full rounded-xl border-2 overflow-hidden transition-all duration-200",
                        "hover:shadow-lg hover:-translate-y-0.5",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isSelected
                          ? "border-primary shadow-md ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {/* Template Preview */}
                      <div className="aspect-[8.5/11] bg-white p-3 relative">
                        {/* Mini CV Preview */}
                        <div
                          className="h-full w-full rounded overflow-hidden"
                          style={{
                            background: template.colorScheme.background,
                          }}
                        >
                          {/* Header */}
                          <div
                            className="h-8 w-full flex items-center px-2"
                            style={{ background: template.colorScheme.primary }}
                          >
                            <div className="space-y-0.5">
                              <div
                                className="h-1.5 w-12 rounded-sm"
                                style={{
                                  background: template.colorScheme.background,
                                  opacity: 0.9,
                                }}
                              />
                              <div
                                className="h-1 w-8 rounded-sm"
                                style={{
                                  background: template.colorScheme.background,
                                  opacity: 0.6,
                                }}
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-2 space-y-2">
                            {/* Section */}
                            <div>
                              <div
                                className="h-1 w-10 rounded-sm mb-1"
                                style={{
                                  background: template.colorScheme.primary,
                                  opacity: 0.8,
                                }}
                              />
                              <div className="space-y-0.5">
                                <div
                                  className="h-0.5 w-full rounded-sm"
                                  style={{
                                    background: template.colorScheme.text,
                                    opacity: 0.2,
                                  }}
                                />
                                <div
                                  className="h-0.5 w-4/5 rounded-sm"
                                  style={{
                                    background: template.colorScheme.text,
                                    opacity: 0.2,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Section */}
                            <div>
                              <div
                                className="h-1 w-8 rounded-sm mb-1"
                                style={{
                                  background: template.colorScheme.primary,
                                  opacity: 0.8,
                                }}
                              />
                              <div className="space-y-0.5">
                                <div
                                  className="h-0.5 w-full rounded-sm"
                                  style={{
                                    background: template.colorScheme.text,
                                    opacity: 0.2,
                                  }}
                                />
                                <div
                                  className="h-0.5 w-3/4 rounded-sm"
                                  style={{
                                    background: template.colorScheme.text,
                                    opacity: 0.2,
                                  }}
                                />
                                <div
                                  className="h-0.5 w-5/6 rounded-sm"
                                  style={{
                                    background: template.colorScheme.text,
                                    opacity: 0.2,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Section */}
                            <div>
                              <div
                                className="h-1 w-6 rounded-sm mb-1"
                                style={{
                                  background: template.colorScheme.primary,
                                  opacity: 0.8,
                                }}
                              />
                              <div className="flex gap-1 flex-wrap">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="h-1.5 w-4 rounded-sm"
                                    style={{
                                      background: template.colorScheme.accent,
                                      opacity: 0.5,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Selected Check */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        )}

                        {/* Premium Badge */}
                        {template.isPremium && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] px-1.5 py-0.5">
                              <Crown className="h-2.5 w-2.5 mr-0.5" />
                              PRO
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-3 bg-surface border-t border-border">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm text-foreground truncate">
                            {name}
                          </span>
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            ATS {template.atsScore}%
                          </Badge>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {language === "ro"
                  ? "Niciun template găsit"
                  : "No templates found"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
