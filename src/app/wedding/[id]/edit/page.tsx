"use client";

import { useEffect, useState } from "react";
import FormCard from "@/components/create-wedding-plan/formCard";
import { useParams } from "next/navigation";
import { Wedding } from "@/types/wedding";

export default function EditWeddingPage() {
  const params = useParams();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [params.id]);

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
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Wedding Plan</h1>
      <FormCard weddingId={params.id as string} defaultValues={defaultValues} />
    </div>
  );
}
