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
      <section className="py-8 px-6 md:px-12 bg-background">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="text-xl text-gray-600">
            Manage your wedding like a pro with Premium
          </p>
        </div>
        <Pricing />
      </section>
    </div>
  );
}
