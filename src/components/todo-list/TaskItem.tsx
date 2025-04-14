"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskItemProps {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  isCompleted: boolean;
  onToggle: () => Promise<void>;
}

export function TaskItem({
  id,
  title,
  description,
  dueDate,
  isCompleted,
  onToggle,
}: TaskItemProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-start gap-2">
        <Checkbox checked={isCompleted} onCheckedChange={onToggle} />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p
              className={
                isCompleted ? "line-through text-muted-foreground" : ""
              }
            >
              {title}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {description && (
            <p
              className={`text-sm ${
                isCompleted
                  ? "line-through text-muted-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {description}
            </p>
          )}
          {dueDate && (
            <p className="text-xs text-muted-foreground">
              Due: {format(new Date(dueDate), "PPP")}
            </p>
          )}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{title}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
