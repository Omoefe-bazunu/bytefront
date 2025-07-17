"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqItems, trustFeatures } from "@/lib/data";
import {
  ArrowRight,
  Laptop,
  Smartphone,
  Star,
  ShieldCheck,
  Lock,
  Truck,
  Headset,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, Review } from "@/lib/types";
import { ReviewsSection } from "@/components/reviews-section";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [laptops, setLaptops] = useState<Product[]>([]);
  const [smartphones, setSmartphones] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    productId: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        console.warn("Firebase Firestore unavailable");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch Featured Products
        const featuredQuery = query(
          collection(db, "products"),
          where("isFeatured", "==", true),
          limit(6)
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        setFeaturedProducts(
          featuredSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Product
          )
        );

        // Fetch Laptops
        const laptopsQuery = query(
          collection(db, "products"),
          where("category", "==", "Laptops"),
          limit(3)
        );
        const laptopsSnapshot = await getDocs(laptopsQuery);
        setLaptops(
          laptopsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Product
          )
        );

        // Fetch Smartphones
        const smartphonesQuery = query(
          collection(db, "products"),
          where("category", "==", "Smartphones"),
          limit(3)
        );
        const smartphonesSnapshot = await getDocs(smartphonesQuery);
        setSmartphones(
          smartphonesSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Product
          )
        );

        // Fetch Reviews
        const reviewsQuery = query(collection(db, "reviews"), limit(10));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        setReviews(
          reviewsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Review
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [db, toast]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit a review.",
      });
      return;
    }
    if (!db) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firebase services unavailable.",
      });
      return;
    }
    if (!reviewForm.comment || !reviewForm.productId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    setReviewSubmitting(true);
    try {
      const reviewData: Review = {
        id: "",
        author: user.email || "Anonymous",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        productId: reviewForm.productId,
        date: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "reviews"), {
        ...reviewData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setReviews([...reviews, { ...reviewData, id: docRef.id }]);
      setReviewModalOpen(false);
      setReviewForm({ rating: 5, comment: "", productId: "" });
      toast({
        title: "Success",
        description: "Your review has been submitted!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review.",
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const ProductCarouselSkeleton = () => (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );

  const ProductGridSkeleton = () => (
    <div className="mx-auto max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      ))}
    </div>
  );

  const ReviewSkeleton = () => (
    <div className="px-4 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="flex flex-col items-center text-center p-6">
          <Skeleton className="h-20 w-20 rounded-full mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-dvh w-full">
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary ">
          <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto ">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center lg:items-start items-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl text-center lg:text-start font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Get Premium Laptops & Phones Delivered to Your Doorstep
                  </h1>
                  <p className="max-w-[600px] text-center lg:text-start text-muted-foreground md:text-xl ">
                    ByteFront offers verified, high-quality tech with fast,
                    reliable nationwide delivery. Trust us for your next
                    upgrade.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/laptops">
                    <Button
                      size="lg"
                      className="btn-gradient w-full min-[400px]:w-auto"
                    >
                      Shop Laptops <Laptop className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/smartphones">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full min-[400px]:w-auto"
                    >
                      Shop Phones <Smartphone className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/bytefront-dbdda.firebasestorage.app/o/general%2FA-modern-sleek-hero-scene-of-a.jpeg?alt=media&token=1dc84885-e954-47b6-adb0-de488080f43c"
                width={600}
                height={400}
                alt="Hero Product Showcase"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                data-ai-hint="modern laptops smartphones"
              />
            </div>
          </div>
        </section>

        {/* Featured Products Slider */}
        <section className="w-full py-12 md:py-24 lg:py-16">
          <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Top Deals
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out our featured products. Hand-picked for quality and
                  value.
                </p>
              </div>
            </div>
            {loading ? (
              <ProductCarouselSkeleton />
            ) : (
              <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mt-12">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent>
                    {featuredProducts.map((product) => (
                      <CarouselItem
                        key={product.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-1">
                          <ProductCard product={product} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* <CarouselPrevious />
                  <CarouselNext /> */}
                </Carousel>
              </div>
            )}
          </div>
        </section>

        {/* Laptops Section */}
        <section
          id="laptops"
          className="w-full py-12 md:py-24 lg:py-16 bg-secondary "
        >
          <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex items-center justify-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Laptops
              </h2>
            </div>
            {loading ? (
              <ProductGridSkeleton />
            ) : (
              <div className="mx-auto max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {laptops.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Link href="/laptops">
                <Button variant="outline">
                  View All Laptops <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Smartphones Section */}
        <section id="smartphones" className="w-full py-12 md:py-24 lg:py-16">
          <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex items-center justify-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Smartphones
              </h2>
            </div>
            {loading ? (
              <ProductGridSkeleton />
            ) : (
              <div className="mx-auto max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {smartphones.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Link href="/smartphones">
                <Button variant="outline">
                  View All Smartphones <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Buy From Us Section */}
        <section className="w-full py-12 md:py-24 lg:py-16 bg-secondary">
          <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Why ByteFront?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Built on trust. Powered by quality. We are your reliable
                  source for tech in Nigeria.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-screen-xl grid items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-headline">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto max-w-screen-xl grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="flex items-center gap-2 justify-center text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-green-500" /> Verified
                Importers
              </div>
              <div className="flex items-center gap-2 justify-center text-sm font-medium text-muted-foreground">
                <Lock className="h-5 w-5 text-green-500" /> Secure Checkout
              </div>
              <div className="flex items-center gap-2 justify-center text-sm font-medium text-muted-foreground">
                <Truck className="h-5 w-5 text-green-500" /> Fast Nationwide
                Delivery
              </div>
              <div className="flex items-center gap-2 justify-center text-sm font-medium text-muted-foreground">
                <Headset className="h-5 w-5 text-green-500" /> Customer Support
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/why-bytefront">
                <Button variant="default">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-16 bg-secondary">
          <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl font-headline mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-screen-xl mx-auto">
              <FaqAccordion items={faqItems.slice(0, 4)} />
              <div className="text-center mt-8">
                <Link href="/faq">
                  <Button variant="outline">See All FAQs</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate Program CTA */}
        <section className="w-full py-12 md:py-24 lg:py-16">
          <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid items-center justify-center gap-4 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                  Join Our Affiliate Program
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Earn commissions by referring customers to ByteFront. It's
                  free, easy, and rewarding.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Link href="/affiliate">
                  <Button size="lg" className="btn-gradient w-full">
                    Become an Affiliate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
