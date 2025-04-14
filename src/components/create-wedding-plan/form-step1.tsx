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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const formSchema = z.object({
  partner1Name: z
    .string()
    .min(2, "Partner 1 name must be at least 2 characters"),
  partner2Name: z
    .string()
    .min(2, "Partner 2 name must be at least 2 characters"),
  culturalBackground: z.enum([
    "Western",
    "Chinese",
    "Indian",
    "Arab",
    "African",
    "Latin American",
    "Japanese",
    "Korean",
    "Malay",
    "Others",
    "",
  ]),
  religion: z.enum([
    "Christians",
    "Bhuddists",
    "Muslims",
    "Hindus",
    "Others",
    "Religionless",
    "",
  ]),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
});

type FormStep1Values = z.infer<typeof formSchema>;

interface FormStep1Props {
  onSubmit: (data: FormStep1Values) => void;
  onNext: () => void;
  defaultValues?: Partial<FormStep1Values>;
}

export default function FormStep1({
  onSubmit,
  onNext,
  defaultValues,
}: FormStep1Props) {
  const { user } = useAuth();
  const form = useForm<FormStep1Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partner1Name: defaultValues?.partner1Name || "",
      partner2Name: defaultValues?.partner2Name || "",
      culturalBackground: defaultValues?.culturalBackground || "",
      religion: defaultValues?.religion || "",
      email: defaultValues?.email || user?.email || "",
      phoneNumber: defaultValues?.phoneNumber || "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    onNext();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full space-y-6 py-6">
        <div className="grid grid-cols-2 gap-4 w-full">
          <FormField
            control={form.control}
            name="partner1Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner 1 Name</FormLabel>
                <FormControl>
                  <Input placeholder="Alice" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partner2Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner 2 Name</FormLabel>
                <FormControl>
                  <Input placeholder="Bob" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <FormField
            control={form.control}
            name="culturalBackground"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cultural Background</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full overflow-x-hidden">
                      <SelectValue placeholder="Select cultural background" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Western">Western</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Arab">Arab</SelectItem>
                    <SelectItem value="African">African</SelectItem>
                    <SelectItem value="Latin American">
                      Latin American
                    </SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Malay">Malay</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Christians">Christians</SelectItem>
                    <SelectItem value="Bhuddists">Bhuddists</SelectItem>
                    <SelectItem value="Muslims">Muslims</SelectItem>
                    <SelectItem value="Hindus">Hindus</SelectItem>
                    <SelectItem value="Religionless">Religionless</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={field.value}
                    onChange={(value) => field.onChange(value || "")}
                    className="flex h-9 w-full [&>input]:focus:outline-none rounded-md border px-3 py-2 text-sm shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit">
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
