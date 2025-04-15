"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Check } from "lucide-react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  onSubscribe: () => void;
  popular?: boolean;
}

const PricingTier = ({
  name,
  price,
  description,
  features,
  onSubscribe,
  popular,
}: PricingTierProps) => {
  const { user } = useAuth();

  return (
    <Card
      className={`w-[280px] sm:w-[300px] md:w-full md:min-w-[400px] h-full ${
        popular ? "border-primary shadow-lg" : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {name}
          {popular && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </CardTitle>
        <div className="flex flex-col items-baseline">
          <span className="text-3xl font-bold">
            {price}{" "}
            {price !== "Free" && (
              <span className="line-through text-muted-foreground">$20</span>
            )}
          </span>
          {price !== "Free" && (
            <p className="text-muted-foreground text-sm border py-2 px-4 text-center rounded-lg mt-1">
              <span className="font-semibold">
                One-off payment, life time access
              </span>
              . 50% off until marketplace launches.
            </p>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2 h-full">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-2">
              <div className="pt-1">
                <Check
                  className={`h-4 w-4 ${
                    feature.included ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-wrap ${
                  feature.included ? "" : "text-muted-foreground line-through"
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${name === "Basic" && "hidden"}`}
          variant={popular ? "default" : "outline"}
          onClick={onSubscribe}
          disabled={user?.subscription === "PREMIUM"}
        >
          {user?.subscription === "BASIC" ? "Upgrade" : "Upgraded"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Pricing() {
  const handleSubscribe = () => {
    console.log("subscribed");
  };

  const basicFeatures = [
    { text: "Generate plans for up to 3 times", included: true },
    { text: "Generate plan with basic preferences input", included: true },
    { text: "Uses GPT-4o-mini model for simpler planning", included: true },
    { text: "ToDo list with up to 20 tasks", included: true },
    { text: "Wedding marketplace (WIP)", included: true },
    // { text: "Religion & cultural background preferences", included: false },
    // { text: "Special requests in plan generation", included: false },
    // { text: "Up to 30 tasks in todo lists", included: false },
    // { text: "Guestlist management feature", included: false },
  ];

  const premiumFeatures = [
    { text: "Generate plans for up to 10 times", included: true },
    {
      text: "Generate plan with advanced preferences input",
      included: true,
    },
    { text: "Uses GPT-4o for intelligent planning", included: true },
    { text: "ToDo list with no limit", included: true },
    { text: "Wedding marketplace (WIP)", included: true },
    { text: "Religion & cultural background preferences", included: true },
    { text: "Special requests in plan generation", included: true },
    { text: "Guestlist management (WIP)", included: true },
    {
      text: "Premium perks shared with partner",
      included: true,
    },
  ];

  return (
    <div className="grid grid-flow-col gap-4 overflow-x-auto pb-6 snap-x snap-mandatory">
      <div className="snap-center h-full ">
        <PricingTier
          name="Basic"
          price="Free"
          description="Perfect for getting started with AI wedding planning"
          features={basicFeatures}
          onSubscribe={handleSubscribe}
        />
      </div>
      <div className="snap-center shrink-0">
        <PricingTier
          name="Premium"
          price="$10"
          description="For couples who want the full planning experience"
          features={premiumFeatures}
          onSubscribe={handleSubscribe}
          popular={true}
        />
      </div>
    </div>
  );
}
