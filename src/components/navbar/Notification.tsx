"use client";

import { useEffect, useRef, useState, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setPartner } from "@/store/slices/partnerSlice";
import { setLoading } from "@/store/slices/loadingSlice";
import { RootState } from "@/lib/store";
import { setWeddings } from "@/store/slices/weddingSlice";

interface Invitation {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
    picture: string | null;
  };
  status: "PENDING" | "ACCEPTED" | "DENIED";
}

const NotificationContent = memo(
  ({
    invitations,
    handleInvitation,
    isLoading,
  }: {
    invitations: Invitation[];
    handleInvitation: (id: string, action: "accept" | "reject") => void;
    isLoading: boolean;
  }) => (
    <div className="space-y-4">
      <h4 className="font-medium">Partner Invitations</h4>
      {invitations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending invitations</p>
      ) : (
        <div className="space-y-2">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between gap-2 p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={invitation.sender.picture || undefined} />
                  <AvatarFallback>
                    {invitation.sender.name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {invitation.sender.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invitation.sender.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleInvitation(invitation.id, "accept")}
                  disabled={isLoading}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInvitation(invitation.id, "reject")}
                  disabled={isLoading}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
);

NotificationContent.displayName = "NotificationContent";

const Notifications = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: RootState) => state.loading["invitation/handle"] || false
  );
  const initialFetchDone = useRef(false);
  const [open, setOpen] = useState(false);

  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const fetchInvitations = async () => {
    if (!user || initialFetchDone.current) return;

    try {
      const response = await fetch("/api/invitations", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
        initialFetchDone.current = true;
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const handleInvitation = async (
    invitationId: string,
    action: "accept" | "reject"
  ) => {
    dispatch(setLoading({ key: "invitation/handle", isLoading: true }));
    try {
      const response = await fetch(`/api/invitations/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} invitation`);
      }

      if (action === "accept") {
        const partnerResponse = await fetch("/api/partner", {
          credentials: "include",
        });
        if (partnerResponse.ok) {
          const partnerData = await partnerResponse.json();
          dispatch(setPartner(partnerData));
        }

        // Fetch weddings only when accepting an invitation
        const weddingsResponse = await fetch("/api/wedding");
        if (weddingsResponse.ok) {
          const weddingsData = await weddingsResponse.json();
          dispatch(setWeddings(weddingsData));
        }
      }

      toast.success(
        action === "accept"
          ? "You are now connected with your partner!"
          : "The invitation has been rejected"
      );

      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${action} invitation`,
      });
    } finally {
      dispatch(setLoading({ key: "invitation/handle", isLoading: false }));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {invitations.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {invitations.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit bg-card">
        <NotificationContent
          invitations={invitations}
          handleInvitation={handleInvitation}
          isLoading={isLoading}
        />
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
