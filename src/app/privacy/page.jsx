"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Eye,
  Fingerprint,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  const lastSync = "January 06, 2026";

  const privacyNodes = [
    {
      id: "01",
      title: "Data Acquisition",
      icon: Database,
      content:
        "We collect specific 'Identity Modules' when you interact with our terminal. This includes your email, shipping coordinates, and hardware preferences. This data is essential for the procurement and deployment of your gadgets.",
    },
    {
      id: "02",
      title: "Encryption Protocols",
      icon: Fingerprint,
      content:
        "All sensitive data is processed via high-level encryption nodes (Firebase/SSL). We do not store raw payment credentials on our local servers; all financial transactions are offloaded to verified secure gateways.",
    },
    {
      id: "03",
      title: "System Usage",
      icon: Eye,
      content:
        "Your data is used strictly to optimize the Bytefront experience. This includes order tracking, system notifications, and internal analytics to improve our hardware inventory. We do not 'sell' your data to third-party data brokers.",
    },
    {
      id: "04",
      title: "Third-Party Interfacing",
      icon: Share2,
      content:
        "Limited data is shared with our 'Logistics Nodes' (delivery partners) to ensure your hardware reaches its destination. These partners are bound by strict non-disclosure protocols.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* --- PROTOCOL HEADER --- */}
      <section className="pt-8 pb-12 border-b border-zinc-900 bg-zinc-950">
        <div className="container max-w-screen-xl px-4 mx-auto">
          {/* <Link href="/">
            <Button
              variant="ghost"
              className="text-zinc-500 hover:text-[#FF6B00] p-0 mb-8 uppercase text-[10px] tracking-[0.3em] font-black"
            >
              <ArrowLeft className="mr-2 h-3 w-3" /> Back to System
            </Button>
          </Link> */}
          <div className="space-y-4">
            <h1 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Privacy <span className="text-zinc-700">Policy</span>
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <p className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00] bg-[#FF6B00]/5 border border-[#FF6B00]/20 px-3 py-1 inline-block">
                Security Protocol v1.0.4
              </p>
              <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                Last Encryption Sync: {lastSync}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- POLICY CONTENT --- */}
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Nav Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit space-y-4">
              <p className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] mb-6">
                Privacy Nodes
              </p>
              {privacyNodes.map((node) => (
                <a
                  key={node.id}
                  href={`#node-${node.id}`}
                  className="block text-xs uppercase font-bold tracking-widest text-zinc-600 hover:text-[#FF6B00] transition-colors border-l border-zinc-900 pl-4 py-2 hover:border-[#FF6B00]"
                >
                  Node {node.id}
                </a>
              ))}
            </aside>

            {/* Main Text Content */}
            <div className="lg:col-span-9 space-y-24">
              {privacyNodes.map((node) => (
                <div key={node.id} id={`node-${node.id}`} className="group">
                  <div className="flex items-start gap-8">
                    <div className="flex flex-col items-center">
                      <span className="font-display text-4xl font-black text-zinc-800 group-hover:text-[#FF6B00] transition-colors duration-500">
                        {node.id}
                      </span>
                      <div className="h-full w-px bg-zinc-900 mt-4 group-last:hidden" />
                    </div>
                    <div className="space-y-6 pb-12">
                      <div className="flex items-center gap-3">
                        <node.icon className="h-5 w-5 text-[#FF6B00]" />
                        <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                          {node.title}
                        </h2>
                      </div>
                      <p className="text-zinc-500 leading-relaxed text-sm md:text-base max-w-2xl font-medium">
                        {node.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Data Deletion Control */}
              <div className="p-8 md:p-12 border border-zinc-900 bg-zinc-950 space-y-6">
                <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 p-2 w-fit">
                  <ShieldCheck className="h-6 w-6 text-[#FF6B00]" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-widest text-zinc-100">
                  User Sovereignty
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
                  You maintain full rights over your data modules. You may
                  request a complete 'System Wipe' of your user identity at any
                  time. To exercise your right to erasure or data portability,
                  please initialize a request via our support node.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="border-zinc-800 text-zinc-400 rounded-none uppercase text-[10px] tracking-widest font-black hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      Initialize Deletion Request
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROTOCOL END --- */}
      <section className="py-12 border-t border-zinc-900 bg-black">
        <div className="container max-w-screen-xl px-4 mx-auto text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-700 tracking-[0.5em]">
            End of Privacy Protocol — Secured by Bytefront Gadgets
          </p>
        </div>
      </section>
    </div>
  );
}
