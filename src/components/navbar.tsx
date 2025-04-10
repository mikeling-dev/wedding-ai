"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Bell } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  console.log(user?.picture);
  return (
    <div>
      <nav className="shadow-sm">
        <div className="w-full px-4 py-2 flex justify-between">
          <Link href="/" className="dancing-text text-3xl font-bold">
            Wedding AI
          </Link>
          {user ? (
            <div className="flex flex-row gap-4 items-center">
              <Bell height={20} width={20} />
              <Sheet>
                <SheetTrigger className="cursor-pointer">
                  <Avatar>
                    {user.picture && <AvatarImage src={user.picture} />}
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </SheetTrigger>
                <SheetContent className="p-4">
                  <SheetTitle>
                    <Link href="/" className="dancing-text text-3xl font-bold">
                      Wedding AI
                    </Link>
                  </SheetTitle>
                  <Button onClick={logout}>Logout</Button>
                </SheetContent>
              </Sheet>
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
