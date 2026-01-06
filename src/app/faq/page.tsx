"use client";

import { FaqAccordion } from "@/components/faq-accordion";
import { faqItems } from "@/lib/data";
import { HelpCircle, MessageSquare, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* --- HEADER SECTION --- */}
      <section className="relative pt-8 pb-16 border-b border-zinc-900 bg-zinc-950 overflow-hidden">
        <div className="container max-w-screen-xl px-4 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
              <HelpCircle className="h-3 w-3" /> Support Database
            </div>

            <h1 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Technical <span className="text-zinc-700">FAQ</span>
            </h1>

            <p className="max-w-xl text-zinc-500 text-sm md:text-base font-medium leading-relaxed">
              Find technical documentation and answers regarding hardware
              procurement, system deployment, and account protocols.
            </p>
          </div>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </section>

      {/* --- FAQ ACCORDION SECTION --- */}
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-md px-4 mx-auto">
          {/* Decorative Terminal Header */}
          <div className="flex items-center justify-between border border-zinc-900 bg-zinc-950 px-4 py-2 mb-1">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
            </div>
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Knowledge_Base_v1.0
            </span>
          </div>

          <div className="border border-zinc-900 p-6 md:p-10 bg-black">
            <FaqAccordion items={faqItems} />
          </div>

          {/* Contact Support CTA */}
          <div className="mt-16 p-8 border border-zinc-900 bg-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-display text-lg font-bold uppercase tracking-widest text-white">
                Still Unresolved?
              </h3>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                Initialize a direct support session with our technicians.
              </p>
            </div>
            <Link href="/contact" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-widest text-[10px] px-8 py-6">
                <MessageSquare className="mr-2 h-4 w-4" /> Open Support Node
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER STATUS --- */}
      <section className="py-8 border-t border-zinc-900 bg-black">
        <div className="container max-w-screen-xl px-4 mx-auto flex justify-center">
          <div className="flex items-center gap-4 text-zinc-800">
            <Terminal className="h-3 w-3" />
            <span className="text-[9px] uppercase font-bold tracking-[0.4em]">
              End of Technical Documentation
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
