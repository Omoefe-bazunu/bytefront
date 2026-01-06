"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Terminal,
  Cpu,
  Search,
  Filter,
  ArrowUpRight,
  Monitor,
} from "lucide-react";

export default function LaptopsPage() {
  useVisitorTracker("Service: Web Development");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([1000000]);

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          where("category", "==", "Laptops")
        );
        const querySnapshot = await getDocs(q);
        const laptopProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(laptopProducts);
        setFilteredProducts(laptopProducts);

        const uniqueBrands = [...new Set(laptopProducts.map((p) => p.brand))];
        setBrands(uniqueBrands);

        if (laptopProducts.length > 0) {
          const prices = laptopProducts.map((p) => p.price);
          const max = Math.max(...prices);
          setMaxPrice(max);
          setPriceRange([max]);
        }
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  const handleApplyFilters = () => {
    let result = [...products];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.specs &&
            Object.values(product.specs).some((spec) =>
              spec.toString().toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price filter
    result = result.filter((product) => product.price <= priceRange[0]);

    setFilteredProducts(result);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleBrandChange = (brand, checked) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, brand] : prev.filter((b) => b !== brand)
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* --- PAGE HEADER --- */}
      <section className="pt-12 pb-16 border-b border-zinc-900 bg-zinc-950">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
              <Monitor className="h-3 w-3" /> Laptop Inventory
            </div>
            <h1 className="font-display text-5xl md:text-8xl font-black uppercase tracking-wider leading-none">
              LAP<span className="text-zinc-700">TOPS</span>
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold max-w-md">
              High-performance hardware for engineering, creative deployment,
              and core execution.
            </p>
          </div>
        </div>
      </section>

      <main className="container max-w-screen-xl px-4 py-16 mx-auto">
        <div className="grid md:grid-cols-4 gap-12 items-start">
          {/* --- FILTER PROTOCOLS (SIDEBAR) --- */}
          <aside className="md:col-span-1 space-y-8 sticky top-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 bg-[#FF6B00]" />
              <h2 className="font-display text-xl font-bold uppercase tracking-tight italic">
                FILTER_PARAMETERS
              </h2>
            </div>

            <div className="space-y-10 bg-zinc-950 border border-zinc-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Search */}
              <div className="space-y-3">
                <Label
                  htmlFor="search"
                  className="text-[10px] uppercase font-black text-zinc-500 tracking-widest"
                >
                  Search_Identity
                </Label>
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="NAME/SPECS..."
                    className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-11 text-xs font-mono uppercase"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                  Manufacturer_Class
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {brands.map((brand) => (
                    <div
                      key={brand}
                      className="flex items-center space-x-3 group cursor-pointer"
                    >
                      <Checkbox
                        id={`brand-${brand}`}
                        className="rounded-none border-zinc-800 data-[state=checked]:bg-[#FF6B00] data-[state=checked]:border-[#FF6B00]"
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) =>
                          handleBrandChange(brand, checked)
                        }
                      />
                      <Label
                        htmlFor={`brand-${brand}`}
                        className="text-xs font-bold uppercase tracking-tighter text-zinc-400 group-hover:text-white transition-colors cursor-pointer"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                  Value_Threshold
                </h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={maxPrice}
                  step={10000}
                  className="[&_[role=slider]]:bg-[#FF6B00] [&_[role=slider]]:border-black [&_[role=slider]]:rounded-none"
                />
                <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                  <span>₦0</span>
                  <span className="text-[#FF6B00] font-black">
                    ₦{priceRange[0].toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-[#FF6B00] hover:bg-white hover:text-black text-black rounded-none font-black uppercase tracking-[0.2em] py-6 text-[10px] transition-all"
                onClick={handleApplyFilters}
              >
                Sync Filters <Filter className="ml-2 h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2 opacity-20">
              <Terminal className="h-3 w-3" />
              <span className="text-[8px] uppercase font-bold tracking-widest">
                System_Ready: Filters active
              </span>
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <main className="md:col-span-3">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4 border border-zinc-900 p-4">
                    <Skeleton className="h-48 w-full bg-zinc-900 rounded-none" />
                    <Skeleton className="h-6 w-5/6 bg-zinc-900 rounded-none" />
                    <Skeleton className="h-4 w-1/4 bg-zinc-900 rounded-none" />
                    <Skeleton className="h-10 w-full bg-zinc-900 rounded-none" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-900">
                <Cpu className="h-12 w-12 text-zinc-800 mb-4" />
                <p className="font-display text-xl font-bold uppercase text-zinc-700 tracking-tighter">
                  No units detected within current parameters
                </p>
                <Button
                  variant="link"
                  className="text-[#FF6B00] text-[10px] uppercase font-black"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedBrands([]);
                    setPriceRange([maxPrice]);
                    setFilteredProducts(products);
                  }}
                >
                  Reset Connection Protocol
                </Button>
              </div>
            )}
          </main>
        </div>
      </main>

      {/* --- FOOTER STATUS --- */}
      <footer className="py-12 border-t border-zinc-900 bg-black">
        <div className="container max-w-screen-xl px-4 mx-auto flex justify-center">
          <div className="flex items-center gap-4 text-zinc-800">
            <Cpu className="h-3 w-3" />
            <span className="text-[9px] uppercase font-bold tracking-[0.4em]">
              Hardware Catalog Protocol Active | Total_Units: {products.length}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
