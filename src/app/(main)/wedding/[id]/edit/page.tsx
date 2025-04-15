"use client";

import { useEffect, useState } from "react";
import FormCard from "@/components/create-wedding-plan/formCard";
import { useParams, useRouter } from "next/navigation";
import { Wedding } from "@/types/wedding";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { checkTierForPlanGeneration } from "@/lib/utils";

export default function EditWeddingPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    const { hasReachedLimit } = checkTierForPlanGeneration(user);

    if (hasReachedLimit) {
      router.push("/upgrade-premium");
      return;
    }

    const fetchWedding = async () => {
      try {
        const response = await fetch(`/api/wedding?weddingId=${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch wedding details");
        }
        const data = await response.json();
        setWedding(data);
      } catch (error) {
        console.error("Error fetching wedding:", error);
        setError("Failed to load wedding details");
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [params.id, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!wedding) {
    return <div>Wedding not found</div>;
  }

  // Transform the wedding data to match the form structure
  const defaultValues = {
    partner1Name: wedding.partner1Name,
    partner2Name: wedding.partner2Name,
    culturalBackground: wedding.culturalBackground,
    religion: wedding.religion,
    email: wedding.email,
    phoneNumber: wedding.phoneNumber,
    weddingDate: new Date(wedding.date),
    country: wedding.country,
    state: wedding.state,
    budget: wedding.budget,
    guestCount: wedding.guestCount,
    theme: wedding.theme,
    specialRequests: wedding.specialRequests,
  };

  return (
    <div className="container mx-auto py-6 px-6 md:px-12">
      <div className="flex flex-row w-full justify-between">
        <h1 className="text-3xl font-bold mb-6">Edit Wedding Plan</h1>
        <Link href={`/wedding/${params.id}/plan`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      <FormCard weddingId={params.id as string} defaultValues={defaultValues} />
    </div>
  );
}
