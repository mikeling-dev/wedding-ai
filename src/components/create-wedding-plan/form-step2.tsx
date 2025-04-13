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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface IState {
  name: string;
  isoCode: string;
  countryCode: string;
}

interface ICountry {
  name: string;
  isoCode: string;
  currency?: string;
}

const formSchema = z.object({
  weddingDate: z.date({
    required_error: "Wedding date is required",
  }),
  country: z.string().optional(),
  state: z.string().optional(),
  budget: z.number().min(1, "Budget must be greater than 0"),
  guestCount: z.number().min(1, "Guest count must be at least 1"),
});

type FormStep2Values = z.infer<typeof formSchema>;

interface FormStep2Props {
  onSubmit: (data: FormStep2Values) => void;
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<FormStep2Values>;
}

export default function FormStep2({
  onSubmit,
  onNext,
  onBack,
  defaultValues,
}: FormStep2Props) {
  const [states, setStates] = useState<IState[]>([]);
  const countries = Country.getAllCountries() as ICountry[];
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);

  const form = useForm<FormStep2Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weddingDate: defaultValues?.weddingDate || new Date(),
      country: defaultValues?.country || "",
      state: defaultValues?.state || "",
      budget: defaultValues?.budget || 0,
      guestCount: defaultValues?.guestCount || 0,
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

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    onNext();
  });

  const getCurrencySymbol = (countryCode: string | undefined) => {
    try {
      if (!countryCode) return "USD";
      const country = countries.find(
        (c: ICountry) => c.isoCode === countryCode
      );
      if (!country?.currency) return "USD";
      return country.currency;
    } catch {
      return "USD";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full space-y-6 py-6">
        <FormField
          control={form.control}
          name="weddingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Wedding Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country (Optional)</FormLabel>
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCountry}
                        className="w-full justify-between"
                      >
                        {field.value && field.value.length > 0
                          ? countries.find(
                              (country) => country.isoCode === field.value
                            )?.name
                          : "Select country..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command className="max-h-[300px] overflow-auto">
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="overflow-auto">
                        {countries.map((country) => (
                          <CommandItem
                            key={country.isoCode}
                            value={country.name}
                            onSelect={() => {
                              form.setValue("country", country.isoCode);
                              setOpenCountry(false);
                            }}
                          >
                            {country.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                field.value === country.isoCode
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
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
                        {field.value && field.value.length > 0
                          ? field.value
                          : "Select state..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command className="max-h-[300px] overflow-auto">
                      <CommandInput
                        placeholder="Search state..."
                        className="h-9"
                      />
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup className="overflow-auto">
                        {states.map((state) => (
                          <CommandItem
                            key={state.isoCode}
                            value={state.name}
                            onSelect={() => {
                              form.setValue("state", state.name);
                              setOpenState(false);
                            }}
                          >
                            {state.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                field.value === state.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
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
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <div className="flex flex-row border px-3 py-1 shadow-sm h-9 justify-center rounded-md">
                  <span className="w-fit text-sm font-medium flex items-center">
                    {getCurrencySymbol(selectedCountry)}
                  </span>
                  <Input
                    type="number"
                    className="pl-2 border-none h-full focus-visible:ring-0 focus-visible:border-none shadow-none"
                    placeholder="Enter budget"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guestCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter expected number of guests"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
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
