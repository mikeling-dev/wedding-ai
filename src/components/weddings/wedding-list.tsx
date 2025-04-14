"use client";

// import { Wedding } from "@/types/wedding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Calendar,
  ClipboardList,
  FerrisWheel,
  Sparkles,
  Trash,
} from "lucide-react";
import { useWeddings } from "@/lib/hooks/useWeddings";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import Link from "next/link";

export function WeddingList() {
  const { weddings, loading, error, mutate } = useWeddings();
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(
    null
  );

  const handleDeleteWedding = async (weddingId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/wedding/${weddingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete wedding");
      }

      toast.success("Wedding deleted successfully");
      mutate();
    } catch (error) {
      console.error("Error deleting wedding:", error);
      toast.error("Failed to delete wedding");
    } finally {
      setIsDeleting(false);
      setSelectedWeddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-8 px-6 md:px-12">
        <h2 className="text-2xl font-semibold mb-4">Your Wedding Plans</h2>
        <div className="space-y-4">
          <Card className="w-full animate-pulse">
            <CardContent className="h-32 flex justify-center items-center">
              <Spinner /> Loading...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) return;

  if (error) {
    return (
      <div className="w-full py-8 px-6 md:px-12">
        <h2 className="text-2xl font-semibold mb-4">Your Wedding Plans</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (weddings.length === 0) {
    return (
      <div className="w-full py-8 px-6 md:px-12">
        <div className="w-full flex flex-row justify-between">
          <h2 className="text-2xl font-semibold mb-4">Your Wedding Plans</h2>
          <Link href="/create-wedding-plan">
            <Button>Create plan</Button>
          </Link>
        </div>
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
    <div className="w-full py-8 px-6 md:px-12">
      <h2 className="text-2xl font-semibold mb-4">{`Your Wedding Plans (${weddings.length})`}</h2>
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
        {weddings.map((wedding) => (
          <Card key={wedding.id} className="w-full">
            <CardContent className="py-4">
              <div className="flex flex-col justify-between items-start gap-4">
                <div className="flex flex-row justify-between w-full">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">
                      {wedding.partner1Name} & {wedding.partner2Name}
                    </h3>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(wedding.date), "PPP")}
                      </div>
                      <div className="flex items-center gap-1">
                        <FerrisWheel className="h-4 w-4" />
                        {wedding.theme}
                      </div>
                    </div>
                  </div>
                  <Dialog
                    open={selectedWeddingId === wedding.id}
                    onOpenChange={(open) => !open && setSelectedWeddingId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedWeddingId(wedding.id)}
                      >
                        <Trash />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete wedding</DialogTitle>
                        <DialogDescription>
                          All information related to this wedding will be
                          permanently deleted.
                        </DialogDescription>
                        <div className="flex flex-row gap-2 mt-2 w-full">
                          <Button
                            className="flex-1"
                            variant="destructive"
                            onClick={() =>
                              wedding.id && handleDeleteWedding(wedding.id)
                            }
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete wedding"}
                          </Button>
                          <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => setSelectedWeddingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => router.push(`/wedding/${wedding.id}/tasks`)}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Tasks
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => router.push(`/wedding/${wedding.id}/plan`)}
                  >
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
