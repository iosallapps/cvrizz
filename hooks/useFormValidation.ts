"use client";

import { useState, useCallback } from "react";
import { z } from "zod";

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
}

interface FieldError {
  message: string;
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  onSubmit,
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (data: unknown): data is T => {
      const result = schema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, FieldError> = {};
        result.error.issues.forEach((err) => {
          const path = err.path.join(".");
          if (path) {
            fieldErrors[path] = { message: err.message };
          }
        });
        setErrors(fieldErrors);
        return false;
      }
      setErrors({});
      return true;
    },
    [schema]
  );

  const validateField = useCallback(
    (field: string, value: unknown, fullData: Record<string, unknown>) => {
      const dataToValidate = { ...fullData, [field]: value };
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const fieldError = result.error.issues.find(
          (err) => err.path.join(".") === field
        );
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [field]: { message: fieldError.message },
          }));
          return false;
        }
      }

      // Clear error for this field if valid
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    },
    [schema]
  );

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    async (data: unknown) => {
      if (!validate(data)) {
        return false;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(data as T);
        return true;
      } catch (error) {
        console.error("Form submission error:", error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, onSubmit]
  );

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return errors[field]?.message;
    },
    [errors]
  );

  const hasError = useCallback(
    (field: string): boolean => {
      return !!errors[field];
    },
    [errors]
  );

  return {
    errors,
    isSubmitting,
    validate,
    validateField,
    clearError,
    clearAllErrors,
    handleSubmit,
    getFieldError,
    hasError,
  };
}
