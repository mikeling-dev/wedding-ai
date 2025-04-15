import { notFound } from "next/navigation";
import { TaskDetail } from "@/components/task-detail/TaskDetail";
import { prisma } from "@/lib/prisma";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="px-6 md:px-24 mx-auto">
      <TaskDetail task={task} />
    </div>
  );
}
