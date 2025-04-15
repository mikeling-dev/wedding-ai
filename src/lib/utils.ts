import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a TaskCategory enum value into a human-readable string
 * e.g., DECOR_AND_FLOWERS -> Decor And Flowers
 */
export function formatTaskCategory(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

type UserWithSubscription = {
  subscription: "BASIC" | "PREMIUM";
  generatedCount: number;
};

export function checkTierForPlanGeneration(user: UserWithSubscription) {
  const maxGenerations = user.subscription === "PREMIUM" ? 10 : 3;
  const hasReachedLimit = user.generatedCount >= maxGenerations;

  return {
    maxGenerations,
    hasReachedLimit,
    remainingGenerations: Math.max(0, maxGenerations - user.generatedCount),
    errorMessage: hasReachedLimit
      ? `You have reached your plan generation limit (${maxGenerations} plans). Please upgrade to ${
          user.subscription === "BASIC" ? "Premium" : "contact support"
        } for more generations.`
      : null,
  };
}
