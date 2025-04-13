"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PartnerProfile from "./PartnerProfile";
import Notifications from "./navbar/Notification";
import { Menu } from "lucide-react";
import Pricing from "./Pricing";
import { memo } from "react";
import { User } from "@/types/user";
import { Partner } from "@/types/partner";
import React from "react";

const MenuContent = memo(
  ({
    user,
    partner,
    logout,
    setOpen,
  }: {
    user: User;
    partner: Partner | null;
    logout: () => void;
    setOpen: (open: boolean) => void;
  }) => (
    <div className="flex flex-col gap-4 mt-6">
      <Link href="/" className="w-full" onClick={() => setOpen(false)}>
        <Button variant="ghost" className="w-full justify-start">
          Home
        </Button>
      </Link>
      <Link
        href="/create-wedding-plan"
        className="w-full"
        onClick={() => setOpen(false)}
      >
        <Button variant="ghost" className="w-full justify-start">
          Create Wedding Plan
        </Button>
      </Link>

      <Link href="/" className="w-full" onClick={() => setOpen(false)}>
        <Button variant="ghost" className="w-full justify-start">
          My Wedding Plans
        </Button>
      </Link>

      <Button variant="ghost" className="w-full justify-start" disabled>
        Become Vendor (Coming Soon)
      </Button>

      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-muted-foreground">Access</p>
        <div className="flex items-center gap-4">
          <span>{user?.subscription || "Basic"}</span>
          {(!user?.subscription || user.subscription === "BASIC") && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Upgrade</Button>
              </DialogTrigger>
              <DialogContent className="px-4 w-full">
                <DialogHeader>
                  <DialogTitle>Upgrade access</DialogTitle>
                  <DialogDescription>
                    Unlock the full potential with Premium
                  </DialogDescription>
                </DialogHeader>
                <Pricing />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-sm text-muted-foreground">Partner:</p>
          <div className="flex flex-row gap-2">
            <PartnerProfile />
            <p className="font-semibold">{partner?.name}</p>
          </div>
        </div>
      </div>

      <Button variant="destructive" onClick={logout} className="w-full">
        Logout
      </Button>
    </div>
  )
);

MenuContent.displayName = "MenuContent";

export default function Navbar() {
  const { partner, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(false);

  return (
    <div>
      <nav className="shadow-sm">
        <div className="w-full px-4 py-2 flex justify-between">
          <Link href="/" className="dancing-text text-3xl font-bold">
            Wedding AI
          </Link>
          {user ? (
            <div className="flex flex-row gap-2 md:gap-4 items-center justify-center">
              <Notifications />

              {/* Mobile view */}
              <div className="md:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger className="cursor-pointer">
                    <Button variant="ghost" className="relative" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="p-4">
                    <SheetTitle>
                      <Link
                        href="/"
                        className="dancing-text text-3xl font-bold"
                      >
                        Wedding AI
                      </Link>
                    </SheetTitle>
                    <MenuContent
                      user={user}
                      partner={partner}
                      logout={logout}
                      setOpen={setMobileOpen}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop view */}
              <div className="hidden md:flex items-center gap-4">
                <PartnerProfile />
                {partner && <p className="dancing-text font-bold">&</p>}
                <Avatar>
                  {user.picture && <AvatarImage src={user.picture} />}
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <Sheet open={desktopOpen} onOpenChange={setDesktopOpen}>
                  <SheetTrigger className="cursor-pointer">
                    <Menu />
                  </SheetTrigger>
                  <SheetContent className="p-4">
                    <SheetTitle>
                      <Link
                        href="/"
                        className="dancing-text text-3xl font-bold"
                      >
                        Wedding AI
                      </Link>
                    </SheetTitle>
                    <MenuContent
                      user={user}
                      partner={partner}
                      logout={logout}
                      setOpen={setDesktopOpen}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          ) : (
            <Link href="/auth">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
