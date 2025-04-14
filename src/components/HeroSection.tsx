import Image from "next/image";
// import HeroBg from "../../public/hero-bg.png";
import HeroBg from "../../public/hero-bg-real.jpg";
// import HeroBg from "../../public/wedding-bg-3.jpg";
import { Button } from "./ui/button";
import StartPlanningBtn from "./StartPlanningBtn";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative">
      <Image
        src={HeroBg}
        alt="bg"
        className="block absolute inset-y-0 z-0 opacity-60 h-full object-cover"
      />
      <div className="relative z-10 w-full mx-auto text-center py-10">
        <div className="flex flex-col justify-center items-center p-8  m-10 bg-card/70 rounded-xl">
          <h1 className="text-2xl md:text-4xl lg:text-6xl tracking-tight font-bold ">
            <span className="block">Plan Your Dream Wedding</span>
            <span className="block"> With AI Assistance</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-sm font-medium sm:text-md md:mt-5 md:text-xl md:max-w-3xl">
            Create a personalized wedding plan, manage tasks, and connect with
            vendors{" "}
            <span className="block">- all in one elegant platform.</span>
          </p>
          <div className="flex flex-col md:flex-row gap-2 justify-center mt-3">
            <StartPlanningBtn />
            <Link href="/vendor/interest-form">
              <Button variant={"secondary"}>Become Vendor</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
