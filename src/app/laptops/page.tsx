// src/app/laptops/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from "@/components/product-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function LaptopsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000000);

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true);
      const q = query(collection(db, "products"), where("category", "==", "Laptops"));
      const querySnapshot = await getDocs(q);
      const laptopProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      
      setProducts(laptopProducts);
      
      const uniqueBrands = [...new Set(laptopProducts.map(p => p.brand))];
      setBrands(uniqueBrands);

      if (laptopProducts.length > 0) {
        const prices = laptopProducts.map(p => p.price);
        setMaxPrice(Math.max(...prices));
      }
      
      setLoading(false);
    };

    fetchLaptops();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Laptops</h1>
        <p className="mt-4 text-lg text-muted-foreground">Find the perfect laptop for work, play, and everything in between.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="md:col-span-1 bg-secondary p-6 rounded-lg self-start">
          <h2 className="text-2xl font-semibold font-headline mb-6">Filters</h2>
          
          <div className="space-y-8">
            <div>
              <Label htmlFor="search" className="text-lg font-semibold font-headline">Search</Label>
              <Input id="search" placeholder="Search by name/specs..." className="mt-2" />
            </div>

            <div>
              <h3 className="text-lg font-semibold font-headline mb-4">Brand</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox id={`brand-${brand}`} />
                    <Label htmlFor={`brand-${brand}`} className="font-normal">{brand}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold font-headline mb-4">Price Range</h3>
              <Slider defaultValue={[maxPrice]} max={maxPrice} step={10000} className="my-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₦0</span>
                <span>₦{maxPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <Button className="w-full btn-gradient">Apply Filters</Button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3">
            {loading ? (
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-6 w-5/6" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-8 w-1/2" />
                        </div>
                    ))}
                 </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
