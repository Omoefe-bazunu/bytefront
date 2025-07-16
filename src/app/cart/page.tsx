// src/app/cart/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { user, loading } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, subtotal, total, shipping } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto mt-4" />
        </div>
        <div className="grid lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-72 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <UserCheck className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4">Login to View Your Cart</CardTitle>
            <CardDescription>Please log in or create an account to view and manage your shopping cart.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full btn-gradient">
                Login or Sign Up
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Your Shopping Cart</h1>
        <p className="mt-4 text-lg text-muted-foreground">Review your items and proceed to checkout.</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <Image src={item.images[0]} alt={item.name} width={100} height={100} className="rounded-md" data-ai-hint={item.aiHint} />
                  <div className="flex-grow">
                    <h2 className="font-semibold font-headline text-lg">{item.name}</h2>
                    <p className="text-muted-foreground text-sm">₦{(item.discountedPrice ?? item.price).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      min="1" 
                      className="w-20 h-9" 
                      aria-label="Quantity" 
                    />
                    <Button variant="outline" size="icon" aria-label="Remove item" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/checkout" className="w-full">
                  <Button size="lg" className="w-full btn-gradient">
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center mt-16">
            <p className="text-xl text-muted-foreground">Your cart is empty.</p>
            <Link href="/">
                <Button size="lg" className="mt-6 btn-gradient">Start Shopping</Button>
            </Link>
        </div>
      )}
    </div>
  );
}
