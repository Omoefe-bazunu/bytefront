"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
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
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Review } from "@/lib/types";

export function ReviewsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!db) {
        console.warn("Firebase Firestore unavailable");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const reviewsQuery = query(collection(db, "reviews"), limit(10));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        setReviews(
          reviewsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Review
          )
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reviews.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
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
    if (!reviewForm.comment) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a comment.",
      });
      return;
    }

    setReviewSubmitting(true);
    try {
      const reviewData: Review = {
        id: "", // Will be set by Firestore
        author: user.email || "Anonymous",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        date: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "reviews"), {
        ...reviewData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setReviews([...reviews, { ...reviewData, id: docRef.id }]);
      setReviewModalOpen(false);
      setReviewForm({ rating: 5, comment: "" });
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

  const ReviewSkeleton = () => (
    <div className="p-4">
      <Card>
        <CardContent className="flex flex-col items-center text-center p-6">
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section className="w-full py-12 md:py-24 lg:py-16">
      <div className="container max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex justify-center items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            What Our Customers Say
          </h2>
        </div>
        {loading ? (
          <div className="w-full max-w-4xl mx-auto">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {[...Array(3)].map((_, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <ReviewSkeleton />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious />
              <CarouselNext /> */}
            </Carousel>
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-4">
                    <Card>
                      <CardContent className="flex flex-col items-center text-center p-6">
                        <h3 className="font-semibold font-headline">
                          {review.author}
                        </h3>
                        <div className="flex items-center gap-0.5 mt-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          "{review.comment}"
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
        {user && (
          <div className="text-center mt-8 w-full max-w-md mx-auto">
            <Button
              className="btn-gradient mt-4"
              onClick={() => setReviewModalOpen(true)}
            >
              Add Review
            </Button>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Submit a Review
            </DialogTitle>
            <DialogDescription>
              Share your experience with ByteFront products.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleReviewSubmit}>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    rating: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Write your review..."
                className="min-h-[100px]"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full btn-gradient"
              disabled={reviewSubmitting}
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
