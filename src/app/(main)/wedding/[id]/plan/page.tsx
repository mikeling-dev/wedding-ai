import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlanOverview } from "@/components/plan/plan-overview";
import { PlanBudget } from "@/components/plan/plan-budget";
import { PlanTimeline } from "@/components/plan/plan-timeline";
import { PlanCategories } from "@/components/plan/plan-categories";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import { ClipboardList } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Component-specific interfaces
interface BudgetItem {
  category: string;
  percentage: number;
  amount: number;
}

interface TimelineItem {
  phase: string;
  description: string;
  startTime: string;
}

interface Category {
  name: string;
  description: string;
  icon: string;
}

// Database interfaces
interface DbBudgetItem {
  category: string;
  amount: number;
  notes?: string;
}

interface DbCategory {
  name: string;
  description: string;
  icon: string;
}

async function getPlan(weddingId: string) {
  const plan = await prisma.plan.findFirst({
    where: { weddingId },
    include: {
      wedding: true,
    },
  });

  if (!plan) {
    notFound();
  }

  return plan;
}

export default async function PlanPage(props: PageProps) {
  const params = await props.params;
  // Ensure params.id is handled properly
  if (!params?.id) {
    notFound();
  }

  const plan = await getPlan(params.id);

  // Transform budget data
  const rawBudget = (plan.budgetBreakdown as DbBudgetItem[] | null) || [];
  const totalBudgetAmount = rawBudget.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const parsedBudget: BudgetItem[] = rawBudget.map((item) => ({
    category: item.category,
    amount: item.amount,
    percentage: Math.round((item.amount / totalBudgetAmount) * 100),
  }));

  // Transform timeline data
  const rawTimeline = (plan.timeline as TimelineItem[] | null) || [];

  // Since the data is already in the correct format, we don't need to transform it
  const parsedTimeline: TimelineItem[] = rawTimeline;

  // Transform categories data
  const rawCategories = (plan.categories as DbCategory[] | null) || [];
  const parsedCategories: Category[] = rawCategories.map((cat) => ({
    name: cat.name,
    description: cat.description || "No description",
    icon: cat.icon || "ListIcon", // Default icon if none provided
  }));

  return (
    <div className="py-8 space-y-8 w-full px-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wedding Plan</h1>
        <Link href={`/wedding/${plan.weddingId}/tasks`}>
          <Button>
            <ClipboardList className="w-4 h-4 mr-2" />
            View Tasks
          </Button>
        </Link>
      </div>

      <div className="grid gap-8">
        <PlanOverview overview={plan.overview} wedding={plan.wedding} />

        <div className="grid md:grid-cols-2 gap-8">
          <PlanBudget
            budget={parsedBudget}
            totalBudget={plan.wedding.budget || 0}
          />
          <PlanTimeline
            timeline={parsedTimeline}
            weddingDate={plan.wedding.date}
          />
        </div>

        <PlanCategories categories={parsedCategories} />
      </div>
    </div>
  );
}
