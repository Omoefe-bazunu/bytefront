"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Truck,
  Headset,
  Cpu,
  Zap,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trustFeatures } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function WhyBytefrontPage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      <div className="container mx-auto px-4 py-16 md:py-8 max-w-screen-xl">
        {/* --- HERO SECTION --- */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
            <Activity className="h-3 w-3" /> System Identity
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter uppercase leading-[0.9]">
            Built on <span className="text-zinc-800">Trust.</span> <br />
            Powered by <span className="text-[#FF6B00]">Quality.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
            We aren't just another terminal for gadgets. We are the dedicated
            protocol for acquiring industrial-grade, verified technology in
            Nigeria. Experience the Bytefront standard.
          </p>
        </div>

        {/* --- FEATURE GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1 mt-20 bg-zinc-900 border border-zinc-900">
          {trustFeatures.map((feature, index) => (
            <Card
              key={index}
              className="bg-black border-none rounded-none group hover:bg-zinc-950 transition-colors duration-300"
            >
              <CardHeader className="items-start p-8">
                <div className="p-3 bg-zinc-900 border border-zinc-800 group-hover:border-[#FF6B00] transition-colors rounded-none mb-4">
                  <feature.icon className="h-6 w-6 text-[#FF6B00]" />
                </div>
                <CardTitle className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- THE UNWAVERING PROMISE (MANIFESTO) --- */}
        <div className="mt-32 border border-zinc-900 bg-zinc-950 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="h-32 w-32 text-zinc-500" />
          </div>

          <div className="relative z-10">
            <h3 className="text-xs font-black font-display text-[#FF6B00] tracking-[0.4em] uppercase mb-8">
              Hardware Manifest // 2026
            </h3>
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter mb-12 leading-none">
              The Bytefront <br /> Unwavering{" "}
              <span className="text-zinc-800">Promise</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  icon: ShieldCheck,
                  title: "Verified Importers",
                  detail:
                    "Strict supply chain vetting for every hardware module.",
                },
                {
                  icon: Lock,
                  title: "Secure Checkout",
                  detail:
                    "Military-grade encryption for all financial transactions.",
                },
                {
                  icon: Truck,
                  title: "Fast Deployment",
                  detail:
                    "Optimized logistics routes across the Nigerian federation.",
                },
                {
                  icon: Headset,
                  title: "System Support",
                  detail: "24/7 technical assistance and procurement guidance.",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-[#FF6B00]" />
                    <h4 className="font-display font-bold uppercase text-sm tracking-widest">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-wider font-medium">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- CTA SECTION --- */}
        <div className="mt-1 flex flex-col md:flex-row items-center justify-between gap-8 p-12 bg-white text-black">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black font-display uppercase tracking-tighter leading-none">
              Ready to Upgrade?
            </h2>
            <p className="mt-2 text-black/70 font-bold uppercase text-xs tracking-widest">
              Join the high-performance hardware network.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full md:w-auto">
            <Link href="/faq" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-black text-white hover:bg-black rounded-none w-full font-bold uppercase text-[10px] tracking-widest"
              >
                Technical FAQ
              </Button>
            </Link>
            <Link href="/contact" className="w-full md:w-auto">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-zinc-900 rounded-none w-full font-bold uppercase text-[10px] tracking-widest px-8"
              >
                Initiate Contact <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
