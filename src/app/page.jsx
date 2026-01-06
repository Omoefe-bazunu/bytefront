"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { ReviewsSection } from "@/components/reviews-section";
import { faqItems, trustFeatures } from "@/lib/data";
import {
  ArrowRight,
  Cpu,
  Zap,
  ShieldCheck,
  Lock,
  Truck,
  Headset,
  Box,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [specs, setSpecs] = useState("");

  const handleCustomRequest = async (e) => {
    e.preventDefault();
    const message = `BYTEFRONT REQUEST\nEmail: ${email}\nSpecs: ${specs}`;
    const whatsappUrl = `https://wa.me/+2349043970401?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setEmail("");
    setSpecs("");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;
      try {
        setLoading(true);
        // Featured
        const fQ = query(
          collection(db, "products"),
          where("isFeatured", "==", true),
          limit(6)
        );
        const fSnap = await getDocs(fQ);
        setFeaturedProducts(
          fSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Laptops
        const lQ = query(
          collection(db, "products"),
          where("category", "==", "Laptops"),
          limit(3)
        );
        const lSnap = await getDocs(lQ);
        setLaptops(lSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Accessories
        const aQ = query(
          collection(db, "products"),
          where("category", "==", "Accessories"),
          limit(3)
        );
        const aSnap = await getDocs(aQ);
        setAccessories(
          aSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        toast({
          variant: "destructive",
          title: "System Sync Failed",
          description: "Could not load inventory.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [db, toast]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white font-sans">
      <main className="flex-1">
        {/* --- HERO SECTION: TYPOGRAPHIC FOCUS --- */}
        <section className="relative w-full pt-16 pb-8 md:pt-12 md:pb-24 border-b border-zinc-900 bg-zinc-950">
          <div className="container max-w-screen-xl px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-bold tracking-[0.3em] uppercase">
                System Status: Operational
              </div> */}
              <h1 className="font-display text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] max-w-4xl uppercase">
                High Performance <span className="text-zinc-600">Hardware</span>{" "}
                Delivered.
              </h1>
              <p className="max-w-[600px] text-zinc-500 md:text-lg font-medium">
                Industrial grade laptops and tech accessories for the Nigerian
                market. Verified imports. Zero compromise on specs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/laptops" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-[#FF6B00] hover:bg-[#e65a00] text-white rounded-none w-full px-12 font-bold tracking-widest uppercase text-xs"
                  >
                    Access Laptops
                  </Button>
                </Link>
                <Link href="/accessories" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-zinc-800 text-white hover:bg-zinc-900 rounded-none w-full px-12 font-bold tracking-widest uppercase text-xs"
                  >
                    View Accessories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </section>

        {/* --- TRUST BAR --- */}
        <section className="w-full py-6 border-b border-zinc-900 bg-black">
          <div className="container max-w-screen-xl px-4 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: ShieldCheck, label: "Verified Importers" },
                { icon: Lock, label: "Secure Protocol" },
                { icon: Truck, label: "Fast Deployment" },
                { icon: Headset, label: "Live Support" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center md:flex-row md:justify-center gap-2 text-zinc-600"
                >
                  <item.icon className="h-4 w-4 text-[#FF6B00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURED SECTION --- */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container max-w-screen-xl px-4 mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter uppercase">
                  Featured <span className="text-[#FF6B00]">Inventory</span>
                </h2>
                <p className="text-zinc-500 text-sm tracking-wide uppercase">
                  Core system recommendations
                </p>
              </div>
              <Link href="/laptops">
                <Button
                  variant="link"
                  className="text-[#FF6B00] p-0 font-bold uppercase text-xs tracking-widest hover:no-underline flex items-center gap-2"
                >
                  View Full Inventory <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[400px] w-full bg-zinc-900 rounded-none"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- SYSTEM CAPABILITIES (WHY US) --- */}
        <section className="w-full py-16 md:py-24 bg-zinc-950 border-y border-zinc-900">
          <div className="container max-w-screen-xl px-4 mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="font-display text-4xl font-bold tracking-tighter uppercase leading-none">
                  The <br /> Bytefront <br />{" "}
                  <span className="text-[#FF6B00]">Standard.</span>
                </h2>
                <p className="text-zinc-500 font-medium">
                  We don't just sell gadgets. We provide the tools for the next
                  generation of Nigerian developers, designers, and
                  entrepreneurs.
                </p>
              </div>
              <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                {trustFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 border border-zinc-900 bg-black group hover:border-[#FF6B00] transition-colors"
                  >
                    <feature.icon className="h-8 w-8 text-[#FF6B00] mb-4" />
                    <h3 className="font-display text-xl font-bold uppercase mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- CUSTOM SOURCING TERMINAL --- */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container max-w-screen-xl px-4 mx-auto">
            <div className="max-w-2xl mx-auto border border-zinc-800 p-8 md:p-12 relative overflow-hidden bg-zinc-950">
              <div className="relative z-10 space-y-6 text-center">
                <div className="flex justify-center">
                  <Box className="h-10 w-10 text-[#FF6B00]" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tighter">
                  Custom Sourcing Terminal
                </h2>
                <p className="text-zinc-500 text-sm">
                  Can't find specific specs? Enter your requirements below. Our
                  importers will find it.
                </p>

                <form
                  onSubmit={handleCustomRequest}
                  className="space-y-4 text-left mt-8"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600">
                      User Email
                    </label>
                    <Input
                      type="email"
                      className="bg-black border-zinc-800 rounded-none text-white focus:border-[#FF6B00] ring-0 transition-all h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600">
                      Hardware Specifications
                    </label>
                    <Textarea
                      className="bg-black border-zinc-800 rounded-none text-white focus:border-[#FF6B00] ring-0 transition-all min-h-[120px]"
                      placeholder="e.g. RTX 4080, 32GB RAM, US Keyboard Layout..."
                      value={specs}
                      onChange={(e) => setSpecs(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-widest py-6"
                  >
                    Submit Sourcing Request
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ & Reviews */}
        <div className="bg-zinc-950 border-t border-zinc-900">
          <ReviewsSection />
          <section className="py-16 md:py-24 border-t border-zinc-900">
            <div className="container max-w-screen-xl px-4 mx-auto">
              <h2 className="font-display text-3xl text-center font-bold uppercase mb-12 tracking-widest">
                FAQs
              </h2>
              <div className="max-w-3xl mx-auto">
                <FaqAccordion items={faqItems.slice(0, 4)} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
