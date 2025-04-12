"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface TaskItemProps {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  isCompleted: boolean;
  onToggle: (id: string, isCompleted: boolean) => void;
}

export function TaskItem({
  id,
  title,
  description,
  dueDate,
  isCompleted,
  onToggle,
}: TaskItemProps) {
  return (
    <div className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
      <Checkbox
        id={id}
        checked={isCompleted}
        onCheckedChange={(checked) => onToggle(id, checked as boolean)}
        className="mt-1"
      />
      <div className="grid gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {title}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {dueDate && (
          <p className="text-xs text-muted-foreground">
            Due: {format(new Date(dueDate), "PPP")}
          </p>
        )}
      </div>
    </div>
  );
}
