import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Country } from "country-state-city";

interface BudgetItem {
  category: string;
  percentage: number;
  amount: number;
}

interface PlanBudgetProps {
  budget: BudgetItem[];
  totalBudget: number;
  country: string;
}

export function PlanBudget({ budget, totalBudget, country }: PlanBudgetProps) {
  const countryData = Country.getCountryByCode(country);
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: countryData?.currency || "USD",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budget.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.category}</span>
                <span className="text-muted-foreground">
                  {formatter.format(item.amount)} ({item.percentage}%)
                </span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between font-medium">
              <span>Total Budget</span>
              <span>{formatter.format(totalBudget)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
