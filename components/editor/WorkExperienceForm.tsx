"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { SortableList } from "./SortableList";
import type { WorkExperience } from "@/types/resume";

// Validation schema
const workEntrySchema = z.object({
  company: z.string().min(1, "Company name is required").max(100, "Company name is too long"),
  position: z.string().min(1, "Position is required").max(100, "Position is too long"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  summary: z.string().max(500, "Description is too long").optional(),
  highlights: z.array(z.string().max(300)).max(10).optional(),
});

type WorkEntryErrors = Partial<Record<keyof z.infer<typeof workEntrySchema>, string>>;

interface WorkExperienceFormProps {
  entries: WorkExperience[];
  onAdd: (entry: WorkExperience) => void;
  onUpdate: (id: string, entry: WorkExperience) => void;
  onRemove: (id: string) => void;
  onReorder?: (entries: WorkExperience[]) => void;
}

const emptyWorkEntry: Omit<WorkExperience, "id"> = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  summary: "",
  highlights: [],
};

export function WorkExperienceForm({
  entries,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: WorkExperienceFormProps) {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkExperience | null>(null);
  const [formData, setFormData] = useState<Omit<WorkExperience, "id">>(emptyWorkEntry);
  const [errors, setErrors] = useState<WorkEntryErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPresent, setIsPresent] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [highlightInput, setHighlightInput] = useState("");

  const validateField = useCallback((field: keyof WorkEntryErrors, value: unknown) => {
    const testData = { ...formData, [field]: value };
    const result = workEntrySchema.safeParse(testData);

    if (!result.success) {
      const fieldError = result.error.issues.find(e => e.path[0] === field);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field]: fieldError.message }));
        return false;
      }
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return true;
  }, [formData]);

  const validateAll = useCallback(() => {
    const result = workEntrySchema.safeParse(formData);
    if (!result.success) {
      const newErrors: WorkEntryErrors = {};
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof WorkEntryErrors;
        if (field && !newErrors[field]) {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  const handleBlur = (field: keyof WorkEntryErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const resetForm = () => {
    setFormData(emptyWorkEntry);
    setEditingEntry(null);
    setIsPresent(false);
    setHighlightInput("");
    setErrors({});
    setTouched({});
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: WorkExperience) => {
    setEditingEntry(entry);
    setFormData({
      company: entry.company,
      position: entry.position,
      startDate: entry.startDate,
      endDate: entry.endDate || "",
      summary: entry.summary || "",
      highlights: entry.highlights || [],
    });
    setIsPresent(!entry.endDate);
    setErrors({});
    setTouched({});
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({ company: true, position: true, startDate: true });

    if (!validateAll()) {
      return;
    }

    const entry: WorkExperience = {
      id: editingEntry?.id || crypto.randomUUID(),
      company: formData.company,
      position: formData.position,
      startDate: formData.startDate,
      endDate: isPresent ? undefined : formData.endDate,
      summary: formData.summary,
      highlights: formData.highlights,
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

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, highlightInput.trim()],
      });
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const isFormValid = formData.company.trim() && formData.position.trim() && formData.startDate;

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
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 flex items-center justify-center">
              <Briefcase className="h-9 w-9 text-blue-500/60" />
            </div>
          </motion.div>
          <p className="text-muted-foreground mb-6 text-base">{t("noWorkExperience")}</p>
          <Button variant="glow" className="group" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            {t("addExperience")}
          </Button>
        </motion.div>

        <WorkEntryDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) resetForm();
            setIsDialogOpen(open);
          }}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          touched={touched}
          onBlur={handleBlur}
          isPresent={isPresent}
          setIsPresent={setIsPresent}
          highlightInput={highlightInput}
          setHighlightInput={setHighlightInput}
          addHighlight={addHighlight}
          removeHighlight={removeHighlight}
          onSave={handleSave}
          isEditing={!!editingEntry}
          isFormValid={!!isFormValid}
        />
      </>
    );
  }

  // Entries list
  return (
    <>
      <div className="space-y-3">
        <SortableList
          items={entries}
          getId={(entry) => entry.id}
          onReorder={(newEntries) => onReorder?.(newEntries)}
          className="space-y-3"
          renderItem={(entry) => (
            <Card className="bg-elevated/50 border-border/50 hover:border-blue-500/30 transition-colors group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-medium text-foreground truncate">{entry.position}</h4>
                        <p className="text-sm text-muted-foreground truncate">{entry.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(entry.startDate)} — {entry.endDate ? formatDate(entry.endDate) : "Present"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        >
                          {expandedId === entry.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                          onClick={() => openEditDialog(entry)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-error"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedId === entry.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                            {entry.summary && (
                              <p className="text-sm text-muted-foreground">{entry.summary}</p>
                            )}
                            {entry.highlights && entry.highlights.length > 0 && (
                              <ul className="space-y-1">
                                {entry.highlights.map((highlight, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        />

        {/* Add button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: entries.length * 0.05 + 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full border-dashed border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/50"
            onClick={openAddDialog}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addExperience")}
          </Button>
        </motion.div>
      </div>

      <WorkEntryDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        touched={touched}
        onBlur={handleBlur}
        isPresent={isPresent}
        setIsPresent={setIsPresent}
        highlightInput={highlightInput}
        setHighlightInput={setHighlightInput}
        addHighlight={addHighlight}
        removeHighlight={removeHighlight}
        onSave={handleSave}
        isEditing={!!editingEntry}
        isFormValid={!!isFormValid}
      />
    </>
  );
}

// Error message component
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-error flex items-center gap-1 mt-1"
    >
      <AlertCircle className="h-3 w-3" />
      {message}
    </motion.p>
  );
}

// Dialog component for add/edit
interface WorkEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Omit<WorkExperience, "id">;
  setFormData: (data: Omit<WorkExperience, "id">) => void;
  errors: WorkEntryErrors;
  touched: Record<string, boolean>;
  onBlur: (field: keyof WorkEntryErrors) => void;
  isPresent: boolean;
  setIsPresent: (value: boolean) => void;
  highlightInput: string;
  setHighlightInput: (value: string) => void;
  addHighlight: () => void;
  removeHighlight: (index: number) => void;
  onSave: () => void;
  isEditing: boolean;
  isFormValid: boolean;
}

function WorkEntryDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  errors,
  touched,
  onBlur,
  isPresent,
  setIsPresent,
  highlightInput,
  setHighlightInput,
  addHighlight,
  removeHighlight,
  onSave,
  isEditing,
  isFormValid,
}: WorkEntryDialogProps) {
  const { t } = useLanguage();

  const showError = (field: keyof WorkEntryErrors) => touched[field] && errors[field];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-blue-500" />
            </div>
            {isEditing ? t("editExperience") : t("addExperience")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Company & Position */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company" className={cn(showError("company") && "text-error")}>
                {t("companyName")} <span className="text-error">*</span>
              </Label>
              <Input
                id="company"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                onBlur={() => onBlur("company")}
                className={cn(showError("company") && "border-error focus-visible:border-error focus-visible:ring-error/50")}
                aria-invalid={!!showError("company")}
              />
              <FieldError message={showError("company") ? errors.company : undefined} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className={cn(showError("position") && "text-error")}>
                {t("position")} <span className="text-error">*</span>
              </Label>
              <Input
                id="position"
                placeholder="Software Engineer"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                onBlur={() => onBlur("position")}
                className={cn(showError("position") && "border-error focus-visible:border-error focus-visible:ring-error/50")}
                aria-invalid={!!showError("position")}
              />
              <FieldError message={showError("position") ? errors.position : undefined} />
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate" className={cn(showError("startDate") && "text-error")}>
                {t("startDate")} <span className="text-error">*</span>
              </Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                onBlur={() => onBlur("startDate")}
                className={cn(showError("startDate") && "border-error focus-visible:border-error focus-visible:ring-error/50")}
                aria-invalid={!!showError("startDate")}
              />
              <FieldError message={showError("startDate") ? errors.startDate : undefined} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t("endDate")}</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isPresent}
              />
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id="present"
                  checked={isPresent}
                  onCheckedChange={(checked) => {
                    setIsPresent(!!checked);
                    if (checked) {
                      setFormData({ ...formData, endDate: "" });
                    }
                  }}
                />
                <Label htmlFor="present" className="text-sm text-muted-foreground cursor-pointer">
                  {t("currentlyWorking")}
                </Label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary" className={cn(showError("summary") && "text-error")}>
                {t("description")}
              </Label>
              <Button variant="ghost" size="sm" className="text-ai hover:text-ai hover:bg-ai/10 h-7 gap-1">
                <Sparkles className="h-3 w-3" />
                {t("generateWithAi")}
              </Button>
            </div>
            <Textarea
              id="summary"
              placeholder={t("workDescriptionPlaceholder")}
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              onBlur={() => onBlur("summary")}
              className={cn(showError("summary") && "border-error focus-visible:border-error focus-visible:ring-error/50")}
            />
            <FieldError message={showError("summary") ? errors.summary : undefined} />
          </div>

          {/* Highlights/Achievements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("achievements")}</Label>
              <Button variant="ghost" size="sm" className="text-ai hover:text-ai hover:bg-ai/10 h-7 gap-1">
                <Sparkles className="h-3 w-3" />
                {t("generateWithAi")}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t("achievementPlaceholder")}
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
              />
              <Button variant="outline" size="icon" onClick={addHighlight}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.highlights.length > 0 && (
              <ul className="space-y-2 mt-3">
                {formData.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 text-sm bg-elevated/50 p-2 rounded-lg group"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span className="flex-1 text-muted-foreground">{highlight}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-error"
                      onClick={() => removeHighlight(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={onSave} disabled={!isFormValid}>
            {isEditing ? t("saveChanges") : t("addExperience")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
