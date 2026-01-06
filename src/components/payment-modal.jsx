"use client";

import { useState, useEffect } from "react"; // ✅ Added useEffect
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import {
  Loader2,
  Copy,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowUpRight,
  HardDriveDownload,
} from "lucide-react";

const ACCOUNT_DETAILS = {
  bank: "Kuda Microfinance Bank",
  name: "HIGH-ER ENTERPRISES",
  number: "3002638291",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function PaymentModal({ isOpen, onClose, totalAmount, shippingInfo }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { cartItems, subtotal, shipping, clearCart } = useCart();

  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");

  // ✅ Auto-close logic
  useEffect(() => {
    let timer;
    if (status === "success") {
      timer = setTimeout(() => {
        handleModalClose();
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [status]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "PROTOCOL: COPIED",
      className:
        "bg-[#FF6B00] text-black border-none rounded-none font-sans font-black uppercase tracking-widest text-[10px]",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "SYSTEM OVERLOAD",
          description: "Payload exceeds 5MB limit.",
          className: "rounded-none uppercase font-bold",
        });
        e.target.value = "";
        setReceiptFile(null);
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!receiptFile || !user || !shippingInfo) return;
    setLoading(true);
    try {
      const fileExt = receiptFile.name.split(".").pop();
      const fileName = `receipts/${user.uid}/${uuidv4()}.${fileExt}`;
      const receiptRef = ref(storage, fileName);
      await uploadBytes(receiptRef, receiptFile);
      const receiptUrl = await getDownloadURL(receiptRef);

      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        shippingInfo,
        items: cartItems,
        subtotal,
        shipping,
        total: totalAmount,
        paymentReceiptUrl: receiptUrl,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderRef.id,
          totalAmount,
          userEmail: user?.email,
          customerName: user?.displayName || shippingInfo?.fullName,
          paymentReceiptUrl: receiptUrl,
          shippingInfo,
          cartItems,
        }),
      });

      clearCart();
      setStatus("success");
    } catch (error) {
      console.error("Order Submission Error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    const isSuccess = status === "success";

    // UI Cleanup
    setStatus("idle");
    setReceiptFile(null);
    onClose();

    // ✅ Return to cart if successful
    if (isSuccess) {
      router.push("/cart");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] bg-black border-zinc-900 border-2 rounded-none p-0 overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] outline-none">
        <div className="flex flex-col max-h-[90vh]">
          {/* --- IDLE STATE --- */}
          {status === "idle" && (
            <>
              <div className="h-1.5 w-full bg-zinc-900 flex-shrink-0">
                <div className="h-full bg-[#FF6B00] w-1/3 animate-pulse" />
              </div>

              <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <DialogHeader className="text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#FF6B00] p-1.5">
                      <ShieldCheck className="h-4 w-4 text-black" />
                    </div>
                    <span className="font-sans text-[9px] font-black tracking-[0.3em] text-[#FF6B00] uppercase">
                      Payment Protocol v4.0
                    </span>
                  </div>
                  <DialogTitle className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
                    Confirm <span className="text-zinc-700">Payment</span>
                  </DialogTitle>
                  <DialogDescription className="font-sans text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-2">
                    Manual bank verification required.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-6">
                  {/* Industrial Bank Details */}
                  <div className="bg-zinc-950 border border-zinc-900 p-5 space-y-4 relative">
                    {[
                      { label: "ENTITY_BANK", value: ACCOUNT_DETAILS.bank },
                      { label: "ENTITY_NAME", value: ACCOUNT_DETAILS.name },
                      { label: "SERIAL_NUM", value: ACCOUNT_DETAILS.number },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-end border-b border-zinc-900 pb-2 last:border-none"
                      >
                        <div className="overflow-hidden">
                          <span className="font-mono text-[8px] font-bold uppercase text-zinc-600 tracking-widest">
                            {item.label}
                          </span>
                          <p className="font-sans text-sm font-black text-white truncate">
                            {item.value}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-[#FF6B00]"
                          onClick={() => handleCopy(item.value)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}

                    <div className="pt-4 border-t-2 border-zinc-900 border-dashed">
                      <span className="font-mono text-[9px] font-bold text-[#FF6B00] uppercase tracking-widest">
                        REQUIRE_TOTAL
                      </span>
                      <p className="font-display text-4xl font-black text-white">
                        ₦{totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="receipt"
                      className="font-sans text-[10px] font-black uppercase tracking-widest text-zinc-500"
                    >
                      TRANSMISSION_RECEIPT.PDF
                    </Label>
                    <div className="relative group">
                      <Input
                        id="receipt"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        className="rounded-none border-zinc-800 bg-zinc-950 text-white h-auto py-3.5 file:hidden cursor-pointer focus:border-[#FF6B00] transition-all"
                      />
                      <HardDriveDownload className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-hover:text-[#FF6B00] transition-colors pointer-events-none" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || !receiptFile}
                  className="w-full h-14 bg-[#FF6B00] hover:bg-white text-black rounded-none font-display text-xl font-black uppercase italic transition-all disabled:grayscale disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <span className="flex items-center gap-2">
                      SUBMIT <ArrowUpRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* --- SUCCESS STATE --- */}
          {status === "success" && (
            <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 relative">
              <div className="border-2 border-[#FF6B00] p-6 mb-8 grayscale hover:grayscale-0 transition-all duration-700 bg-zinc-950 cursor-help">
                <CheckCircle2 className="h-16 w-16 text-[#FF6B00]" />
              </div>
              <h2 className="font-display text-4xl font-black text-white uppercase tracking-tighter italic mb-4">
                Order <span className="text-[#FF6B00]">Submitted</span>
              </h2>
              <p className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-10 leading-relaxed px-4">
                Order Submitted. A representative will contact you within 30
                minutes to verify payment and finalize delivery details.
              </p>
              <Button
                onClick={handleModalClose}
                className="w-full bg-white text-black h-12 rounded-none font-black uppercase tracking-[0.2em] text-xs hover:bg-[#FF6B00] transition-colors"
              >
                Close
              </Button>

              {/* ✅ Industrial Auto-close Progress Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-zinc-900 w-full">
                <div
                  className="h-full bg-[#FF6B00] transition-all duration-[10000ms] ease-linear"
                  style={{ width: isOpen ? "0%" : "100%" }} // Simple visual trigger
                />
              </div>
            </div>
          )}

          {/* --- ERROR STATE --- */}
          {status === "error" && (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="bg-red-600/10 border border-red-600 p-6 mb-8">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
              <h2 className="font-display text-3xl font-black text-white uppercase italic mb-4">
                Submission <span className="text-red-600">Error</span>
              </h2>
              <p className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-10">
                An error occured while submitting.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={() => setStatus("idle")}
                  className="w-full bg-white text-black h-12 rounded-none font-black uppercase tracking-widest text-xs"
                >
                  Retry Submission
                </Button>
                <Button
                  onClick={handleModalClose}
                  variant="ghost"
                  className="text-zinc-700 uppercase font-black text-[9px] tracking-widest"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
