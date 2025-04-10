"use client";
import bgImage from "../../../public/login-page-bg.jpg";

import { LoginForm } from "@/components/login-form";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (user) return <Spinner />;

  if (!user) {
    return (
      <div className="lg:grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10 relative z-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium text-3xl dancing-text"
            >
              WeddingAI
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center align-middle mt-10 lg:mt-0">
            <div className="w-full lg:max-w-md bg-background p-10 rounded-lg shadow-lg lg:shadow-none">
              <LoginForm />
            </div>
          </div>
        </div>
        <Image
          src={bgImage}
          alt="Image"
          className="lg:hidden fixed top-0 z-0 opacity-50 h-screen w-full object-cover object-center"
        />
        <div className="relative hidden bg-muted lg:block">
          <Image
            src={bgImage}
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    );
  }

  return null;
}
