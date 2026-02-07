"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  GraduationCap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { SortableList } from "./SortableList";
import type { Education } from "@/types/resume";

// Validation schema
const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(100, "Institution name is too long"),
  area: z.string().max(100, "Field of study is too long").optional(),
  studyType: z.string().max(50, "Degree is too long").optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  score: z.string().max(20, "GPA is too long").optional(),
  courses: z.array(z.string().max(100)).max(20).optional(),
});

type EducationErrors = Partial<Record<keyof z.infer<typeof educationSchema>, string>>;

interface EducationFormProps {
  entries: Education[];
  onAdd: (entry: Education) => void;
  onUpdate: (id: string, entry: Education) => void;
  onRemove: (id: string) => void;
  onReorder?: (entries: Education[]) => void;
}

const emptyEducationEntry: Omit<Education, "id"> = {
  institution: "",
  area: "",
  studyType: "",
  startDate: "",
  endDate: "",
  score: "",
  courses: [],
};

export function EducationForm({
  entries,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: EducationFormProps) {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Omit<Education, "id">>(emptyEducationEntry);
  const [errors, setErrors] = useState<EducationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPresent, setIsPresent] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [courseInput, setCourseInput] = useState("");

  const validateAll = useCallback(() => {
    const result = educationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: EducationErrors = {};
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof EducationErrors;
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

  const handleBlur = (field: keyof EducationErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Validate single field
    const result = educationSchema.safeParse(formData);
    if (!result.success) {
      const fieldError = result.error.issues.find(e => e.path[0] === field);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field]: fieldError.message }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData(emptyEducationEntry);
    setEditingEntry(null);
    setIsPresent(false);
    setCourseInput("");
    setErrors({});
    setTouched({});
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: Education) => {
    setEditingEntry(entry);
    setFormData({
      institution: entry.institution,
      area: entry.area,
      studyType: entry.studyType,
      startDate: entry.startDate,
      endDate: entry.endDate || "",
      score: entry.score || "",
      courses: entry.courses || [],
    });
    setIsPresent(!entry.endDate);
    setErrors({});
    setTouched({});
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    setTouched({ institution: true, startDate: true });

    if (!validateAll()) {
      return;
    }

    const entry: Education = {
      id: editingEntry?.id || crypto.randomUUID(),
      institution: formData.institution,
      area: formData.area,
      studyType: formData.studyType,
      startDate: formData.startDate,
      endDate: isPresent ? undefined : formData.endDate,
      score: formData.score,
      courses: formData.courses,
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

  const addCourse = () => {
    if (courseInput.trim()) {
      setFormData({
        ...formData,
        courses: [...(formData.courses || []), courseInput.trim()],
      });
      setCourseInput("");
    }
  };

  const removeCourse = (index: number) => {
    setFormData({
      ...formData,
      courses: (formData.courses || []).filter((_, i) => i !== index),
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const isFormValid = formData.institution.trim() && formData.startDate;

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
            <div className="absolute inset-0 bg-success/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 border border-success/30 flex items-center justify-center">
              <GraduationCap className="h-9 w-9 text-success/60" />
            </div>
          </motion.div>
          <p className="text-muted-foreground mb-6 text-base">{t("noEducation")}</p>
          <Button variant="glow" className="group" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            {t("addEducationBtn")}
          </Button>
        </motion.div>

        <EducationEntryDialog
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
          courseInput={courseInput}
          setCourseInput={setCourseInput}
          addCourse={addCourse}
          removeCourse={removeCourse}
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
            <Card className="bg-elevated/50 border-border/50 hover:border-success/30 transition-colors group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {entry.studyType && entry.area
                            ? `${entry.studyType} in ${entry.area}`
                            : entry.studyType || entry.area || "Degree"}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">{entry.institution}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(entry.startDate)} — {entry.endDate ? formatDate(entry.endDate) : "Present"}
                          {entry.score && ` • GPA: ${entry.score}`}
                        </p>
                      </div>

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
                          className="h-8 w-8 text-muted-foreground hover:text-success"
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

                    <AnimatePresence>
                      {expandedId === entry.id && entry.courses && entry.courses.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Relevant Courses:</p>
                            <div className="flex flex-wrap gap-1">
                              {entry.courses.map((course, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-success/10 text-success rounded-full"
                                >
                                  {course}
                                </span>
                              ))}
                            </div>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: entries.length * 0.05 + 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full border-dashed border-success/30 text-success hover:bg-success/10 hover:border-success/50"
            onClick={openAddDialog}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addEducationBtn")}
          </Button>
        </motion.div>
      </div>

      <EducationEntryDialog
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
        courseInput={courseInput}
        setCourseInput={setCourseInput}
        addCourse={addCourse}
        removeCourse={removeCourse}
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
interface EducationEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Omit<Education, "id">;
  setFormData: (data: Omit<Education, "id">) => void;
  errors: EducationErrors;
  touched: Record<string, boolean>;
  onBlur: (field: keyof EducationErrors) => void;
  isPresent: boolean;
  setIsPresent: (value: boolean) => void;
  courseInput: string;
  setCourseInput: (value: string) => void;
  addCourse: () => void;
  removeCourse: (index: number) => void;
  onSave: () => void;
  isEditing: boolean;
  isFormValid: boolean;
}

function EducationEntryDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  errors,
  touched,
  onBlur,
  isPresent,
  setIsPresent,
  courseInput,
  setCourseInput,
  addCourse,
  removeCourse,
  onSave,
  isEditing,
  isFormValid,
}: EducationEntryDialogProps) {
  const { t } = useLanguage();

  const showError = (field: keyof EducationErrors) => touched[field] && errors[field];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-success" />
            </div>
            {isEditing ? t("editEducation") : t("addEducationBtn")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institution" className={cn(showError("institution") && "text-error")}>
              {t("institution")} <span className="text-error">*</span>
            </Label>
            <Input
              id="institution"
              placeholder="Harvard University"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              onBlur={() => onBlur("institution")}
              className={cn(showError("institution") && "border-error focus-visible:border-error focus-visible:ring-error/50")}
              aria-invalid={!!showError("institution")}
            />
            <FieldError message={showError("institution") ? errors.institution : undefined} />
          </div>

          {/* Degree & Field */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studyType">{t("degree")}</Label>
              <Input
                id="studyType"
                placeholder="Bachelor's"
                value={formData.studyType}
                onChange={(e) => setFormData({ ...formData, studyType: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">{t("fieldOfStudy")}</Label>
              <Input
                id="area"
                placeholder="Computer Science"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eduStartDate" className={cn(showError("startDate") && "text-error")}>
                {t("startDate")} <span className="text-error">*</span>
              </Label>
              <Input
                id="eduStartDate"
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
              <Label htmlFor="eduEndDate">{t("endDate")}</Label>
              <Input
                id="eduEndDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isPresent}
              />
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id="eduPresent"
                  checked={isPresent}
                  onCheckedChange={(checked) => {
                    setIsPresent(!!checked);
                    if (checked) {
                      setFormData({ ...formData, endDate: "" });
                    }
                  }}
                />
                <Label htmlFor="eduPresent" className="text-sm text-muted-foreground cursor-pointer">
                  {t("currentlyStudying")}
                </Label>
              </div>
            </div>
          </div>

          {/* GPA */}
          <div className="space-y-2">
            <Label htmlFor="score">{t("gpa")}</Label>
            <Input
              id="score"
              placeholder="3.8 / 4.0"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
            />
          </div>

          {/* Courses */}
          <div className="space-y-2">
            <Label>{t("relevantCourses")}</Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("coursePlaceholder")}
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCourse();
                  }
                }}
              />
              <Button variant="outline" size="icon" onClick={addCourse}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.courses && formData.courses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.courses.map((course, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-success/10 text-success rounded-full group"
                  >
                    {course}
                    <button
                      onClick={() => removeCourse(index)}
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
          <Button onClick={onSave} disabled={!isFormValid}>
            {isEditing ? t("saveChanges") : t("addEducationBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
