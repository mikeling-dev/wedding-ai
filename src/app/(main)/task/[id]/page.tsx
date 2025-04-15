import { notFound } from "next/navigation";
import { TaskDetail } from "@/components/task-detail/TaskDetail";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: PageProps) => {
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
};

export default page;
