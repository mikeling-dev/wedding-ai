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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
  description: z.string().min(30, "Description must be at least 30 characters"),
});

type FormValues = z.infer<typeof formSchema>;

// Add this CSS at the top level of your component
const phoneInputStyles = {
  "--PhoneInputCountry": {
    marginRight: "8px",
    alignItems: "center",
  },
  "--PhoneInput-flagHeight": "16px !important",
  "--PhoneInputCountryFlag-height": "16px !important",
  "--PhoneInputCountryFlag-width": "24px !important",
  "--PhoneInputCountrySelect-marginRight": "0.5rem",
  "--PhoneInputCountrySelectArrow-width": "8px",
  "--PhoneInputCountrySelectArrow-marginLeft": "8px",
} as React.CSSProperties;

export default function VendorInterestForm() {
  const [states, setStates] = useState<IState[]>([]);
  const [stateMap, setStateMap] = useState<Record<string, string>>({}); // Map isoCode to name
  const countries = Country.getAllCountries() as ICountry[];
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [filteredStates, setFilteredStates] = useState<IState[]>([]);

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
      setFilteredStates(countryStates);

      // Create a map of isoCode to state name
      const stateNameMap = countryStates.reduce((acc, state) => {
        acc[state.isoCode] = state.name;
        return acc;
      }, {} as Record<string, string>);
      setStateMap(stateNameMap);

      if (form.getValues("state")) {
        form.setValue("state", "");
      }
    }
  }, [selectedCountry, form]);

  const handleCountrySearch = (value: string) => {
    const searchTerm = value.toLowerCase();
    const filtered = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm) ||
        country.isoCode.toLowerCase().includes(searchTerm)
    );
    setFilteredCountries(filtered);
  };

  const handleStateSearch = (value: string) => {
    const searchTerm = value.toLowerCase();
    const filtered = states.filter(
      (state) =>
        state.name.toLowerCase().includes(searchTerm) ||
        state.isoCode.toLowerCase().includes(searchTerm)
    );
    setFilteredStates(filtered);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Convert state isoCode to name before submitting
      const formData = {
        ...data,
        country:
          countries.find((c) => c.isoCode === data.country)?.name ||
          data.country,
        state: data.state ? stateMap[data.state] || data.state : undefined,
      };
      console.log(formData);
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
                  <div className="relative">
                    <PhoneInput
                      international
                      defaultCountry="US"
                      value={field.value}
                      onChange={(value) => field.onChange(value || "")}
                      className="flex h-9 w-full [&>input]:focus:outline-none rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      style={phoneInputStyles}
                    />
                  </div>
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
                      <CommandInput
                        placeholder="Search country..."
                        onValueChange={handleCountrySearch}
                      />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {filteredCountries.map((country) => (
                          <CommandItem
                            key={country.isoCode}
                            value={country.name}
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
                          ? stateMap[field.value] || "Select state..."
                          : "Select state..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search state..."
                        onValueChange={handleStateSearch}
                      />
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {filteredStates.map((state) => (
                          <CommandItem
                            key={state.isoCode}
                            value={state.name}
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
            <FormItem>
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
                  placeholder="Tell us about your services and experience, attach your website url if applicable..."
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
