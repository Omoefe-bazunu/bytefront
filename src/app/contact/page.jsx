"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Terminal,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Protocol Error",
        description: "All identification fields are required.",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      // 2. API Route for Email
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Email relay failed");

      toast({
        title: "Transmission Success",
        description: "Your message has been logged in our secure database.",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Communication relay failed. Please try WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* --- HEADER SECTION --- */}
      <section className="pt-8 pb-16 border-b border-zinc-900 bg-zinc-950">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
              <Zap className="h-3 w-3" /> Communication Node
            </div>
            <h1 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Contact <span className="text-zinc-700">Us</span>
            </h1>
            <p className="max-w-xl text-zinc-500 text-sm md:text-base font-medium leading-relaxed">
              Initialize a direct link with our technicians. Whether regarding
              hardware procurement or system support, our nodes are standing by.
            </p>
          </div>
        </div>
      </section>

      <main className="container max-w-screen-xl px-4 py-16 md:py-24 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* --- CONTACT FORM CARD --- */}
          <Card className="bg-zinc-950 border-zinc-900 rounded-none overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B00]" />
            <CardHeader className="p-8 border-b border-zinc-900">
              <CardTitle className="font-display text-2xl font-bold uppercase tracking-tight">
                Initialize Message
              </CardTitle>
              <CardDescription className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold mt-2">
                Secure Transmission Protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-[10px] uppercase font-black text-zinc-500 tracking-widest"
                    >
                      User Identity
                    </Label>
                    <Input
                      id="name"
                      placeholder="Full Name"
                      className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] transition-all text-white h-12"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[10px] uppercase font-black text-zinc-500 tracking-widest"
                    >
                      Return Address (Email)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@protocol.com"
                      className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] transition-all text-white h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-[10px] uppercase font-black text-zinc-500 tracking-widest"
                  >
                    Data Payload (Message)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your hardware inquiry or system issue..."
                    className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] transition-all text-white min-h-[160px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-[0.2em] py-6 text-xs"
                  disabled={loading}
                >
                  {loading ? "Transmitting..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* --- CONTACT INFO PANEL --- */}
          <div className="space-y-12">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tighter mb-8">
                Interface <span className="text-[#FF6B00]">Options</span>
              </h2>

              <div className="grid gap-1 bg-zinc-900 border border-zinc-900">
                {[
                  {
                    icon: Mail,
                    title: "Direct Email",
                    value: "info@higher.com.ng",
                    link: "mailto:info@higher.com.ng",
                    detail: "Primary relay for sales & support.",
                  },
                  {
                    icon: Phone,
                    title: "Voice Protocol",
                    value: "+234 904 397 0401",
                    link: "tel:+2349043970401",
                    detail: "Human technician availability.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Instant Chat",
                    value: "Open WhatsApp Node",
                    link: "https://wa.me/2349043970401",
                    detail: "Average response: < 15 mins.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-black p-6 flex items-start gap-4 group"
                  >
                    <div className="bg-zinc-950 border border-zinc-800 p-3 group-hover:border-[#FF6B00] transition-colors">
                      <item.icon className="h-5 w-5 text-[#FF6B00]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-sm font-bold uppercase tracking-widest text-zinc-100">
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-[10px] uppercase font-medium">
                        {item.detail}
                      </p>
                      <a
                        href={item.link}
                        className="block font-mono text-sm text-[#FF6B00] hover:text-white transition-colors pt-2"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Status Block */}
            <div className="p-8 border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-[#FF6B00]" />
                <h3 className="font-display text-sm font-bold uppercase tracking-widest">
                  Active Hours
                </h3>
              </div>
              <div className="space-y-3 font-mono text-[11px] text-zinc-500 uppercase tracking-tighter">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>Mon - Fri</span>
                  <span className="text-white">24 / 07</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>Saturday</span>
                  <span className="text-white">11:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white">Offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER STATUS --- */}
      <section className="py-12 border-t border-zinc-900 bg-black">
        <div className="container max-w-screen-xl px-4 mx-auto flex justify-center">
          <div className="flex items-center gap-4 text-zinc-800">
            <Terminal className="h-3 w-3" />
            <span className="text-[9px] uppercase font-bold tracking-[0.4em]">
              Bytefront Communication Protocol active
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
