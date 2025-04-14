"use client";
import { isToday, isTomorrow, isPast } from "date-fns";
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

interface TasksByDateProps {
  tasks: Task[];
  onToggle: (taskId: string, isCompleted: boolean) => Promise<void>;
}

export function TasksByDate({ tasks, onToggle }: TasksByDateProps) {
  // Group tasks by due date status
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      if (!task.dueDate) {
        acc.noDueDate.push(task);
      } else {
        const dueDate = new Date(task.dueDate);
        if (isPast(dueDate) && !isToday(dueDate)) {
          acc.overdue.push(task);
        } else if (isToday(dueDate)) {
          acc.today.push(task);
        } else if (isTomorrow(dueDate)) {
          acc.tomorrow.push(task);
        } else {
          acc.upcoming.push(task);
        }
      }
      return acc;
    },
    {
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      upcoming: [] as Task[],
      noDueDate: [] as Task[],
    }
  );

  const sections = [
    {
      title: "Overdue",
      tasks: groupedTasks.overdue,
      className: "border-destructive",
    },
    {
      title: "Today",
      tasks: groupedTasks.today,
      className: "border-primary",
    },
    {
      title: "Tomorrow",
      tasks: groupedTasks.tomorrow,
      className: "",
    },
    {
      title: "Upcoming",
      tasks: groupedTasks.upcoming,
      className: "",
    },
    {
      title: "No Due Date",
      tasks: groupedTasks.noDueDate,
      className: "",
    },
  ];

  return (
    <div className="grid gap-4">
      {sections.map(
        (section) =>
          section.tasks.length > 0 && (
            <Card key={section.title} className={`gap-3 ${section.className}`}>
              <CardHeader className="flex flex-row justify-between">
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {section.tasks.length} task
                    {section.tasks.length !== 1 && "s"}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground text-right text-nowrap">
                  {section.tasks.filter((task) => task.isCompleted).length} /{" "}
                  {section.tasks.length}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.tasks
                    .sort((a, b) => {
                      if (!a.dueDate && !b.dueDate) return 0;
                      if (!a.dueDate) return 1;
                      if (!b.dueDate) return -1;
                      return (
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                      );
                    })
                    .map((task) => (
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
          )
      )}
    </div>
  );
}
