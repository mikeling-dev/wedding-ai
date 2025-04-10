"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const StartPlanningBtn = () => {
  const { user } = useAuth();
  const router = useRouter();
  const handleStartPlanning = () => {
    if (user) {
      router.push("/create-wedding-plan");
    } else {
      router.push("/auth");
    }
  };
  return <Button onClick={handleStartPlanning}>Start Planning</Button>;
};
export default StartPlanningBtn;
