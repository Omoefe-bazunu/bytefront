// src/components/layout/floating-nav.tsx
"use client";

import Link from "next/link";
import { Search, Wand2 } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingNav() {
  const pathname = usePathname();

  if (pathname === "/product-finder") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden">
      <div className="flex items-center gap-2 p-2 rounded-full border bg-background/80 backdrop-blur-sm shadow-lg">
        <Link href="/laptops" passHref>
          <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary transition-colors">
            <Search className="h-4 w-4" />
            <span>Search Products</span>
          </button>
        </Link>
        <div className="h-6 w-px bg-border" />
        <Link href="/product-finder" passHref>
          <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary transition-colors text-primary">
            <Wand2 className="h-4 w-4" />
            <span>AI Finder</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
