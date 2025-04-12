import HeroSection from "@/components/HeroSection";
import { WeddingList } from "@/components/weddings/wedding-list";
import HowTo from "@/components/HowTo";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WeddingList />
      <HowTo />
    </div>
  );
}
