"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Country } from "country-state-city";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Wallet,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import {
  PlanGenerationLoading,
  type GenerationStep,
} from "../loading/PlanGenerationLoading";

interface FormData {
  // Step 1
  partner1Name: string;
  partner2Name: string;
  culturalBackground: string;
  religion: string;
  email: string;
  phoneNumber?: string;

  // Step 2
  weddingDate: Date;
  country: string;
  state: string;
  budget: number;
  guestCount: number;

  // Step 3
  theme: string;
  specialRequests?: string;
}

interface FormStep4Props {
  formData: FormData;
  onSubmit: () => void;
  onBack: () => void;
  weddingId?: string;
}

export default function FormStep4({
  formData,
  onSubmit,
  onBack,
  weddingId,
}: FormStep4Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationStep, setGenerationStep] =
    useState<GenerationStep>("analyzing");
  const router = useRouter();
  const country = Country.getCountryByCode(formData.country);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGenerationStep("analyzing");

      // First, save or update the wedding details
      const weddingResponse = await fetch("/api/wedding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          weddingId,
        }),
      });

      if (!weddingResponse.ok) {
        throw new Error("Failed to submit wedding details");
      }

      const weddingData = await weddingResponse.json();

      // Then, generate the AI plan
      setGenerationStep("generating");
      const planResponse = await fetch("/api/wedding/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          weddingId: weddingData.id || weddingId,
        }),
      });

      if (!planResponse.ok) {
        throw new Error("Failed to generate wedding plan");
      }

      // Call onSubmit to complete the form submission
      onSubmit();

      // Show success message
      toast.success("Wedding plan generated successfully!");

      // Set redirecting state before navigation
      setGenerationStep("redirecting");

      // Redirect to the plan page
      router.push(`/wedding/${weddingData.id}/plan`);
    } catch (error) {
      console.error("Error submitting wedding details:", error);
      toast.error("Failed to generate wedding plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: country?.currency || "USD",
  });

  return (
    <>
      <div className="w-full space-y-6 py-6 ">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-primary">
            Generate your wedding plan
          </h2>
          <p className="text-muted-foreground">
            Please review your wedding details below. Our AI assistant will use
            this information to generate a personalized wedding plan for you.
          </p>
        </div>

        <Card className="">
          <CardHeader>
            <CardTitle className="text-center">Wedding Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-center">
            <div className="space-y-4">
              <div>
                <p className="font-medium">The Couple</p>
                <p className="text-sm text-muted-foreground">
                  {formData.partner1Name} & {formData.partner2Name}
                </p>
              </div>

              <div>
                <p className="font-medium">Contact Information</p>
                <p className="text-sm text-muted-foreground">
                  Email: {formData.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone Number:{" "}
                  {formData.phoneNumber ? formData.phoneNumber : "Not provided"}
                </p>
              </div>

              <div>
                <p className="font-medium">Cultural & Religious Background</p>
                <p className="text-sm text-muted-foreground">
                  {formData.culturalBackground} • {formData.religion}
                </p>
              </div>

              <div>
                <p className="font-medium">Wedding Details</p>
                <div className="grid grid-rows-4 md:grid-rows-1 md:grid-cols-4 text-sm gap-2 mt-4 text-muted-foreground">
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <Calendar className="lg:block h-8 w-8 lg:h-10 lg:w-10" />
                    <p>Date: </p>
                    <p className="font-semibold">
                      {formData.weddingDate instanceof Date &&
                      !isNaN(formData.weddingDate.getTime())
                        ? format(formData.weddingDate, "PPP")
                        : "Date not set"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <MapPin className="lg:block h-8 w-8 lg:h-10 lg:w-10" />
                    <p>Location:</p>
                    <p className="font-semibold">
                      {formData.state}, {formData.country}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <Wallet className="lg:block h-8 w-8 lg:h-10 lg:w-10" />
                    <p>Budget: </p>
                    <p className="font-semibold">
                      {formatter.format(formData.budget)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <Users className="lg:block h-8 w-8 lg:h-10 lg:w-10" />
                    <p>Expected Guests: </p>
                    <p className="font-semibold">{formData.guestCount}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium">Wedding Vision</p>
                <p className="text-sm text-muted-foreground">
                  Theme: {formData.theme}
                  {formData.specialRequests && (
                    <>
                      <br />
                      Special Requests: {formData.specialRequests}
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="h-fit flex flex-row gap-2 justify-center">
              <WandSparkles className="h-4 w-4" /> AI-Powered Planning
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Our AI will analyze your preferences to create a personalized
              wedding plan including budget breakdown, timeline, and categorized
              task list. This will serve as your foundation for wedding
              planning.
            </p>
          </CardHeader>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex flex-row justify-between gap-2 items-center">
                <Spinner />
                Generating...
              </div>
            ) : (
              "Generate Plan"
            )}
          </Button>
        </div>
      </div>
      <PlanGenerationLoading show={isSubmitting} step={generationStep} />
    </>
  );
}
