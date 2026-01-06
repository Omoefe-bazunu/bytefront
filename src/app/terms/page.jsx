"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert, FileText, Scale, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  const lastUpdated = "January 06, 2026";

  const legalSections = [
    {
      id: "01",
      title: "Protocol Acceptance",
      icon: ShieldAlert,
      content:
        "By accessing the Bytefront Gadgets system, you agree to be bound by these Terms of Service. If you do not agree with any part of these protocols, you are prohibited from using this site or purchasing hardware modules from our database.",
    },
    {
      id: "02",
      title: "Identity & Security",
      icon: Scale,
      content:
        "Users are responsible for maintaining the confidentiality of their 'Account Identity'. Any unauthorized access resulting from user negligence is the sole responsibility of the account holder. We reserve the right to terminate access for any identity found violating system integrity.",
    },
    {
      id: "03",
      title: "Procurement & Payment",
      icon: FileText,
      content:
        "All orders placed are subject to hardware availability. Prices are indexed in NGN (Nigerian Naira) unless otherwise stated. We use secure, payment process. Bytefront Gadgets reserves the right to cancel any order if fraudulent activity is detected by our security nodes.",
    },
    {
      id: "04",
      title: "Logistics & Deployment",
      icon: Gavel,
      content:
        "Deployment (Shipping) timelines are estimates. Nationwide delivery across Nigeria is handled by verified logistics partners. Risk of loss passes to the user upon hardware handover to the carrier. Any damaged units must be reported within 24 hours of arrival.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* --- HEADER SECTION --- */}
      <section className="pt-8 pb-12 border-b border-zinc-900 bg-zinc-950">
        <div className="container max-w-screen-xl px-4 mx-auto">
          {/* <Link href="/">
            <Button
              variant="ghost"
              className="text-zinc-500 hover:text-[#FF6B00] p-0 mb-8 uppercase text-[10px] tracking-[0.3em] font-black"
            >
              <ArrowLeft className="mr-2 h-3 w-3" /> Return to Terminal
            </Button>
          </Link> */}
          <div className="space-y-4">
            <h1 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Terms & <span className="text-zinc-700">Conditions</span>
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <p className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00] bg-[#FF6B00]/5 border border-[#FF6B00]/20 px-3 py-1 inline-block">
                Document Version 2.0.1
              </p>
              <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                Last System Sync: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- LEGAL CONTENT --- */}
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Sidebar Navigation (Desktop) */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit space-y-4">
              <p className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] mb-6">
                Quick Jump
              </p>
              {legalSections.map((section) => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  className="block text-xs uppercase font-bold tracking-widest text-zinc-600 hover:text-[#FF6B00] transition-colors border-l border-zinc-900 pl-4 py-2 hover:border-[#FF6B00]"
                >
                  {section.id}. {section.title}
                </a>
              ))}
            </aside>

            {/* Main Legal Text */}
            <div className="lg:col-span-9 space-y-20">
              {legalSections.map((section) => (
                <div
                  key={section.id}
                  id={`#section-${section.id}`}
                  className="group"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-display text-4xl font-black text-zinc-800 group-hover:text-[#FF6B00] transition-colors duration-500">
                      {section.id}
                    </span>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <section.icon className="h-5 w-5 text-[#FF6B00]" />
                        <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                          {section.title}
                        </h2>
                      </div>
                      <p className="text-zinc-500 leading-relaxed text-sm md:text-base max-w-3xl">
                        {section.content}
                      </p>
                    </div>
                  </div>
                  {/* Visual Divider */}
                  <div className="mt-12 h-px w-full bg-zinc-900" />
                </div>
              ))}

              {/* Additional Clauses */}
              <div className="p-8 bg-zinc-950 border border-zinc-900 space-y-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-widest text-zinc-100">
                  Governing Law
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  These protocols are governed by and construed in accordance
                  with the laws of the Federal Republic of Nigeria. Any disputes
                  arising from hardware procurement shall be subject to the
                  exclusive jurisdiction of the Nigerian court system.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="border-zinc-800 text-zinc-400 rounded-none uppercase text-[10px] tracking-widest font-black hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      Inquire About Protocols
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-12 border-t border-zinc-900 bg-black">
        <div className="container max-w-screen-xl px-4 mx-auto text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-700 tracking-[0.5em]">
            End of Document — Bytefront Gadgets Legal Database
          </p>
        </div>
      </section>
    </div>
  );
}
