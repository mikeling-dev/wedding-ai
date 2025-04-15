"use client"; // Client component for conditional navbar

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/auth" && <Navbar />}
      {children}
      {pathname !== "/auth" && <Footer />}
    </>
  );
}
