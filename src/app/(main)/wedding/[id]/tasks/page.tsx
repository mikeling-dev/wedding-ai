import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TaskItem } from "@/components/todo-list/TaskItem";
import { TasksOverview } from "@/components/todo-list/TasksOverview";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: { filter?: string };
}

interface DbCategory {
  name: string;
  description: string;
  icon: string;
}

async function getTasks(weddingId: string) {
  const plan = await prisma.plan.findFirst({
    where: { weddingId },
    include: {
      tasks: {
        orderBy: {
          category: "asc",
        },
      },
      wedding: true,
    },
  });

  if (!plan) {
    notFound();
  }

  return plan;
}

export default async function TasksPage(props: PageProps) {
  const params = await props.params;
  const plan = await getTasks(params.id);
  const categories = (plan.categories as DbCategory[] | null) || [];
  const filter = props.searchParams.filter || "all";

  // Filter tasks based on the filter parameter
  const filteredTasks = plan.tasks.filter((task) => {
    if (filter === "completed") return task.isCompleted;
    if (filter === "pending") return !task.isCompleted;
    return true; // "all" filter
  });

  // Calculate total tasks and completed tasks
  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter((task) => task.isCompleted).length;

  // Group tasks by category
  const tasksByCategory = filteredTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof plan.tasks>);

  // Calculate completed tasks per category
  const categoryProgress = Object.entries(tasksByCategory).reduce(
    (acc, [category, tasks]) => {
      acc[category] = tasks.filter((task) => task.isCompleted).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="w-full px-6 md:px-12 py-8 space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-3xl font-bold">Wedding To-Do List</h1>
          <p>Track and manage all your wedding planning tasks in one place.</p>
        </div>
        <Link href={`/wedding/${params.id}/plan`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plan
          </Button>
        </Link>
      </div>

      <TasksOverview
        weddingDate={plan.wedding.date}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
      />

      <div className="grid gap-4">
        {categories.map((category: { name: string; description: string }) => {
          const categoryTasks = tasksByCategory[category.name] || [];
          if (categoryTasks.length === 0) return null;

          return (
            <Card key={category.name}>
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
                        "use server";
                        // Server action will be implemented later
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
