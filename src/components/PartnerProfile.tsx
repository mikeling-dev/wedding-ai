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
import { Spinner } from "./ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setLoading } from "@/store/slices/loadingSlice";
import { clearPartner } from "@/store/slices/partnerSlice";

const PartnerProfile = () => {
  const { partner } = useAuth();
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: RootState) => state.loading["invitation/handle"] || false
  );
  const [inviteOpen, setInviteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingUnlink, setPendingUnlink] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading({ key: "invitation/handle", isLoading: true }));

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
      setInviteOpen(false);
      setEmail("");
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to send invitation",
      });
    } finally {
      dispatch(setLoading({ key: "invitation/handle", isLoading: false }));
    }
  };

  const handleUnlink = async () => {
    dispatch(setLoading({ key: "partner/unlink", isLoading: true }));
    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      dispatch(clearPartner());
      setProfileOpen(false);
      setPendingUnlink(false);

      toast.success("Unlink completed", {
        description: "You have unlinked your partner.",
      });
    } catch (error) {
      toast.error("Unlink failed", {
        description:
          error instanceof Error ? error.message : "Failed to unlink partner",
      });
    } finally {
      dispatch(setLoading({ key: "partner/unlink", isLoading: false }));
    }
  };

  if (!partner) {
    return (
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
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
              {isLoading ? (
                <span className="flex flex-row gap-2 items-center">
                  <Spinner /> Inviting
                </span>
              ) : (
                "Invite"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogTrigger asChild>
        <Avatar>
          <AvatarImage src={partner.picture || undefined} />
          <AvatarFallback>{partner.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partner Information</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            Name: <span>{partner.name}</span>
          </p>
          <p>
            Email: <span>{partner.email}</span>
          </p>
        </div>
        {!pendingUnlink ? (
          <Button variant="default" onClick={() => setPendingUnlink(true)}>
            Unlink Partner
          </Button>
        ) : (
          <div className="grid grid-cols-2 w-full gap-2">
            <Button
              variant="destructive"
              onClick={handleUnlink}
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              Confirm Unlink
            </Button>
            <Button
              variant="outline"
              onClick={() => setPendingUnlink(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PartnerProfile;
