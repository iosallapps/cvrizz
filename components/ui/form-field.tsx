"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input, InputProps } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(error && "text-error")}>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-error flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

interface FormInputProps extends InputProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  containerClassName?: string;
}

export function FormInput({
  label,
  error,
  required,
  hint,
  containerClassName,
  className,
  ...props
}: FormInputProps) {
  return (
    <FormField
      label={label}
      error={error}
      required={required}
      hint={hint}
      className={containerClassName}
    >
      <Input
        className={cn(
          error && "border-error focus-visible:border-error focus-visible:ring-error/50",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    </FormField>
  );
}

interface FormTextareaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  containerClassName?: string;
}

export function FormTextarea({
  label,
  error,
  required,
  hint,
  containerClassName,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <FormField
      label={label}
      error={error}
      required={required}
      hint={hint}
      className={containerClassName}
    >
      <Textarea
        className={cn(
          error && "border-error focus-visible:border-error focus-visible:ring-error/50",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    </FormField>
  );
}
