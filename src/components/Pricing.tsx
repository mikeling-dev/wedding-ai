"use client";

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
  buttonText: string;
  onSubscribe: () => void;
  popular?: boolean;
}

const PricingTier = ({
  name,
  price,
  description,
  features,
  buttonText,
  onSubscribe,
  popular,
}: PricingTierProps) => {
  return (
    <Card
      className={`w-[300px] md:w-full h-full ${
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
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && (
            <span className="text-muted-foreground ml-1">/month</span>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2 h-full">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <div>
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
        >
          {buttonText}
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
    { text: "Generate or regenerate up to 3 times", included: true },
    { text: "Generate plan with basic input preferences", included: true },
    { text: "Uses GPT-4o-mini model for simpler planning", included: true },
    { text: "Maximum 15 tasks in todo list", included: true },
    { text: "Access to marketplace (coming soon)", included: true },
    { text: "Religion & cultural background preferences", included: false },
    { text: "Special requests in plan generation", included: false },
    { text: "Up to 30 tasks in todo lists", included: false },
    { text: "Guestlist management feature", included: false },
  ];

  const premiumFeatures = [
    { text: "Generate or regenerate up to 10 times", included: true },
    { text: "Generate plan with basic input preferences", included: true },
    { text: "Uses GPT-4o for more intelligent planning", included: true },
    { text: "Maximum 30 tasks in todo list", included: true },
    { text: "Access to marketplace (coming soon)", included: true },
    { text: "Religion & cultural background preferences", included: true },
    { text: "Special requests in plan generation", included: true },
    { text: "Up to 30 tasks in todo lists", included: true },
    { text: "Guestlist management feature", included: true },
    {
      text: "Partner have access to all your premium features too",
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
          buttonText="Get Started"
          onSubscribe={handleSubscribe}
        />
      </div>
      <div className="snap-center shrink-0">
        <PricingTier
          name="Premium"
          price="$4"
          description="For couples who want the full planning experience"
          features={premiumFeatures}
          buttonText="Subscribe"
          onSubscribe={handleSubscribe}
          popular={true}
        />
      </div>
    </div>
  );
}
