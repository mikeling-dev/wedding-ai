"use client";

// import { Wedding } from "@/types/wedding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, ClipboardList, Sparkles } from "lucide-react";
import { useWeddings } from "@/lib/hooks/useWeddings";

export function WeddingList() {
  const { weddings, loading, error } = useWeddings();

  if (loading) {
    return (
      <div className="w-full py-8 px-12">
        <h2 className="text-2xl font-semibold mb-4">Your Weddings</h2>
        <div className="space-y-4">
          <Card className="w-full animate-pulse">
            <CardContent className="h-32" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <h2 className="text-2xl font-semibold mb-4">Your Weddings</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (weddings.length === 0) {
    return (
      <div className="w-full py-8 px-12">
        <h2 className="text-2xl font-semibold mb-4">Your Weddings</h2>
        <Card>
          <CardContent className="py-4">
            <p className="text-muted-foreground text-center">
              You haven&apos;t created any wedding plans yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-12">
      <h2 className="text-2xl font-semibold mb-4">Your Weddings</h2>
      <div className="space-y-4">
        {weddings.map((wedding) => (
          <Card key={wedding.id}>
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">
                    {wedding.partner1Name} & {wedding.partner2Name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(wedding.date), "PPP")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      {wedding.theme}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button className="flex-1 md:flex-none" variant="outline">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Tasks
                  </Button>
                  <Button className="flex-1 md:flex-none">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
