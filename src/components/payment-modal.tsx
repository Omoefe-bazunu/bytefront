"use client";

import { useState, ChangeEvent } from "react";
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
import { Loader2, Copy } from "lucide-react";
import type { ShippingInfo } from "@/app/checkout/page";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  shippingInfo: ShippingInfo | null;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const ACCOUNT_DETAILS = {
  bank: "Kuda Microfinance Bank",
  name: "HIGH-ER ENTERPRISES",
  number: "3002638291",
};

export function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  shippingInfo,
}: PaymentModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { cartItems, subtotal, shipping, clearCart } = useCart();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${text} copied to clipboard.` });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  // ✅ Use Resend API route to send order emails
  const sendNewOrderEmail = async (
    orderId: string,
    totalAmount: number,
    receiptUrl: string,
    shippingInfo: ShippingInfo,
    cartItems: CartItem[]
  ) => {
    try {
      const response = await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          totalAmount,
          userEmail: user?.email,
          customerName: user?.displayName || shippingInfo?.fullName,
          paymentReceiptUrl: receiptUrl,
          shippingInfo,
          cartItems,
        }),
      });

      if (!response.ok) throw new Error("Failed to send order email");
    } catch (error) {
      console.error("Email error:", error);
      toast({
        variant: "destructive",
        title: "Email Notification Failed",
        description:
          "Your order was saved, but we couldn't notify the admin automatically.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!receiptFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a payment receipt.",
      });
      return;
    }

    if (!user || !shippingInfo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User or shipping info is missing.",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload receipt to Firebase Storage
      const receiptRef = ref(
        storage,
        `receipts/${user.uid}/${uuidv4()}-${receiptFile.name}`
      );
      await uploadBytes(receiptRef, receiptFile);
      const receiptUrl = await getDownloadURL(receiptRef);

      // 2. Create order in Firestore
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

      // 3. Send order email via Resend API route
      await sendNewOrderEmail(
        orderRef.id,
        totalAmount,
        receiptUrl,
        shippingInfo,
        cartItems
      );

      // 4. Clear cart & notify user
      clearCart();
      toast({
        title: "Order Placed!",
        description:
          "Your order has been saved. We will verify your payment and process your order.",
      });
      router.push("/");
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Failed to save order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Complete Your Order
          </DialogTitle>
          <DialogDescription>
            Transfer the total amount to the account below and upload your
            receipt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* BANK DETAILS */}
          <div className="p-4 rounded-lg bg-secondary border space-y-3">
            {[
              { label: "Bank Name", value: ACCOUNT_DETAILS.bank },
              { label: "Account Name", value: ACCOUNT_DETAILS.name },
              { label: "Account Number", value: ACCOUNT_DETAILS.number },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b last:border-none pb-2"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-lg">{item.value}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(item.value)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2 border-t mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="font-bold text-xl text-primary">
                  ₦{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* RECEIPT UPLOAD */}
          <div className="space-y-2">
            <Label htmlFor="receipt">Upload Payment Receipt</Label>
            <Input
              id="receipt"
              type="file"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, application/pdf"
            />
            {receiptFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {receiptFile.name}
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          onClick={handleSubmit}
          disabled={loading || !receiptFile}
          className="w-full btn-gradient"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Submit Order"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
