import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

const PartnerProfile = () => {
  const { partner } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverEmail: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      toast.success("Invitation sent!", {
        description: `An invitation has been sent to ${email}`,
      });
      setOpen(false);
      setEmail("");
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to send invitation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!partner) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Invite Partner</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Partner</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2" onSubmit={handleInvite}>
            <Label htmlFor="email">Partner&apos;s email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="mylove@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Invite"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Avatar>
      <AvatarImage src={partner.picture || undefined} />
      <AvatarFallback>{partner.name?.[0] || "?"}</AvatarFallback>
    </Avatar>
  );
};

export default PartnerProfile;
