import Image from "next/image";
import aboutBg from "../../../../public/wedding-bg-4.jpeg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full relative h-[400px] flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={aboutBg}
            alt="Wedding background"
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
        </div>
        <div className="relative z-10 px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold animate-fadeInUp text-white drop-shadow-md">
            About Vibe-Wedding
          </h1>
          <p
            className="mt-4 text-lg md:text-xl animate-fadeInUp text-white drop-shadow-md"
            style={{ animationDelay: "0.2s" }}
          >
            Your AI-powered partner for stress-free, vibe-filled wedding
            planning!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Our Story */}
        <section
          className="animate-fadeInUp"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-3xl font-semibold  mb-4">Our Story</h2>
          <p className="leading-relaxed">
            Congratulations on your engagement! If you&apos;re here, you&apos;re
            probably dreaming of a wedding that&apos;s uniquely yours.
            Vibe-Wedding was born from a personal place—six months ago, I got
            engaged to my amazing fiancée. We were over the moon, but between
            our busy work schedules and the endless details of wedding planning,
            we felt overwhelmed. From choosing a venue to balancing our budget,
            not to mention navigating our Chinese family&apos;s traditions
            (which our grandparents hold dear), we didn&apos;t know where to
            start.
          </p>
          <p className="leading-relaxed mt-4">
            That&apos;s when inspiration struck: why not create an AI-powered
            wedding planner that vibes with *you*? Just share your preferences,
            cultural background, and vision, and let Vibe-Wedding craft a plan
            that&apos;s personal, manageable, and budget-friendly. We wanted a
            tool that could guide us without the hefty price tag of a
            traditional planner—and now, we&apos;re sharing that with you.
          </p>
        </section>

        {/* What We Offer */}
        <section
          className="animate-fadeInUp"
          style={{ animationDelay: "0.6s" }}
        >
          <h2 className="text-3xl font-semibold  mb-4">What We Offer</h2>
          <p className="leading-relaxed">
            At Vibe-Wedding, I believe wedding planning should be exciting, not
            stressful. Our AI platform helps you create a personalized wedding
            plan in minutes. Whether you&apos;re keeping it simple or weaving in
            cultural traditions, we&apos;ve got you covered. Plus, our unique
            collaboration feature lets you invite your partner to plan together,
            making every decision a shared adventure.
          </p>
          <ul className="mt-4 space-y-4">
            <li>
              <strong>Free Tier:</strong> Powered by GPT-4o-mini, perfect for
              couples starting out. Input your date, budget, location, and theme
              to generate up to 3 wedding plans. Tweak the AI-generated to-do
              list to make it your own, *or* invite your partner to collab!
            </li>
            <li>
              <strong>Premium Tier:</strong> Unlock the full power of GPT-4o for
              up to 10 wedding plans. Add details like religion, cultural
              background, or special requests (think: a text box for your
              wildest ideas). It&apos;s smarter, more flexible, and still
              budget-friendly.
            </li>
          </ul>
          <p className="mt-4">
            For a simple, stress-free wedding planner, try our free wedding
            planner with the Basic Tier—perfect for creating your dream day on a
            budget!
          </p>
        </section>

        {/* Coming Soon */}
        <section
          className="animate-fadeInUp"
          style={{ animationDelay: "0.8s" }}
        >
          <h2 className="text-3xl font-semibold  mb-4">What&apos;s Next?</h2>
          <p className="leading-relaxed">
            We&apos;re thrilled to announce our upcoming Vendor Marketplace!
            Think of it like an Airbnb for wedding services—vendors can showcase
            their offerings, and we&apos;re working on machine learning magic to
            recommend services that match your wedding vibe. It&apos;s still in
            the works, but we&apos;re pouring our hearts into making it awesome.
          </p>
        </section>

        {/* Closing */}
        <section
          className="text-center animate-fadeInUp space-y-4"
          style={{ animationDelay: "1s" }}
        >
          <h2 className="text-3xl font-semibold">
            Let&apos;s Plan Your Dream Wedding!
          </h2>
          <p className="leading-relaxed">
            Once again, congrats on your engagement! We&apos;re here to make
            your wedding journey as joyful as the big day itself. Join
            Vibe-Wedding today and let&apos;s create a celebration that&apos;s
            *so* you.
          </p>
          <Link href="/create-wedding-plan">
            <Button>Get Started</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
