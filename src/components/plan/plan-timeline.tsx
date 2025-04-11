import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface TimelineItem {
  phase: string;
  description: string;
  startTime: string;
}

interface PlanTimelineProps {
  timeline: TimelineItem[];
  weddingDate: Date | null;
}

export function PlanTimeline({ timeline, weddingDate }: PlanTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Line running down the middle */}
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-muted" />

          {timeline.map((item, index) => (
            <div key={index} className="relative grid gap-1 pl-8">
              {/* Circle marker */}
              <div className="absolute left-0 w-8 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <div className="text-sm font-medium">{item.phase}</div>
              <div className="text-sm text-muted-foreground">
                {item.description}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {item.startTime}
              </div>
            </div>
          ))}

          {weddingDate && (
            <div className="relative grid gap-1 pl-8">
              <div className="absolute left-0 w-8 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="text-sm font-medium">Wedding Day</div>
              <div className="text-xs text-muted-foreground font-medium">
                {format(new Date(weddingDate), "PPP")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
