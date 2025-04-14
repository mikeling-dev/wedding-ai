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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface IState {
  name: string;
  isoCode: string;
  countryCode: string;
}

interface ICountry {
  name: string;
  isoCode: string;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  categories: z
    .array(z.nativeEnum(Category))
    .min(1, "Select at least one category"),
  description: z.string().min(50, "Description must be at least 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function VendorInterestForm() {
  const [states, setStates] = useState<IState[]>([]);
  const countries = Country.getAllCountries() as ICountry[];
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      phoneNumber: "",
      country: "",
      state: "",
      categories: [],
      description: "",
    },
  });

  const selectedCountry = form.watch("country");

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(
        selectedCountry
      ) as IState[];
      setStates(countryStates);
      if (form.getValues("state")) {
        form.setValue("state", "");
      }
    }
  }, [selectedCountry, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // TODO: Implement API call
      console.log(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" type="email" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your phone number"
                    type="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country</FormLabel>
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCountry}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? countries.find(
                              (country) => country.isoCode === field.value
                            )?.name
                          : "Select country..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {countries.map((country) => (
                          <CommandItem
                            key={country.isoCode}
                            value={country.isoCode}
                            onSelect={() => {
                              form.setValue("country", country.isoCode);
                              setOpenCountry(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === country.isoCode
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>State (Optional)</FormLabel>
                <Popover open={openState} onOpenChange={setOpenState}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openState}
                        className="w-full justify-between"
                        disabled={!selectedCountry}
                      >
                        {field.value
                          ? states.find(
                              (state) => state.isoCode === field.value
                            )?.name
                          : "Select state..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search state..." />
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {states.map((state) => (
                          <CommandItem
                            key={state.isoCode}
                            value={state.isoCode}
                            onSelect={() => {
                              form.setValue("state", state.isoCode);
                              setOpenState(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === state.isoCode
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {state.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Service Categories</FormLabel>
              <Popover open={openCategories} onOpenChange={setOpenCategories}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCategories}
                      className="w-full justify-between"
                    >
                      {field.value.length > 0
                        ? `${field.value.length} categories selected`
                        : "Select categories..."}
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {Object.values(Category).map((category) => (
                        <CommandItem
                          key={category}
                          value={category}
                          onSelect={() => {
                            const currentCategories = field.value;
                            const updatedCategories =
                              currentCategories.includes(category)
                                ? currentCategories.filter(
                                    (c) => c !== category
                                  )
                                : [...currentCategories, category];
                            form.setValue("categories", updatedCategories);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(category)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.replace(/_/g, " ")}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your services and experience..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
