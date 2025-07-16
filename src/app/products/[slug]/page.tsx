// src/app/products/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, CheckCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ReviewsSection } from "@/components/reviews-section";

export default function ProductPage() {
  const params = useParams();
  const productId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);

      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setProduct(null);
      } else {
        const productData = { id: docSnap.id, ...docSnap.data() } as Product;
        setProduct(productData);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image Gallery */}
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src={img}
                        alt={`${product.name} image ${index + 1}`}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover aspect-square"
                        data-ai-hint={product.aiHint}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold font-headline">
            {product.name}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">{product.brand}</p>

          <div className="mt-4">
            {product.discountedPrice ? (
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-primary">
                  ₦{product.discountedPrice.toLocaleString()}
                </p>
                <p className="text-2xl text-muted-foreground line-through">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-4xl font-bold">
                ₦{product.price.toLocaleString()}
              </p>
            )}
          </div>

          <Separator className="my-6" />

          <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {product.description}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="btn-gradient flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              <Heart className="mr-2 h-5 w-5" /> Save for Later
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Delivery within 2-5 working days</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mt-12">
        {/* Specifications */}
        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">
            Full Specifications
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="whitespace-pre-wrap text-muted-foreground">
                {product.specs}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Reviews */}
      <ReviewsSection />
    </div>
  );
}
