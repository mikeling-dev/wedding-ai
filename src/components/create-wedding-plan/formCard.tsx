"use client";
import { Card } from "@/components/ui/card";
import FormStep1 from "./form-step1";
import FormStep2 from "./form-step2";
import FormStep3 from "./form-step3";
import FormStep4 from "./form-step4";
import { useState } from "react";

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

interface FormCardProps {
  weddingId?: string;
  defaultValues?: Partial<FormData>;
}

const FormCard = ({ weddingId, defaultValues }: FormCardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>(
    defaultValues || {}
  );

  const formSteps = [
    { id: 1, form: FormStep1, description: "Couple Details" },
    { id: 2, form: FormStep2, description: "Wedding Details" },
    { id: 3, form: FormStep3, description: "Preferences" },
    { id: 4, form: FormStep4, description: "Summary" },
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = (stepData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleFinalSubmit = () => {
    // This will be called after the API call is successful
    // You might want to redirect the user or show a success message
    console.log("Form submitted successfully");
  };

  return (
    <Card className="w-full p-4 md:p-8 items-center flex flex-col">
      <div className="grid grid-cols-4 w-full gap-2">
        {formSteps.map((form) => {
          return (
            <div
              key={form.id}
              className="flex flex-col items-center text-center gap-2"
            >
              <div
                className={`rounded-full bg-${
                  form.id === currentStep
                    ? "primary"
                    : currentStep > form.id
                    ? "accent"
                    : "secondary"
                } h-10 w-10 flex items-center justify-center text-${
                  currentStep > form.id ? "muted-foreground" : "foreground"
                }`}
              >
                {form.id}
              </div>
              <p className="text-sm text-foreground">{form.description}</p>
            </div>
          );
        })}
      </div>
      {currentStep === 1 && (
        <FormStep1
          onSubmit={handleFormSubmit}
          onNext={handleNext}
          defaultValues={{
            ...(formData.partner1Name && {
              partner1Name: formData.partner1Name,
            }),
            ...(formData.partner2Name && {
              partner2Name: formData.partner2Name,
            }),
            ...(formData.culturalBackground && {
              culturalBackground: formData.culturalBackground as
                | "Western"
                | "Chinese"
                | "Indian"
                | "Arab"
                | "African"
                | "Latin American"
                | "Japanese"
                | "Korean"
                | "Malay"
                | "Others",
            }),
            ...(formData.religion && {
              religion: formData.religion as
                | "Christians"
                | "Bhuddists"
                | "Muslims"
                | "Hindus"
                | "Others"
                | "Religionless",
            }),
            ...(formData.email && { email: formData.email }),
            ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
          }}
        />
      )}
      {currentStep === 2 && (
        <FormStep2
          onSubmit={handleFormSubmit}
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={{
            ...(formData.weddingDate && { weddingDate: formData.weddingDate }),
            ...(formData.country && { country: formData.country }),
            ...(formData.state && { state: formData.state }),
            ...(formData.budget && { budget: formData.budget }),
            ...(formData.guestCount && { guestCount: formData.guestCount }),
          }}
        />
      )}
      {currentStep === 3 && (
        <FormStep3
          onSubmit={handleFormSubmit}
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={{
            ...(formData.theme && {
              theme: formData.theme as
                | "Traditional"
                | "Garden/Outdoor"
                | "Beach"
                | "Bohemian"
                | "Glamorous"
                | "Rustic"
                | "Vintage"
                | "Modern"
                | "Minimalist",
            }),
            ...(formData.specialRequests && {
              specialRequests: formData.specialRequests,
            }),
          }}
        />
      )}
      {currentStep === 4 && (
        <FormStep4
          formData={formData as FormData}
          onSubmit={handleFinalSubmit}
          onBack={handleBack}
          weddingId={weddingId}
        />
      )}
    </Card>
  );
};

export default FormCard;
