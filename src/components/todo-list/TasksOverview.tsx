import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { differenceInDays, format } from "date-fns";
import { TaskFilter } from "./TaskFilter";

interface TasksOverviewProps {
  weddingDate: Date;
  totalTasks: number;
  completedTasks: number;
  currentFilter: string;
  currentSort: string;
}

export function TasksOverview({
  weddingDate,
  totalTasks,
  completedTasks,
  currentFilter,
  currentSort,
}: TasksOverviewProps) {
  const daysUntilWedding = differenceInDays(new Date(weddingDate), new Date());
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* Top Row: Date, Countdown, and Filter */}
        <div className="flex justify-between">
          <div className="flex md:items-center flex-col md:flex-row gap-2 md:gap-8">
            <div className="flex items-center gap-1.5 text-sm md:text-lg">
              <div className="p-2 rounded-full min-w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {daysUntilWedding}
              </div>
              <div>
                <p className="font-semibold text-card-foreground">
                  Days Until Wedding
                </p>
              </div>
            </div>

            {/* Wedding Date */}
            <div className="flex items-center gap-3">
              <div>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(weddingDate), "PPP")}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Button */}
          <TaskFilter currentFilter={currentFilter} currentSort={currentSort} />
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between items-center text-sm">
            <p className="font-medium text-muted-foreground">
              {Math.round(progressPercentage)}% Completed
            </p>
            <p className="text-muted-foreground">
              {completedTasks} / {totalTasks}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
