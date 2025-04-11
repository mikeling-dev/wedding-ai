"use client";
import { Card } from "@/components/ui/card";
import FormStep1 from "./form-step1";
import FormStep2 from "./form-step2";
import FormStep3 from "./form-step3";
import FormStep4 from "./form-step4";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FormCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const formSteps = [
    { id: 1, form: FormStep1, description: "Couple Details" },
    { id: 2, form: FormStep2, description: "Wedding Details" },
    { id: 3, form: FormStep3, description: "Preferences" },
    { id: 4, form: FormStep4, description: "Summary" },
  ];

  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("form submitted");
    }
  };
  return (
    <Card className="w-full p-4 md:p-8 items-center flex flex-col">
      <div className="grid grid-cols-4 w-full gap-2">
        {formSteps.map((form) => {
          return (
            <div
              key={form.id}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`rounded-full bg-${
                  form.id === currentStep ? "primary" : "secondary"
                } h-10 w-10 flex items-center justify-center`}
              >
                {form.id}
              </div>
              <p className="text-sm">{form.description}</p>
            </div>
          );
        })}
      </div>
      {currentStep === 1 && <FormStep1 />}
      {currentStep === 2 && <FormStep2 />}
      {currentStep === 3 && <FormStep3 />}
      {currentStep === 4 && <FormStep4 />}
      <div className="flex flex-row justify-between w-full">
        <Button
          variant="secondary"
          disabled={currentStep <= 1}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <ArrowLeft /> Back
        </Button>

        {currentStep < formSteps.length ? (
          // <span className="flex flex-row items-center justify-center">
          <Button onClick={handleNext}>
            Next <ArrowRight />
          </Button>
        ) : (
          //  </span>
          <Button onClick={handleNext}>Generate</Button>
        )}
      </div>
    </Card>
  );
};

export default FormCard;
