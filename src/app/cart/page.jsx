"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  ArrowRight,
  UserCheck,
  Terminal,
  ShoppingBag,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart, // Added to handle the purge
    subtotal,
    total,
    shipping,
    loading: cartLoading,
  } = useCart();
  const { toast } = useToast();

  // --- PURGE PROTOCOL ---
  // Run this once to clear the "Ghost" data from your old project
  const handlePurge = async () => {
    if (
      window.confirm(
        "CAUTION: This will wipe all local and cloud cart data to remove legacy products. Proceed?"
      )
    ) {
      await clearCart();
      localStorage.removeItem("cart");
      toast({
        title: "System Flushed",
        description: "Legacy data packets have been purged.",
        className:
          "bg-[#FF6B00] text-black border-none rounded-none font-black uppercase text-[10px]",
      });
    }
  };

  // --- SKELETON / LOADING STATE ---
  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-black py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-screen-xl text-center">
          <Skeleton className="h-12 w-64 mx-auto bg-zinc-900 rounded-none mb-4" />
          <Skeleton className="h-4 w-48 mx-auto bg-zinc-900 rounded-none mb-16" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-full bg-zinc-900 rounded-none"
                />
              ))}
            </div>
            <Skeleton className="h-[400px] w-full bg-zinc-900 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  // --- UNAUTHENTICATED STATE ---
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-zinc-950 border-zinc-900 rounded-none relative overflow-hidden border-2 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]" />
          <CardHeader className="text-center pt-10">
            <div className="flex justify-center text-zinc-800 mb-4">
              <UserCheck className="h-12 w-12" />
            </div>
            <CardTitle className="font-display text-2xl font-black uppercase tracking-tighter text-white">
              LOGIN Required
            </CardTitle>
            <CardDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-2">
              Authentication needed to access cart terminal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Link href="/login">
              <Button className="w-full bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-widest py-6 text-xs">
                LOGIN TO PROCEED
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* --- HEADER --- */}
      <section className="pt-8 pb-12 border-b border-zinc-900 bg-zinc-950">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
              <ShoppingBag className="h-3 w-3" /> Procurement Module
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Your <span className="text-zinc-700">Cart</span>
            </h1>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-bold">
              Verify hardware manifests before deployment
            </p>
          </div>
        </div>
      </section>

      <main className="container max-w-screen-xl px-4 py-16 mx-auto">
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* --- ITEM LIST --- */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row items-center gap-6 p-4 bg-zinc-950 border border-zinc-900 hover:border-[#FF6B00] transition-all relative overflow-hidden"
                >
                  <div className="relative w-32 h-32 bg-black border border-zinc-900 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-black text-zinc-800">
                        No Data
                      </div>
                    )}
                  </div>

                  <div className="flex-grow space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Cpu className="h-3 w-3 text-[#FF6B00]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        {item.brand}
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#FF6B00] transition-colors leading-none">
                      {item.name}
                    </h2>
                    <p className="font-mono text-sm text-zinc-400">
                      ₦{(item.discountedPrice ?? item.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-zinc-900 pt-4 sm:pt-0 sm:pl-6">
                    <div className="flex flex-col gap-1 text-center">
                      <label className="text-[8px] uppercase font-black text-zinc-600 tracking-widest">
                        Qty
                      </label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value, 10))
                        }
                        min="1"
                        className="w-16 h-8 bg-black border-zinc-800 rounded-none text-center text-xs font-mono focus:border-[#FF6B00]"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-none mt-4"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* PURGE BUTTON TO CLEAR GHOST DATA */}
              <div className="mt-8 flex justify-center sm:justify-start">
                <Button
                  variant="ghost"
                  onClick={handlePurge}
                  className="text-[9px] font-bold text-zinc-800 hover:text-[#FF6B00] uppercase tracking-[0.3em] gap-2"
                >
                  <RefreshCw className="h-3 w-3" /> Flush System Cache
                </Button>
              </div>
            </div>

            {/* --- SUMMARY CARD --- */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-zinc-950 border-2 border-zinc-900 rounded-none overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-[#FF6B00] py-1 px-4 text-black text-[10px] font-black uppercase tracking-[0.2em]">
                  Summary Matrix
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="font-display text-2xl font-bold uppercase tracking-tighter">
                    Order Total
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 font-mono text-xs uppercase tracking-tighter">
                    <div className="flex justify-between text-zinc-500">
                      <span>Subtotal</span>
                      <span className="text-white font-bold">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Logistics Fee</span>
                      <span className="text-white font-bold">
                        ₦{shipping.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Final Price
                    </span>
                    <span className="font-display text-3xl font-black text-[#FF6B00] italic leading-none">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pb-8">
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full h-16 bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-[0.2em] text-xs">
                      Proceed to Checkout{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
            <div className="h-24 w-24 bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <p className="font-display text-3xl font-bold uppercase tracking-tighter text-zinc-500">
                Your Cart is Vacant
              </p>
              <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                No items in Cart
              </p>
            </div>
            <Link href="/">
              <Button className="bg-white text-black hover:bg-[#FF6B00] hover:text-white transition-all rounded-none font-black uppercase tracking-widest px-12 py-6 text-xs">
                Browse Inventory
              </Button>
            </Link>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-zinc-900 bg-black opacity-30">
        <div className="container max-w-screen-xl px-4 mx-auto flex justify-center">
          <div className="flex items-center gap-4 text-zinc-800">
            <Terminal className="h-3 w-3" />
            <span className="text-[9px] uppercase font-bold tracking-[0.4em]">
              Procurement layer secured | SSL 256-Bit
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
