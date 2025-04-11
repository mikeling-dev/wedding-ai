import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TaskItem } from "./task-item";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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

  // Group tasks by category
  const tasksByCategory = plan.tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof plan.tasks>);

  return (
    <div className="w-full px-12 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wedding Tasks</h1>
        <Link href={`/wedding/${params.id}/plan`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plan
          </Button>
        </Link>
      </div>

      <div className="grid gap-8">
        {categories.map((category: { name: string; description: string }) => (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksByCategory[category.name]?.map((task) => (
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
        ))}
      </div>
    </div>
  );
}
