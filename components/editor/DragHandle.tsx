"use client";

import { forwardRef } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
  disabled?: boolean;
  className?: string;
}

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ listeners, attributes, disabled, className }, ref) => {
    if (disabled) return null;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "touch-none p-2 min-h-[44px] min-w-[44px]",
          "rounded-md transition-colors",
          "hover:bg-muted/50 active:bg-muted",
          "cursor-grab active:cursor-grabbing",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "opacity-50 hover:opacity-100",
          className
        )}
        aria-label="Drag to reorder"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
    );
  }
);

DragHandle.displayName = "DragHandle";
