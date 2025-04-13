import HeroSection from "@/components/HeroSection";
import { WeddingList } from "@/components/weddings/wedding-list";
import HowTo from "@/components/HowTo";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WeddingList />
      <HowTo />
      <Pricing />
    </div>
  );
}
