import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-accent-foreground py-12 mt-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Wedding Section */}
        <div className="col-span-1 text-nowrap">
          <h3 className="font-semibold mb-4">Wedding</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/create-wedding-plan" className="transition-colors">
                Create Wedding Plans
              </Link>
            </li>
            <li>
              <Link href="/" className="transition-colors">
                My Wedding Plans
              </Link>
            </li>
            <li>
              <span className="cursor-not-allowed w-fit text-muted-foreground/70 flex items-center">
                Guests Management
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                  WIP
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Marketplace Section */}
        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Marketplace</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/vendor/interest-form" className=" transition-colors">
                Become Vendor
              </Link>
            </li>
            <li>
              <span className="cursor-not-allowed w-fit text-muted-foreground/70 flex items-center">
                Marketplace
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                  WIP
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Marketplace Section */}
        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Vibe Wedding</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className=" transition-colors">
                About us (me)
              </Link>
            </li>
            <li>
              <div className="flex items-center gap-6">
                <p>Contact me</p>
                <a
                  href="mailto:mikeling.dev@gmail.com"
                  className="transition-colors flex items-center gap-2"
                  aria-label="Email contact"
                >
                  <Mail className="h-5 w-5" />
                  {/* <span>Email</span> */}
                </a>
                <a
                  href="https://t.me/orangemike"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors flex items-center gap-2"
                  aria-label="Telegram contact"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height={20}
                    width={20}
                    fill="currentColor"
                  >
                    <path d="M17.0943 7.14643C17.6874 6.93123 17.9818 6.85378 18.1449 6.82608C18.1461 6.87823 18.1449 6.92051 18.1422 6.94825C17.9096 9.39217 16.8906 15.4048 16.3672 18.2026C16.2447 18.8578 16.1507 19.1697 15.5179 18.798C15.1014 18.5532 14.7245 18.2452 14.3207 17.9805C12.9961 17.1121 11.1 15.8189 11.2557 15.8967C9.95162 15.0373 10.4975 14.5111 11.2255 13.8093C11.3434 13.6957 11.466 13.5775 11.5863 13.4525C11.64 13.3967 11.9027 13.1524 12.2731 12.8081C13.4612 11.7035 15.7571 9.56903 15.8151 9.32202C15.8246 9.2815 15.8334 9.13045 15.7436 9.05068C15.6539 8.97092 15.5215 8.9982 15.4259 9.01989C15.2904 9.05064 13.1326 10.4769 8.95243 13.2986C8.33994 13.7192 7.78517 13.9242 7.28811 13.9134L7.29256 13.9156C6.63781 13.6847 5.9849 13.4859 5.32855 13.286C4.89736 13.1546 4.46469 13.0228 4.02904 12.8812C3.92249 12.8466 3.81853 12.8137 3.72083 12.783C8.24781 10.8109 11.263 9.51243 12.7739 8.884C14.9684 7.97124 16.2701 7.44551 17.0943 7.14643ZM19.5169 5.21806C19.2635 5.01244 18.985 4.91807 18.7915 4.87185C18.5917 4.82412 18.4018 4.80876 18.2578 4.8113C17.7814 4.81969 17.2697 4.95518 16.4121 5.26637C15.5373 5.58382 14.193 6.12763 12.0058 7.03736C10.4638 7.67874 7.39388 9.00115 2.80365 11.001C2.40046 11.1622 2.03086 11.3451 1.73884 11.5619C1.46919 11.7622 1.09173 12.1205 1.02268 12.6714C0.970519 13.0874 1.09182 13.4714 1.33782 13.7738C1.55198 14.037 1.82635 14.1969 2.03529 14.2981C2.34545 14.4483 2.76276 14.5791 3.12952 14.6941C3.70264 14.8737 4.27444 15.0572 4.84879 15.233C6.62691 15.7773 8.09066 16.2253 9.7012 17.2866C10.8825 18.0651 12.041 18.8775 13.2243 19.6531C13.6559 19.936 14.0593 20.2607 14.5049 20.5224C14.9916 20.8084 15.6104 21.0692 16.3636 20.9998C17.5019 20.8951 18.0941 19.8479 18.3331 18.5703C18.8552 15.7796 19.8909 9.68351 20.1332 7.13774C20.1648 6.80544 20.1278 6.433 20.097 6.25318C20.0653 6.068 19.9684 5.58448 19.5169 5.21806Z"></path>
                  </svg>
                  {/* <span>Telegram</span> */}
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Spacer for grid layout */}
        <div className="col-span-1 md:col-span-2"></div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
        <div className="mb-4 md:mb-0">
          <p className="text-center">
            © {currentYear} Vibe-Wedding. Made with ❤️ for lovebirds everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
