"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Cpu,
  Plus,
  Globe,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product, className }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Cart Updated",
      description: `${product.name} added to cart.`,
      className:
        "bg-[#FF6B00] text-black border-none rounded-none font-black uppercase text-[10px]",
    });
  };

  return (
    <Card
      className={cn(
        "bg-black border-zinc-900 rounded-none overflow-hidden flex flex-col h-full group hover:border-[#FF6B00] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
    >
      {/* --- IMAGE OVERLAY & BADGES --- */}
      <CardHeader className="p-0 relative aspect-square bg-zinc-950 flex justify-center items-center overflow-hidden border-b border-zinc-900">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-8 group-hover:scale-110 transition-transform duration-500 grayscale-[0.5] group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Dynamic Status Badges */}
        <div className="absolute top-0 left-0 flex flex-col items-start">
          {product.isNew && (
            <div className="bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border-b border-r border-black">
              New_Entry
            </div>
          )}
          {product.discountedPrice && (
            <div className="bg-[#FF6B00] text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border-b border-r border-black">
              Price_Slash
            </div>
          )}
          {product.noShippingFee && (
            <div className="bg-zinc-900 text-[#FF6B00] text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 border-b border-r border-zinc-800 flex items-center gap-1.5">
              <Truck className="h-3 w-3" /> Free_Delivery
            </div>
          )}
        </div>

        {/* Quick Action Trigger */}
        <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            className="bg-white text-black hover:bg-[#FF6B00] hover:text-white rounded-none font-black text-[9px] uppercase tracking-widest px-4 py-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onClick={handleAddToCart}
          >
            <Plus className="mr-1.5 h-3 w-3" /> Add to Cart
          </Button>
        </div>
      </CardHeader>

      {/* --- HARDWARE SPECIFICATIONS (CONTENT) --- */}
      <CardContent className="p-6 flex-grow space-y-4">
        {/* Brand & Category */}
        <div className="flex items-center gap-2">
          <Cpu className="h-3 w-3 text-zinc-700" />
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
            {product.brand} | {product.category || "Hardware"}
          </p>
        </div>

        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="font-display text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#FF6B00] transition-colors leading-tight italic">
            {product.name}
          </CardTitle>
        </Link>

        {/* Technical Logistics Data */}
        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-zinc-900/50">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            <Globe className="h-3 w-3 text-[#FF6B00]/60" />
            <span>
              Source:{" "}
              <span className="text-zinc-300">
                {product.supplierSource || "Lagos Hub"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            <ShieldCheck className="h-3 w-3 text-[#FF6B00]/60" />
            <span>
              Warranty:{" "}
              <span className="text-zinc-300">
                {product.warranty || "Standard"}
              </span>
            </span>
          </div>
        </div>
      </CardContent>

      {/* --- PRICING MATRIX (FOOTER) --- */}
      <CardFooter className="p-6 pt-0 flex justify-between items-end">
        <div className="space-y-1">
          {product.discountedPrice ? (
            <>
              <p className="text-zinc-700 text-[10px] font-black line-through uppercase tracking-tighter decoration-[#FF6B00]/40">
                ₦{product.price.toLocaleString()}
              </p>
              <p className="text-2xl font-black text-white font-display italic leading-none">
                ₦{product.discountedPrice.toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-2xl font-black text-white font-display italic leading-none">
              ₦{product.price.toLocaleString()}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-zinc-500 hover:text-black hover:bg-[#FF6B00] rounded-none border border-transparent hover:border-black transition-all"
          aria-label="Add to cart"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </CardFooter>

      {/* Bottom Visual Terminal Bar */}
      <div className="h-1 w-full bg-zinc-900">
        <div className="h-full bg-[#FF6B00] w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
      </div>
    </Card>
  );
}
