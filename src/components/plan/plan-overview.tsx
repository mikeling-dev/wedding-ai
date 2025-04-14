import { Wedding } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Wallet } from "lucide-react";
import { Country } from "country-state-city";

interface PlanOverviewProps {
  overview: string;
  wedding: Wedding;
}

export function PlanOverview({ overview, wedding }: PlanOverviewProps) {
  const countryData = Country.getCountryByCode(wedding.country || "");
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: countryData?.currency || "USD",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose dark:prose-invert">
          <p>{overview}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="flex flex-col items-center gap-2 text-center">
            <Calendar className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">Wedding Date</p>
            <p className="text-sm text-muted-foreground">
              {wedding.date ? format(new Date(wedding.date), "PPP") : "Not set"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">
              {wedding.state}, {wedding.country}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">Guest Count</p>
            <p className="text-sm text-muted-foreground">
              {wedding.guestCount}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <Wallet className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">Budget</p>
            <p className="text-sm text-muted-foreground">
              {formatter.format(wedding.budget || 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
