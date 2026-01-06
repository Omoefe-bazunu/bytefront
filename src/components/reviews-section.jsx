"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
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
} from "@/components/ui/carousel";
import {
  Star,
  Cpu,
  Terminal,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Check if current user already has a review
  const existingReview = reviews.find((r) => r.userId === user?.uid);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!db) {
        console.warn("Firebase Firestore unavailable");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const reviewsQuery = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        setReviews(
          reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast({
          variant: "destructive",
          title: "SYSTEM ERROR",
          description: "Failed to retrieve testimonial data packets.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [toast]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!reviewForm.comment) {
      toast({
        variant: "destructive",
        title: "INPUT REQUIRED",
        description: "Comment field cannot be null.",
      });
      return;
    }

    setReviewSubmitting(true);
    try {
      const reviewData = {
        author:
          user.displayName || user.email.split("@")[0] || "Anonymous_Unit",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      if (existingReview) {
        // UPDATE EXISTING PROTOCOL
        const reviewRef = doc(db, "reviews", existingReview.id);
        await updateDoc(reviewRef, reviewData);
        setReviews(
          reviews.map((r) =>
            r.id === existingReview.id ? { ...r, ...reviewData } : r
          )
        );
        toast({
          title: "LOGGED: UPDATED",
          description: "Your testimonial update has been effected.",
          className:
            "bg-white text-black border-none rounded-none font-black uppercase tracking-widest text-[10px]",
        });
      } else {
        // NEW SUBMISSION PROTOCOL
        const docRef = await addDoc(collection(db, "reviews"), reviewData);
        setReviews([{ ...reviewData, id: docRef.id }, ...reviews]);
        toast({
          title: "LOGGED: SUCCESS",
          description: "Your testimonial has been updated.",
          className:
            "bg-white text-black border-none rounded-none font-black uppercase tracking-widest text-[10px]",
        });
      }

      setReviewModalOpen(false);
      setReviewForm({ rating: 5, comment: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "TRANSMISSION FAILED",
        description: "Could not sync review to the cloud.",
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!existingReview) return;
    if (!confirm("CONFIRM DELETION PROTOCOL? This action cannot be undone."))
      return;

    try {
      await deleteDoc(doc(db, "reviews", existingReview.id));
      setReviews(reviews.filter((r) => r.id !== existingReview.id));
      toast({
        title: "LOGGED: DELETED",
        description: "Review removed from central network.",
        className:
          "bg-black text-white border-none rounded-none font-black uppercase tracking-widest text-[10px]",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "DELETE FAILED",
        description: "Error purging review from system.",
      });
    }
  };

  const openModal = () => {
    if (existingReview) {
      setReviewForm({
        rating: existingReview.rating,
        comment: existingReview.comment,
      });
    } else {
      setReviewForm({ rating: 5, comment: "" });
    }
    setReviewModalOpen(true);
  };

  const ReviewSkeleton = () => (
    <div className="p-4">
      <Card className="bg-zinc-950 border-zinc-900 rounded-none h-[220px]">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <Skeleton className="h-4 w-24 bg-zinc-900" />
          <Skeleton className="h-3 w-32 bg-zinc-900" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-2 w-full bg-zinc-900" />
            <Skeleton className="h-2 w-4/5 bg-zinc-900 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section className="w-full py-20 bg-black overflow-hidden border-t border-zinc-900">
      <div className="container max-w-screen-xl px-4 mx-auto">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
            <Terminal className="h-3 w-3" /> FEEDBACK LOG
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white">
            Customer <span className="text-zinc-700">Reviews</span>
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00]" />
        </div>

        {/* --- REVIEWS CAROUSEL --- */}
        <div className="w-full max-w-5xl mx-auto relative">
          {loading ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {[...Array(3)].map((_, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <ReviewSkeleton />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {reviews.map((review) => (
                  <CarouselItem
                    key={review.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-4 group">
                      <Card className="bg-zinc-950 border border-zinc-900 rounded-none transition-all duration-500 group-hover:border-[#FF6B00] relative overflow-hidden h-[220px]">
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B00] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                        <CardContent className="flex flex-col items-center text-center p-8 h-full">
                          <span className="font-sans text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-3 group-hover:text-white transition-colors">
                            {review.author}
                          </span>

                          <div className="flex items-center gap-1 mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "text-[#FF6B00] fill-[#FF6B00]" : "text-zinc-800"}`}
                              />
                            ))}
                          </div>

                          <p className="font-sans text-xs font-medium text-zinc-500 italic leading-relaxed uppercase tracking-tighter group-hover:text-zinc-300">
                            "{review.comment}"
                          </p>

                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Cpu className="h-3 w-3 text-zinc-800" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>

        {/* --- CTA --- */}
        {user && (
          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            {existingReview ? (
              <>
                <Button
                  className="bg-transparent border-2 border-zinc-800 hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-black text-white rounded-none px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                  onClick={openModal}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Update Review
                </Button>
                <Button
                  variant="destructive"
                  className="bg-transparent border-2 border-red-900/30 hover:bg-red-600 hover:text-white text-red-500 rounded-none px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                  onClick={handleDeleteReview}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Review
                </Button>
              </>
            ) : (
              <Button
                className="bg-transparent border-2 border-zinc-800 hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-black text-white rounded-none px-10 py-6 font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                onClick={openModal}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Submit Review
              </Button>
            )}
          </div>
        )}
      </div>

      {/* --- REVIEW MODAL --- */}
      <Dialog
        open={reviewModalOpen}
        onOpenChange={(handleModalClose) =>
          setReviewModalOpen(handleModalClose)
        }
      >
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md bg-black border-2 border-zinc-900 rounded-none p-0 overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] outline-none">
          <div className="h-1.5 w-full bg-[#FF6B00] animate-pulse" />

          <div className="p-8">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#FF6B00] p-1.5">
                  <ShieldCheck className="h-4 w-4 text-black" />
                </div>
                <span className="font-sans text-[9px] font-black tracking-[0.3em] text-[#FF6B00] uppercase">
                  Submission FORM
                </span>
              </div>
              <DialogTitle className="font-display text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
                Log <span className="text-zinc-700">Review</span>
              </DialogTitle>
            </DialogHeader>

            <form className="space-y-6 mt-8" onSubmit={handleReviewSubmit}>
              <div className="space-y-2">
                <Label className="font-sans text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Rating (1-5)
                </Label>
                <Input
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
                  className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-12 text-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-sans text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Testimonial
                </Label>
                <Textarea
                  placeholder="Input your experience..."
                  className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] min-h-[120px] text-white font-mono text-xs"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-[#FF6B00] hover:bg-white text-black rounded-none font-display text-xl font-black uppercase italic transition-all disabled:opacity-50"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <span className="flex items-center gap-2">
                    {existingReview ? "UPDATE" : "SUBMIT"}{" "}
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
