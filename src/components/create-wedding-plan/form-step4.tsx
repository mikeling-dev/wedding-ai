"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Country, State } from "country-state-city";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
}

export default function FormStep4({
  formData,
  onSubmit,
  onBack,
}: FormStep4Props) {
  const country = Country.getCountryByCode(formData.country);
  const state = State.getStateByCodeAndCountry(
    formData.state,
    formData.country
  );

  console.log("Wedding date value:", formData.weddingDate);

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: country?.currency || "USD",
  });

  return (
    <div className="w-full space-y-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Couple Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Partner 1</p>
              <p className="text-sm text-muted-foreground">
                {formData.partner1Name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Partner 2</p>
              <p className="text-sm text-muted-foreground">
                {formData.partner2Name}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Cultural Background</p>
              <p className="text-sm text-muted-foreground">
                {formData.culturalBackground}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Religion</p>
              <p className="text-sm text-muted-foreground">
                {formData.religion}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
            {formData.phoneNumber && (
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">
                  {formData.phoneNumber}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Wedding Date</p>
              <p className="text-sm text-muted-foreground">
                {formData.weddingDate instanceof Date &&
                !isNaN(formData.weddingDate.getTime())
                  ? format(formData.weddingDate, "PPP")
                  : "Date not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">
                {state?.name}, {country?.name}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Budget</p>
              <p className="text-sm text-muted-foreground">
                {formatter.format(formData.budget)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Guest Count</p>
              <p className="text-sm text-muted-foreground">
                {formData.guestCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">{formData.theme}</p>
          </div>
          {formData.specialRequests && (
            <div>
              <p className="text-sm font-medium">Special Requests</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {formData.specialRequests}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <Button onClick={onSubmit}>Submit Plan</Button>
      </div>
    </div>
  );
}
