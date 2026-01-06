"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Wand2, Terminal, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingNav() {
  const pathname = usePathname();

  // Disable nav on specific routes
  if (pathname === "/checkout") {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-0 bg-green-700 overflow-hidden">
        {/* --- WHATSAPP COMMS LINK --- */}
        <a
          href="https://wa.me/2349043970401"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <button className="flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] bg-green-700 text-white hover:bg-zinc-900 transition-all group relative">
            {/* Pulsing Status Indicator */}
            <div className="absolute top-0 right-0 p-1">
              <div className="h-1 w-1 bg-[#FF6B00] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>

            <MessageCircle className="h-3.5 w-3.5 text-white group-hover:scale-110 transition-transform" />
            <span>WhatsApp</span>

            {/* Cyber Orange Bottom Border on Hover */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-[#FF6B00] w-0 group-hover:w-full transition-all duration-300" />
          </button>
        </a>
      </div>
    </div>
  );
}
