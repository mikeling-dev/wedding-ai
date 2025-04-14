import Image from "next/image";
import Link from "next/link";
import MarketplaceBg from "../../public/wedding-decor3.jpg";
import { Button } from "@/components/ui/button";

export default function MarketplaceSection() {
  return (
    <section className="py-12 px-6 md:px-12">
      <div className="md:hidden mb-8">
        <Image
          src={MarketplaceBg}
          alt="Wedding Marketplace"
          width={800}
          height={400}
          className="rounded-lg object-cover w-full"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Wedding Marketplace</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Find top-tier wedding vendors—venues, photographers, caterers,
              decor, and more—all in one place. Connect with trusted
              professionals to bring your vision to life. Every vendor is vetted
              for quality and reliability.
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
        <div className="hidden md:flex md:flex-row w-full justify-end">
          <Image
            src={MarketplaceBg}
            alt="Wedding Marketplace"
            // width={800}
            height={400}
            className="rounded-lg object-cover w-full max-w-96"
          />
        </div>
      </div>
    </section>
  );
}
