"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Cpu, Plus } from "lucide-react";
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
    });
  };

  return (
    <Card
      className={cn(
        "bg-black border-zinc-900 rounded-none overflow-hidden flex flex-col h-full group hover:border-[#FF6B00] transition-all duration-300",
        className
      )}
    >
      {/* Image Container */}
      <CardHeader className="p-0 relative aspect-square bg-zinc-950 flex justify-center items-center overflow-hidden border-b border-zinc-900">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {/* UPDATED IMAGE: Removed grayscale classes */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Status Badges - Industrial Style */}
        <div className="absolute top-0 left-0 flex flex-col">
          {product.isNew && (
            <div className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
              New
            </div>
          )}
          {product.discountedPrice && (
            <div className="bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
              Slash Sale
            </div>
          )}
        </div>

        {/* Floating Quick Action */}
        <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            className="bg-white text-black hover:bg-[#FF6B00] hover:text-white rounded-none font-bold text-[10px] uppercase tracking-widest"
            onClick={handleAddToCart}
          >
            <Plus className="mr-1 h-3 w-3" /> Quick Add
          </Button>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-6 flex-grow space-y-2">
        <div className="flex items-center gap-2">
          <Cpu className="h-3 w-3 text-zinc-700" />
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
            {product.brand} | {product.category || "Hardware"}
          </p>
        </div>

        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="font-display text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#FF6B00] transition-colors leading-tight">
            {product.name}
          </CardTitle>
        </Link>
      </CardContent>

      {/* Footer / Pricing Section */}
      <CardFooter className="p-6 pt-0 flex justify-between items-end">
        <div className="space-y-1">
          {product.discountedPrice ? (
            <>
              <p className="text-zinc-600 text-[10px] font-bold line-through uppercase tracking-tighter">
                ₦{product.price.toLocaleString()}
              </p>
              <p className="text-xl font-bold text-white font-display">
                ₦{product.discountedPrice.toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold text-white font-display">
              ₦{product.price.toLocaleString()}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-500 hover:text-[#FF6B00] hover:bg-zinc-900 rounded-none"
          aria-label="Add to cart"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </CardFooter>

      {/* Visual Tech-Bar Bottom */}
      <div className="h-1 w-0 bg-[#FF6B00] group-hover:w-full transition-all duration-500" />
    </Card>
  );
}
