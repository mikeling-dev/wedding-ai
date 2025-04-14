import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TasksOverview } from "@/components/todo-list/TasksOverview";
import { AddTaskDialog } from "@/components/todo-list/AddTaskDialog";
import { TasksByDate } from "@/components/todo-list/TasksByDate";
import { TasksByCategory } from "@/components/todo-list/TasksByCategory";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: {
    filter?: string;
    sortBy?: "category" | "date";
  };
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
        orderBy: [{ dueDate: "asc" }, { category: "asc" }],
      },
      wedding: true,
    },
  });

  if (!plan) {
    notFound();
  }

  return plan;
}

async function toggleTask(taskId: string, isCompleted: boolean) {
  "use server";

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted },
    });

    // Revalidate the tasks page to update the task counts and progress
    revalidatePath("/wedding/[id]/tasks");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export default async function TasksPage(props: PageProps) {
  const params = await props.params;
  const plan = await getTasks(params.id);
  const categories = (plan.categories as DbCategory[] | null) || [];
  const filter = props.searchParams.filter || "all";
  const sortBy = props.searchParams.sortBy || "category";

  // Filter tasks based on the filter parameter
  const filteredTasks = plan.tasks.filter((task) => {
    if (filter === "completed") return task.isCompleted;
    if (filter === "pending") return !task.isCompleted;
    return true; // "all" filter
  });

  // Calculate total tasks and completed tasks
  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter((task) => task.isCompleted).length;

  return (
    <div className="w-full px-6 md:px-12 py-8 space-y-4">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl md:text-3xl font-bold">Wedding To-Do List</h1>
          <p>Track and manage all your wedding planning tasks in one place.</p>
        </div>
        <div className="flex gap-2 w-full justify-between">
          <div className="flex gap-2">
            <Link href={`/wedding/${params.id}/plan`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plan
              </Button>
            </Link>
          </div>
          <AddTaskDialog planId={plan.id} categories={categories} />
        </div>
      </div>

      <TasksOverview
        weddingDate={plan.wedding.date!}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        currentFilter={filter}
        currentSort={sortBy}
      />

      {sortBy === "date" ? (
        <TasksByDate
          tasks={filteredTasks}
          onToggle={async (taskId, isCompleted) => {
            "use server";
            await toggleTask(taskId, isCompleted);
          }}
        />
      ) : (
        <TasksByCategory
          tasks={filteredTasks}
          categories={categories}
          onToggle={async (taskId, isCompleted) => {
            "use server";
            await toggleTask(taskId, isCompleted);
          }}
        />
      )}
    </div>
  );
}
