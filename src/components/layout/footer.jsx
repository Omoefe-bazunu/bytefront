"use client";

import Link from "next/link";
import { Facebook, Instagram, Cpu, Mail, Phone, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-zinc-900 text-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Identity Section */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-xl font-black tracking-tighter">
                Bytefront
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Industrial grade hardware and high-performance tech modules.
              Verified imports for the next generation of Nigerian innovators.
            </p>
            <div className="flex space-x-5">
              <Link
                href="https://web.facebook.com/profile.php?id=61578378034859"
                aria-label="Facebook"
                className="text-zinc-600 hover:text-[#FF6B00] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/bytefrontgadgets?igsh=MWZlb29naXFzZDUxOQ=="
                aria-label="Instagram"
                className="text-zinc-600 hover:text-[#FF6B00] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Core Modules (Shop) */}
          <div>
            <h3 className="font-display text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-100">
              Inventory
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/laptops"
                  className="text-sm text-zinc-500 hover:text-[#FF6B00] transition-colors uppercase tracking-widest font-bold text-[11px]"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="text-sm text-zinc-500 hover:text-[#FF6B00] transition-colors uppercase tracking-widest font-bold text-[11px]"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-order"
                  className="text-sm text-zinc-500 hover:text-[#FF6B00] transition-colors uppercase tracking-widest font-bold text-[11px]"
                >
                  Sourcing Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-display text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-100">
              Protocol
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/why-bytefront"
                  className="text-sm text-zinc-500 hover:text-[#FF6B00] transition-colors uppercase tracking-widest font-bold text-[11px]"
                >
                  System Standard
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-zinc-500 hover:text-[#FF6B00] transition-colors uppercase tracking-widest font-bold text-[11px]"
                >
                  Support FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-500 hover:text-[#FF6B00] transition-colors uppercase tracking-widest font-bold text-[11px]"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-500 hover:text-[#FF6B00] transition-colors uppercase tracking-widest font-bold text-[11px]"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Node */}
          <div>
            <h3 className="font-display text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-100">
              Contact Node
            </h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#FF6B00]" />
                <span className="font-mono text-xs">info@higher.com.ng</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#FF6B00]" />
                <span className="font-mono text-xs">+234 904 397 0401</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[#FF6B00]" />
                <span className="font-mono text-[10px] uppercase">
                  Available: 24/7 Mon-Fri
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom / Meta */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-700 font-bold">
            &copy; {currentYear} BYTEFRONT GADGETS. SYSTEM VERSION 1.0.4
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] uppercase text-zinc-800 font-black tracking-widest">
              Lagos, Nigeria
            </span>
            <span className="text-[10px] uppercase text-zinc-800 font-black tracking-widest">
              Global Sourcing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
