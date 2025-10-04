import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-[#1e3a8a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl font-headline">ByteFront</span>
            </Link>
            <p className="text-sm text-blue-100 leading-relaxed">
              Your trusted source for premium laptops, smartphones, and
              accessories in Nigeria.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://web.facebook.com/profile.php?id=61578378034859"
                aria-label="Facebook"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/bytefrontgadgets?igsh=MWZlb29naXFzZDUxOQ=="
                aria-label="Instagram"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="font-semibold mb-4 font-headline text-white">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/laptops"
                  className="text-sm text-blue-100 hover:text-white transition-colors"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="text-sm text-blue-100 hover:text-white transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-semibold mb-4 font-headline text-white">
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/why-bytefront"
                  className="text-sm text-blue-100 hover:text-white transition-colors"
                >
                  Why ByteFront
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-blue-100 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-blue-100 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold mb-4 font-headline text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>Email: info@higher.com.ng</li>
              <li>Phone: +234 9043970401</li>
              <li>Hours: 24/7, Mon - Fri</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-blue-400/30 pt-6 text-center text-sm text-blue-100">
          <p>
            &copy; {new Date().getFullYear()} ByteFront Commerce. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
