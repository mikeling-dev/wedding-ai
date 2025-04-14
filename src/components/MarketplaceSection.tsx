import Image from "next/image";
import Link from "next/link";
import MarketplaceBg from "../../public/wedding-decor3.jpg";
import { Button } from "@/components/ui/button";

export default function MarketplaceSection() {
  return (
    <section className="py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="md:hidden mb-8">
          <Image
            src="/marketplace-cover.jpg"
            alt="Wedding Marketplace"
            width={800}
            height={400}
            className="rounded-lg object-cover w-full"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Wedding Marketplace</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Discover a curated selection of premium wedding vendors and
                services, all in one place. Our marketplace connects you with
                trusted professionals who can bring your dream wedding to life.
              </p>
              <p>
                From stunning venues and talented photographers to exquisite
                catering and beautiful decor, find everything you need for your
                special day. Each vendor is carefully vetted to ensure quality
                and reliability.
              </p>
              <p>
                Are you a wedding vendor? Join our marketplace to showcase your
                services to engaged couples actively planning their weddings.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" disabled>
                Marketplace Coming Soon
              </Button>
              <Link href="/vendor">
                <Button>Become a Vendor</Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src={MarketplaceBg}
              alt="Wedding Marketplace"
              width={800}
              height={400}
              className="rounded-lg object-cover w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
