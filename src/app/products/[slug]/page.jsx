"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  CheckCircle,
  Cpu,
  Globe,
  ShieldCheck,
  Truck,
  Terminal,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth"; // ✅ Added Auth check
import { useToast } from "@/hooks/use-toast";
import { ReviewsSection } from "@/components/reviews-section";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user } = useAuth(); // ✅ Access identity state
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setProduct(null);
        } else {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    // ✅ AUTHENTICATION PROTOCOL GATE
    if (!user) {
      toast({
        variant: "destructive",
        title: "ACCESS_DENIED",
        description: "Authentication required to initiate procurement.",
        className:
          "bg-red-600 text-white border-none rounded-none font-black uppercase text-[10px]",
      });
      router.push("/login");
      return;
    }

    if (product) {
      addToCart(product);
      toast({
        title: "CART UPDATED",
        description: `${product.name} loaded into cart module.`,
        className:
          "bg-white text-black border-none rounded-none font-black uppercase text-[10px]",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black container mx-auto px-4 py-20 space-y-12">
        <div className="grid md:grid-cols-2 gap-16">
          <Skeleton className="w-full aspect-square bg-zinc-900 rounded-none" />
          <div className="space-y-8">
            <Skeleton className="h-16 w-3/4 bg-zinc-900 rounded-none" />
            <Skeleton className="h-40 w-full bg-zinc-900 rounded-none" />
            <Skeleton className="h-20 w-1/2 bg-zinc-900 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* --- BREADCRUMB / STATUS BAR --- */}
      <section className="border-b border-zinc-900 bg-zinc-950 py-4">
        <div className="container max-w-screen-xl px-4 mx-auto flex items-center gap-4">
          <Terminal className="h-3 w-3 text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
            Hardware_Interface // {product.category} // Unit_
            {product.id.substring(0, 8)}
          </span>
        </div>
      </section>

      <main className="container max-w-screen-xl px-4 py-12 md:py-20 mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* --- LEFT: VISUAL DATA (IMAGES) --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative border-2 border-zinc-900 bg-zinc-950 p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center">
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 h-12 w-12 rounded-none border-zinc-800 bg-black text-white hover:bg-[#FF6B00] hover:text-black" />
                <CarouselNext className="right-4 h-12 w-12 rounded-none border-zinc-800 bg-black text-white hover:bg-[#FF6B00] hover:text-black" />
              </Carousel>

              {/* Overlays */}
              <div className="absolute top-8 left-8 flex flex-col items-start gap-2">
                {product.isNew && (
                  <div className="bg-white text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    New_Deployment
                  </div>
                )}
                {product.noShippingFee && (
                  <div className="bg-[#FF6B00] text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5" /> Zero_Logistics_Fee
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT: TECHNICAL MANIFEST (DETAILS) --- */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#FF6B00]" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FF6B00]">
                  {product.brand} Industrial_Series
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-white">
                {product.name}
              </h1>

              <div className="pt-4">
                {product.discountedPrice ? (
                  <div className="space-y-1">
                    <p className="text-zinc-600 text-sm font-black line-through uppercase tracking-widest">
                      NGN {product.price.toLocaleString()}
                    </p>
                    <p className="text-6xl font-display font-black text-white italic tracking-tighter">
                      ₦{product.discountedPrice.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-6xl font-display font-black text-white italic tracking-tighter">
                    ₦{product.price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Logistics Grid */}
              <div className="grid grid-cols-2 gap-4 py-8 border-y border-zinc-900 border-dashed">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <Globe className="h-3 w-3" /> Hardware_Source
                  </div>
                  <p className="text-sm font-bold text-zinc-200 uppercase">
                    {product.supplierSource || "Verified Hub"}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3" /> Tech_Warranty
                  </div>
                  <p className="text-sm font-bold text-zinc-200 uppercase">
                    {product.warranty || "Standard Coverage"}
                  </p>
                </div>
              </div>

              <div className="text-zinc-400 text-sm leading-relaxed font-sans border-l-2 border-[#FF6B00] pl-6 py-2 italic">
                {product.description}
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <Button
                  size="lg"
                  className="h-16 bg-[#FF6B00] hover:bg-white text-black rounded-none font-black uppercase tracking-[0.2em] text-xs transition-all relative overflow-hidden group"
                  onClick={handleAddToCart}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {user ? (
                      <ShoppingCart className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    {user ? "Add to Cart" : "Login Required"}
                  </span>
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-black group-hover:w-full transition-all duration-500" />
                </Button>

                {/* <Button
                  size="lg"
                  variant="outline"
                  className="h-16 border-zinc-800 text-zinc-400 hover:text-white rounded-none uppercase text-[10px] font-black tracking-widest"
                >
                  <Heart className="mr-2 h-4 w-4" /> Cache to Wishlist
                </Button> */}
              </div>

              <div className="flex items-center gap-3 text-[10px] font-black text-[#FF6B00] uppercase tracking-widest pt-4">
                <CheckCircle className="h-4 w-4" />
                <span>Nationwide Deployment Active | 2-5 Day Window</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- FULL SPECIFICATIONS BLOCK --- */}
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display text-4xl font-black uppercase italic tracking-tighter">
              Unit_<span className="text-zinc-700">Specifications</span>
            </h2>
            <div className="h-px flex-grow bg-zinc-900" />
          </div>

          <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-1 gap-8">
                <div className="font-mono text-xs md:text-sm text-zinc-400 leading-loose whitespace-pre-wrap columns-1 md:columns-2 gap-16">
                  {product.specs}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- REVIEW PROTOCOLS --- */}
        <div className="mt-32">
          <ReviewsSection />
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-900 bg-black opacity-30">
        <div className="container max-w-screen-xl px-4 mx-auto flex justify-center">
          <div className="flex items-center gap-4 text-zinc-800">
            <Terminal className="h-3 w-3" />
            <span className="text-[9px] uppercase font-bold tracking-[0.5em]">
              Hardware Catalog Protocol Active | SSL_Secure_Node
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
