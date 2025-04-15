"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
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
import Link from "next/link";

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
  isCompleted: initialIsCompleted,
  onToggle,
}: TaskItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [optimisticIsCompleted, setOptimisticIsCompleted] =
    useOptimistic(initialIsCompleted);

  const handleToggle = async () => {
    startTransition(async () => {
      // Optimistically update the UI
      setOptimisticIsCompleted(!optimisticIsCompleted);

      try {
        await onToggle();
      } catch (error) {
        // Revert the optimistic update if the server request fails
        setOptimisticIsCompleted(optimisticIsCompleted);
        console.error("Error toggling task:", error);
      }
    });
  };

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
      <div className="flex items-start gap-3">
        <Checkbox
          checked={optimisticIsCompleted}
          onCheckedChange={handleToggle}
          className="mt-2"
          disabled={isPending}
        />
        <div className="flex-1 flex flex-row justify-between">
          <div className="flex flex-col gap-2 w-full">
            <Link href={`/task/${id}`}>
              <p
                onClick={() => router.push(`/task/${id}`)}
                className={`hover:underline cursor-pointer ${
                  optimisticIsCompleted ? "text-muted-foreground" : ""
                }`}
              >
                {title}
              </p>
              {description && (
                <p
                  className={`text-sm ${
                    optimisticIsCompleted
                      ? " text-muted-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {description}
                </p>
              )}
              {dueDate && (
                <p className="text-sm font-medium text-muted-foreground">
                  Due: {format(new Date(dueDate), "PPP")}
                </p>
              )}
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
