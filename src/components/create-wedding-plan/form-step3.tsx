"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

const themes = [
  "Traditional",
  "Garden/Outdoor",
  "Beach",
  "Bohemian",
  "Glamorous",
  "Rustic",
  "Vintage",
  "Modern",
  "Minimalist",
] as const;

const formSchema = z.object({
  theme: z.enum(themes),
  specialRequests: z.string().optional(),
});

type FormStep3Values = z.infer<typeof formSchema>;

interface FormStep3Props {
  onSubmit: (data: FormStep3Values) => void;
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<FormStep3Values>;
}

export default function FormStep3({
  onSubmit,
  onNext,
  onBack,
  defaultValues,
}: FormStep3Props) {
  const { user } = useAuth();
  const isPremium = user?.subscription === "PREMIUM";

  const form = useForm<FormStep3Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: defaultValues?.theme || "Traditional",
      specialRequests: defaultValues?.specialRequests || "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    onNext();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full space-y-6 py-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem className={cn(!isPremium && "opacity-50")}>
              <FormLabel className="flex items-center gap-2">
                Special Requests
                {!isPremium && <Lock className="h-4 w-4" />}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about any other preferences, special requests, or important details about your wedding vision (e.g., preferred venue type like hotel ballroom, beachfront, etc.)"
                  className="resize-none"
                  disabled={!isPremium}
                  {...field}
                />
              </FormControl>
              {!isPremium && (
                <FormDescription>
                  Upgrade to Premium to add special requests and customizations
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button type="submit">
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
