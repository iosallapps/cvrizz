"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Zap,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import type { Skill } from "@/types/resume";

interface SkillsFormProps {
  entries: Skill[];
  onAdd: (entry: Skill) => void;
  onUpdate: (id: string, entry: Skill) => void;
  onRemove: (id: string) => void;
  onReorder?: (entries: Skill[]) => void;
}

const emptySkillEntry: Omit<Skill, "id"> = {
  name: "",
  level: undefined,
  keywords: [],
};

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export function SkillsForm({
  entries,
  onAdd,
  onUpdate,
  onRemove,
}: SkillsFormProps) {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, "id">>(emptySkillEntry);
  const [quickAddInput, setQuickAddInput] = useState("");

  const resetForm = () => {
    setFormData(emptySkillEntry);
    setEditingEntry(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: Skill) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name,
      level: entry.level,
      keywords: entry.keywords || [],
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const entry: Skill = {
      id: editingEntry?.id || crypto.randomUUID(),
      name: formData.name,
      level: formData.level,
      keywords: formData.keywords,
    };

    if (editingEntry) {
      onUpdate(entry.id, entry);
    } else {
      onAdd(entry);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onRemove(id);
  };

  // Quick add skill
  const handleQuickAdd = () => {
    if (!quickAddInput.trim()) return;

    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: quickAddInput.trim(),
      level: undefined,
      keywords: [],
    };

    onAdd(newSkill);
    setQuickAddInput("");
  };

  const getLevelColor = (level?: Skill["level"]) => {
    switch (level) {
      case "Expert":
        return "bg-success/20 text-success border-success/30";
      case "Advanced":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "Intermediate":
        return "bg-warning/20 text-warning border-warning/30";
      case "Beginner":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  // Empty state
  if (entries.length === 0) {
    return (
      <>
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="relative mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-warning/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 flex items-center justify-center">
              <Zap className="h-9 w-9 text-warning/60" />
            </div>
          </motion.div>
          <p className="text-muted-foreground mb-6 text-base">{t("noSkills")}</p>
          <Button variant="glow" className="group" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            {t("addSkill")}
          </Button>
        </motion.div>

        <SkillEntryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          isEditing={!!editingEntry}
        />
      </>
    );
  }

  // Skills grid
  return (
    <>
      <div className="space-y-4">
        {/* Quick add input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder={t("typeSkillPlaceholder")}
              value={quickAddInput}
              onChange={(e) => setQuickAddInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleQuickAdd();
                }
              }}
              className="pr-10"
            />
            {quickAddInput && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setQuickAddInput("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button onClick={handleQuickAdd} disabled={!quickAddInput.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            {t("add")}
          </Button>
        </div>

        {/* AI suggestion */}
        <Button
          variant="ghost"
          className="w-full text-ai hover:text-ai hover:bg-ai/10 border border-dashed border-ai/30"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {t("suggestSkillsWithAi")}
        </Button>

        {/* Skills grid */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {entries.map((skill, index) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all hover:scale-105",
                  getLevelColor(skill.level)
                )}
                onClick={() => openEditDialog(skill)}
              >
                <span className="font-medium text-sm">{skill.name}</span>
                {skill.level && (
                  <span className="text-xs opacity-70">
                    ({skill.level})
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(skill.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-error transition-opacity ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add more button */}
        <Button
          variant="outline"
          className="border-dashed border-warning/30 text-warning hover:bg-warning/10 hover:border-warning/50"
          onClick={openAddDialog}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addSkillWithDetails")}
        </Button>
      </div>

      <SkillEntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isEditing={!!editingEntry}
      />
    </>
  );
}

// Dialog component for add/edit with more details
interface SkillEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Omit<Skill, "id">;
  setFormData: (data: Omit<Skill, "id">) => void;
  onSave: () => void;
  isEditing: boolean;
}

function SkillEntryDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSave,
  isEditing,
}: SkillEntryDialogProps) {
  const { t } = useLanguage();
  const [keywordInput, setKeywordInput] = useState("");

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        keywords: [...(formData.keywords || []), keywordInput.trim()],
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      keywords: (formData.keywords || []).filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-warning" />
            </div>
            {isEditing ? t("editSkill") : t("addSkill")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Skill name */}
          <div className="space-y-2">
            <Label htmlFor="skillName">{t("skillName")} *</Label>
            <Input
              id="skillName"
              placeholder="React, Python, Project Management..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label htmlFor="level">{t("proficiencyLevel")}</Label>
            <Select
              value={formData.level || ""}
              onValueChange={(value) => setFormData({
                ...formData,
                level: value as Skill["level"] || undefined
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectLevel")} />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords/Related skills */}
          <div className="space-y-2">
            <Label>{t("relatedKeywords")}</Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("keywordPlaceholder")}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button variant="outline" size="icon" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.keywords && formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.keywords.map((keyword, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-warning/10 text-warning rounded-full group"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(index)}
                      className="ml-1 opacity-0 group-hover:opacity-100 hover:text-error transition-opacity"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={onSave} disabled={!formData.name.trim()}>
            {isEditing ? t("saveChanges") : t("addSkill")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
