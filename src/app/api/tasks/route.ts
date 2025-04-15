import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TaskCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, title, description, dueDate, category, remark } = body;

    // Get the plan and its categories
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { categories: true },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Parse the categories from the plan
    const categories =
      (plan.categories as
        | { name: TaskCategory; description: string; icon: string }[]
        | null) || [];

    // Check if the category exists in the plan's categories
    const categoryExists = categories.some((cat) => cat.name === category);

    // If the category doesn't exist, add it to the plan
    if (!categoryExists) {
      categories.push({
        name: category as TaskCategory,
        description: "",
        icon: "CircleHelp",
      });

      // Update the plan with the new categories
      await prisma.plan.update({
        where: { id: planId },
        data: { categories },
      });
    }

    const task = await prisma.task.create({
      data: {
        planId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        category,
        remark,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
