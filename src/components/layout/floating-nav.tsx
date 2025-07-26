// src/components/layout/floating-nav.tsx
"use client";

import Link from "next/link";
import { Search, Wand2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function FloatingNav() {
  const pathname = usePathname();

  if (pathname === "/product-finder") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex">
      <div className="flex items-center gap-2 p-2 rounded-full ">
        {/* <Link href="/laptops" passHref>
          <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary transition-colors">
            <Search className="h-4 w-4" />
            <span>Search Products</span>
          </button>
        </Link>
        <div className="h-6 w-px bg-border" /> */}
        {/* <Link href="/product-finder" passHref>
          <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary transition-colors text-primary">
            <Wand2 className="h-4 w-4" />
            <span>AI Finder</span>
          </button>
        </Link> */}
        <a href="https://wa.me/2349043970401">
          <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-green-600 hover:bg-green-800 text-white">
            <MessageCircle className="h-4 w-4" />
            <span>Chat us on WhatsApp</span>
          </button>
        </a>
      </div>
    </div>
  );
}
