import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl font-headline">ByteFront</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted source for premium laptops, smartphones, and
              accessories in Nigeria.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-headline">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/laptops"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/smartphones"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/product-finder"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  AI Product Finder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-headline">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/why-bytefront"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Why ByteFront
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-headline">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@higher.com.ng</li>
              <li>Phone: +234 9043970401</li>
              <li>Hours: 24/7, Mon - Fri</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} ByteFront Commerce. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
