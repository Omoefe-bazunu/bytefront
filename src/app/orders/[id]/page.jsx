"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  Terminal,
  ShieldCheck,
  Activity,
  Box,
  Truck,
  FileText,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !user) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = docSnap.data();
          if (orderData.userId !== user.uid) {
            toast({
              variant: "destructive",
              title: "ACCESS_DENIED",
              description: "Identity mismatch detected.",
            });
            router.push("/orders");
            return;
          }
          setOrder({ ...orderData, id: docSnap.id });
        } else {
          toast({
            variant: "destructive",
            title: "NOT_FOUND",
            description: "Deployment record does not exist.",
          });
          router.push("/orders");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "SYSTEM_ERROR",
          description: "Failed to retrieve deployment details.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, router, toast]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "border-zinc-700 text-zinc-500 bg-zinc-900";
      case "fulfilled":
        return "border-[#FF6B00] text-[#FF6B00] bg-[#FF6B00]/5";
      case "cancelled":
        return "border-red-600 text-red-600 bg-red-600/5";
      default:
        return "border-zinc-800 text-zinc-400 bg-zinc-950";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black container mx-auto p-8 space-y-8">
        <Skeleton className="h-10 w-48 bg-zinc-900 rounded-none" />
        <div className="grid lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[600px] bg-zinc-900 rounded-none" />
          <Skeleton className="h-[600px] bg-zinc-900 rounded-none" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white pb-20">
      <div className="container mx-auto px-4 py-12 max-w-screen-xl">
        {/* --- RETURN_TO_BASE --- */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[#FF6B00] transition-colors group"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          RETURN_TO_LOGS
        </Link>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* --- MAIN LOG (LEFT) --- */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-1.5 w-full bg-zinc-900">
                <div className="h-full bg-[#FF6B00] w-full" />
              </div>

              <CardHeader className="p-8 border-b border-zinc-900">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-[#FF6B00]" />
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        ORDER_ID
                      </span>
                    </div>
                    <CardTitle className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">
                      #{order.id.substring(0, 10)}
                    </CardTitle>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase">
                      DATE:{" "}
                      {new Date(
                        order.createdAt.seconds * 1000
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "px-4 py-1.5 border-2 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                      getStatusStyles(order.status)
                    )}
                  >
                    <Activity className="h-3 w-3" />
                    {order.status}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Box className="h-5 w-5 text-[#FF6B00]" />
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight italic">
                    ORDER UNITS ({order.items.length})
                  </h3>
                </div>

                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between border-b border-zinc-900 pb-6 last:border-none last:pb-0"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative h-20 w-20 bg-black border border-zinc-800 p-1 group-hover:border-[#FF6B00] transition-colors duration-500">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="font-display text-lg font-bold uppercase tracking-tighter group-hover:text-[#FF6B00] transition-colors line-clamp-1">
                            {item.name}
                          </p>
                          <p className="font-mono text-[10px] text-zinc-500 uppercase">
                            QUANTITY: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-xl font-black text-white italic">
                          ₦
                          {(
                            (item.discountedPrice ?? item.price) * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-10 bg-zinc-900" />

                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    <div className="flex justify-between">
                      <span>BASE_VAL:</span>
                      <span className="text-white">
                        ₦{order.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>LOGISTICS_FEE:</span>
                      <span className="text-white">
                        ₦{order.shipping.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t-2 border-dashed border-zinc-900">
                      <span className="font-black text-[#FF6B00]">
                        TOTAL_AMOUNT:
                      </span>
                      <span className="font-display text-4xl font-black text-[#FF6B00] italic">
                        ₦{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- SIDE_PROTOCOLS (RIGHT) --- */}
          <div className="space-y-8 lg:sticky lg:top-12">
            {/* Shipping Card */}
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none">
              <CardHeader className="p-6 border-b border-zinc-900 flex flex-row items-center gap-3">
                <Truck className="h-4 w-4 text-[#FF6B00]" />
                <CardTitle className="font-display text-lg uppercase font-bold tracking-tight">
                  DESTINATION_INFO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 font-sans">
                {[
                  { label: "ENTITY", value: order.shippingInfo.name },
                  { label: "CONTACT_COMMS", value: order.shippingInfo.email },
                  { label: "PHONE_LINK", value: order.shippingInfo.phone },
                  {
                    label: "LOCATION",
                    value: `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}`,
                  },
                ].map((info, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      {info.label}
                    </p>
                    <p className="text-xs font-bold text-zinc-300 uppercase">
                      {info.value}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Receipt Card */}
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none overflow-hidden group">
              <CardHeader className="p-6 border-b border-zinc-900 flex flex-row items-center gap-3">
                <FileText className="h-4 w-4 text-[#FF6B00]" />
                <CardTitle className="font-display text-lg uppercase font-bold tracking-tight">
                  PAYMENT_PROOF
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Link
                  href={order.paymentReceiptUrl}
                  target="_blank"
                  className="relative block aspect-[3/4] w-full bg-black border border-zinc-800 transition-all duration-700 overflow-hidden"
                >
                  <Image
                    src={order.paymentReceiptUrl}
                    alt="Payment Receipt"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#FF6B00] text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                      VIEW IN FULL SCREEN
                    </span>
                  </div>
                </Link>
                <Link href={order.paymentReceiptUrl} target="_blank">
                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-none border-zinc-800 font-black uppercase tracking-widest text-[10px] py-6 hover:bg-[#FF6B00] hover:text-black hover:border-[#FF6B00] transition-all"
                  >
                    VIEW FULLSCREEN{" "}
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none">
              <CardHeader className="p-6 border-b border-zinc-900 flex flex-row items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
                <CardTitle className="font-display text-lg uppercase font-bold tracking-tight">
                  CONTACT SUPPORT
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Link href={`/contact?orderId=${order.id}`} className="block">
                  <Button className="w-full bg-white hover:bg-[#FF6B00] text-black rounded-none font-black uppercase tracking-widest text-[10px] py-6 transition-all">
                    <MessageSquare className="mr-2 h-4 w-4" /> SEND MESSAGE
                  </Button>
                </Link>

                {order.status === "pending" && (
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:text-white hover:bg-red-600 rounded-none font-black uppercase tracking-widest text-[9px] py-6 opacity-40 hover:opacity-100 transition-all"
                    onClick={() => {
                      toast({
                        title: "PROTOCOL_DENIED",
                        description:
                          "Manual cancellation required. Please initiate comms with support.",
                      });
                    }}
                  >
                    CANCEL_ORDER_REQUEST
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-2 opacity-20">
              <Cpu className="h-4 w-4 text-zinc-500" />
              <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-zinc-500 text-center">
                SYSTEM_ID: HI-ER-LOG-{order.id.substring(0, 6)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
