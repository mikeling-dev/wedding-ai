"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskItem } from "@/components/todo-list/TaskItem";

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  isCompleted: boolean;
  category: string;
}

interface TasksByCategoryProps {
  tasks: Task[];
  categories: { name: string; description: string }[];
  onToggle: (taskId: string, isCompleted: boolean) => Promise<void>;
}

export function TasksByCategory({
  tasks,
  categories,
  onToggle,
}: TasksByCategoryProps) {
  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Calculate completed tasks per category
  const categoryProgress = Object.entries(tasksByCategory).reduce(
    (acc, [category, tasks]) => {
      acc[category] = tasks.filter((task) => task.isCompleted).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="grid gap-4">
      {categories.map((category) => {
        const categoryTasks = tasksByCategory[category.name] || [];
        if (categoryTasks.length === 0) return null;

        return (
          <Card key={category.name} className="gap-3">
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>{category.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              </div>
              <div className="text-sm text-muted-foreground text-right text-nowrap">
                {categoryProgress[category.name]} / {categoryTasks.length}{" "}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryTasks.map((task) => (
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
