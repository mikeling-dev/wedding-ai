import { Binoculars, Milestone, Wand2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type GenerationStep = "analyzing" | "generating" | "redirecting";

interface PlanGenerationLoadingProps {
  step: GenerationStep;
  show: boolean;
}

const stepIcons = {
  analyzing: (
    <Binoculars className="h-12 w-12 text-primary" strokeWidth={1.5} />
  ),
  generating: <Wand2 className="h-12 w-12 text-primary" strokeWidth={1.5} />,
  redirecting: (
    <Milestone className="h-12 w-12 text-primary" strokeWidth={1.5} />
  ),
};

const stepMessages = {
  analyzing: "Analyzing wedding summary...",
  generating: "Generating your personalized plan...",
  redirecting: "Redirecting to your wedding plan...",
};

const stepProgress = {
  analyzing: 33,
  generating: 66,
  redirecting: 100,
};

export function PlanGenerationLoading({
  step,
  show,
}: PlanGenerationLoadingProps) {
  if (!show) return null;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" />

      {/* Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto p-8 pt-12 bg-background rounded-lg shadow-lg">
          <div className="animate-[bounce_1s_infinite]">{stepIcons[step]}</div>

          <div className="w-full space-y-4">
            <Progress value={stepProgress[step]} className="w-full" />
            <p className="text-center text-muted-foreground">
              {stepMessages[step]}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
