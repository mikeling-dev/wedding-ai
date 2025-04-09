"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/useAuth";

export default function Navbar() {
  const { user, login, logout } = useAuth();

  console.log(user?.email);
  return (
    <div>
      <nav className="shadow-sm">
        <div className="w-full px-4 py-2 flex justify-between">
          <Link href="/" className="dancing-text text-3xl font-bold">
            Wedding AI
          </Link>
          {!user ? (
            <Button onClick={login}>Login</Button>
          ) : (
            <Button onClick={logout}>Logout</Button>
          )}
        </div>
      </nav>
    </div>
  );
}
