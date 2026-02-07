"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./DragHandle";
import { cn } from "@/lib/utils";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SortableItem({ id, children, disabled, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex items-start gap-1",
        isDragging && "opacity-50 z-10",
        className
      )}
    >
      <DragHandle
        listeners={listeners}
        attributes={attributes}
        disabled={disabled}
        className="shrink-0 mt-1"
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
