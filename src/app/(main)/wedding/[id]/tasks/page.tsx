import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface PageProps {
  params: {
    id: string;
  };
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

export default async function TasksPage({ params }: PageProps) {
  const plan = await getTasks(params.id);
  const categories = plan.categories
    ? JSON.parse(plan.categories as string)
    : [];

  // Group tasks by category
  const tasksByCategory = plan.tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof plan.tasks>);

  return (
    <div className="container py-8 space-y-8">
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
                  <div
                    key={task.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <Checkbox
                      id={task.id}
                      checked={task.isCompleted}
                      // This will be implemented later with client components
                      onCheckedChange={() => {}}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5">
                      <label
                        htmlFor={task.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {task.title}
                      </label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground">
                          Due: {format(new Date(task.dueDate), "PPP")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
