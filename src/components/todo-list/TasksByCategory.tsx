"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskItem } from "@/components/todo-list/TaskItem";
import { TaskCategory } from "@prisma/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  isCompleted: boolean;
  category: TaskCategory;
}

interface TasksByCategoryProps {
  tasks: Task[];
  categories: { name: TaskCategory; description: string }[];
  onToggle: (taskId: string, isCompleted: boolean) => Promise<void>;
}

export function TasksByCategory({
  tasks,
  categories,
  onToggle,
}: TasksByCategoryProps) {
  // If categories array is empty, create categories from unique task categories
  const effectiveCategories =
    categories.length > 0
      ? categories
      : Array.from(new Set(tasks.map((task) => task.category))).map((cat) => ({
          name: cat,
          description: "", // No description available for auto-generated categories
        }));

  // Helper function to format category name for display
  const formatCategoryName = (category: TaskCategory) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  return (
    <div className="grid gap-4">
      {effectiveCategories.map((category) => {
        // Find tasks for this category using case-insensitive comparison
        const tasksForCategory = tasks.filter(
          (task) => task.category.toUpperCase() === category.name.toUpperCase()
        );

        return (
          <Card
            key={category.name}
            className={`gap-3 ${tasksForCategory.length === 0 && "hidden"}`}
          >
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>{formatCategoryName(category.name)}</CardTitle>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="text-sm text-muted-foreground text-right text-nowrap">
                {tasksForCategory.filter((t) => t.isCompleted).length} /{" "}
                {tasksForCategory.length}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksForCategory.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate}
                    isCompleted={task.isCompleted}
                    onToggle={async () => {
                      await onToggle(task.id, !task.isCompleted);
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
