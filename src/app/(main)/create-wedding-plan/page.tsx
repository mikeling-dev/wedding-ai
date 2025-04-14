"use client";

import FormCard from "@/components/create-wedding-plan/formCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateWeddingPlan() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  return (
    <div className="p-6 md:p-12">
      <Link href="/">
        <Button variant="ghost">
          <ArrowLeft /> Home
        </Button>
      </Link>
      <div className="w-full flex flex-col items-center gap-4 mt-2 text-center">
        <h1 className="w-fit text-2xl font-bold">Create your wedding plan</h1>
        <p>
          Tell us about your wedding and let our AI assistant help you plan your
          special day.
        </p>
        <FormCard />
      </div>
    </div>
  );
}
