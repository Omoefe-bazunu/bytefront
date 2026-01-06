"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

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
  CheckCircle,
  Trash2,
  ExternalLink,
  Terminal,
  Cpu,
  Activity,
  Box,
  Truck,
  ShieldAlert,
  HardDriveDownload,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast({
            variant: "destructive",
            title: "PROTOCOL_ERROR",
            description: "Deployment record not found.",
          });
          router.push("/admin");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router, toast]);

  const handleUpdateStatus = async (status) => {
    if (!order) return;
    setUpdating(true);
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status });
      setOrder((prev) => (prev ? { ...prev, status } : null));
      toast({
        title: "LOGGED: UPDATED",
        description: `Order status set to ${status.toUpperCase()}.`,
        className:
          "bg-[#FF6B00] text-black border-none rounded-none font-black uppercase tracking-widest text-[10px]",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "SYSTEM_ERROR",
        description: "Failed to update record.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      !order ||
      !window.confirm("CONFIRM_PURGE_PROTOCOL? This action is permanent.")
    )
      return;
    setUpdating(true);
    try {
      await deleteDoc(doc(db, "orders", order.id));
      toast({
        title: "LOGGED: PURGED",
        description: "Record removed from system.",
      });
      router.push("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "SYSTEM_ERROR",
        description: "Purge protocol failed.",
      });
    } finally {
      setUpdating(false);
    }
  };

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
          href="/admin"
          className="inline-flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[#FF6B00] transition-colors group"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          RETURN_TO_ADMIN_CONTROL
        </Link>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* --- MAIN MANIFEST (LEFT) --- */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-1.5 w-full bg-zinc-900">
                <div className="h-full bg-[#FF6B00] w-full" />
              </div>

              <CardHeader className="p-8 border-b border-zinc-900">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-[#FF6B00]" />
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        DEPLOYMENT_LOG_FILE
                      </span>
                    </div>
                    <CardTitle className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">
                      #{order.id.substring(0, 10)}
                    </CardTitle>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase">
                      INITIATED:{" "}
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
                    ORDER_UNITS ({order.items.length})
                  </h3>
                </div>

                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between border-b border-zinc-900 pb-6 last:border-none last:pb-0"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative h-20 w-20 bg-black border border-zinc-800 p-1 group-hover:border-[#FF6B00] transition-colors duration-500 grayscale group-hover:grayscale-0">
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
                            QTY_SERIAL: {item.quantity}
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
                      <span>GROSS_VALUE:</span>
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
                        FINAL_PAYLOAD:
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

          {/* --- CONTROL_STACK (RIGHT) --- */}
          <div className="space-y-8 lg:sticky lg:top-12">
            {/* Customer Information */}
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none">
              <CardHeader className="p-6 border-b border-zinc-900 flex flex-row items-center gap-3 bg-zinc-900/20">
                <Truck className="h-4 w-4 text-[#FF6B00]" />
                <CardTitle className="font-display text-lg uppercase font-bold tracking-tight text-white">
                  CLIENT_DATA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 font-sans">
                {[
                  { label: "ENTITY_NAME", value: order.shippingInfo.name },
                  { label: "IDENTITY_EMAIL", value: order.shippingInfo.email },
                  { label: "COMMS_PHONE", value: order.shippingInfo.phone },
                  {
                    label: "GEOLOCATION",
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

            {/* Receipt Review */}
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none overflow-hidden group">
              <CardHeader className="p-6 border-b border-zinc-900 flex flex-row items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-[#FF6B00]" />
                <CardTitle className="font-display text-lg uppercase font-bold tracking-tight">
                  VERIFICATION_PROOF
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Link
                  href={order.paymentReceiptUrl}
                  target="_blank"
                  className="relative block aspect-[3/4] w-full bg-black border border-zinc-800 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden"
                >
                  <Image
                    src={order.paymentReceiptUrl}
                    alt="Payment Receipt"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#FF6B00] text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                      ACTIVATE_SCANNER
                    </span>
                  </div>
                </Link>
                <Link href={order.paymentReceiptUrl} target="_blank">
                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-none border-zinc-800 font-black uppercase tracking-widest text-[10px] py-6 hover:bg-[#FF6B00] hover:text-black hover:border-[#FF6B00] transition-all"
                  >
                    VIEW_SOURCE <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Controls */}
            <Card className="bg-zinc-950 border-2 border-zinc-800 rounded-none shadow-[6px_6px_0px_0px_#FF6B00]">
              <CardHeader className="p-6 border-b border-zinc-900">
                <CardTitle className="font-display text-lg uppercase font-bold tracking-tight">
                  SYSTEM_COMMANDS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {order.status === "pending" && (
                  <Button
                    className="w-full bg-[#FF6B00] hover:bg-white text-black rounded-none font-black uppercase tracking-widest text-[10px] py-7 transition-all"
                    onClick={() => handleUpdateStatus("fulfilled")}
                    disabled={updating}
                  >
                    {updating ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    APPROVE_FULFILLMENT
                  </Button>
                )}

                {order.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    className="w-full rounded-none border-zinc-800 font-black uppercase tracking-widest text-[10px] py-6 hover:bg-red-600 hover:text-white transition-all"
                    onClick={() => handleUpdateStatus("cancelled")}
                    disabled={updating}
                  >
                    <Ban className="mr-2 h-4 w-4" /> ABORT_PROTOCOL
                  </Button>
                )}

                <Button
                  variant="destructive"
                  className="w-full rounded-none font-black uppercase tracking-widest text-[10px] py-6 grayscale hover:grayscale-0"
                  onClick={handleDelete}
                  disabled={updating}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> PURGE_RECORD
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-2 opacity-20">
              <Cpu className="h-4 w-4 text-zinc-500" />
              <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-zinc-500 text-center">
                ADMIN_LEVEL_ACCESS_GRANTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal Helper Icons
function Loader2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
