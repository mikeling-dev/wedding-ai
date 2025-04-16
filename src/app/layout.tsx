import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Dancing_Script } from "next/font/google";
import "./globals.css";
import Providers from "@/components/ReduxProvider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"], // Specify the character subset
  variable: "--font-dancing-script", // Define a CSS variable
  display: "swap", // Ensures font loads without blocking rendering
});

export const metadata: Metadata = {
  title: "Vibe Wedding",
  description: "AI Wedding Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
