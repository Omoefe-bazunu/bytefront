// src/components/product-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card
      className={cn("overflow-hidden flex flex-col h-full group", className)}
    >
      <CardHeader className="p-4 relative flex justify-center items-center bg-white">
        <Link href={`/products/${product.id}`} className="block w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-auto max-h-64 object-contain group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={product.aiHint}
          />
        </Link>

        {(product.isNew || product.discountedPrice) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge
                variant="default"
                className="bg-accent text-accent-foreground"
              >
                New
              </Badge>
            )}
            {product.discountedPrice && (
              <Badge variant="destructive">Sale</Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="hover:text-primary">
          <CardTitle className="text-lg font-headline leading-tight font-medium mb-1">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          {product.discountedPrice ? (
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-primary">
                ₦{product.discountedPrice.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold">
              ₦{product.price.toLocaleString()}
            </p>
          )}
        </div>
        <Button
          size="icon"
          variant="outline"
          aria-label="Add to cart"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
