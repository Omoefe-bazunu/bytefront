"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Resend } from "resend";
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
import { OrderEmailTemplate } from "@/components/OrderEmailTemplate";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  shippingInfo: ShippingInfo | null;
}

const ACCOUNT_DETAILS = {
  bank: "Kuda Microfinance Bank",
  name: "HIGH-ER ENTERPRISES",
  number: "3002638291",
};

const ADMIN_EMAIL = "raniem57@gmail.com";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const sendNewOrderEmail = async (orderId: string, total: number) => {
    try {
      const resend = new Resend(process.env.RESEND_PASSWORD);
      const { error } = await resend.emails.send({
        from: "ByteFront <info@higher.com.ng>",
        to: [ADMIN_EMAIL],
        subject: `New Order Received: #${orderId.substring(0, 7)}`,
        react: (
          <OrderEmailTemplate
            orderId={orderId}
            total={total}
            shippingInfo={shippingInfo!}
            items={cartItems}
            orderLink={`${window.location.origin}/admin/orders/${orderId}`}
          />
        ),
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error("Failed to send email:", error);
      throw error;
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
      // 1. Upload receipt to Storage
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

      // 3. Send email notification
      await sendNewOrderEmail(orderRef.id, totalAmount);

      // 4. Clear cart
      clearCart();

      // 5. Show success and redirect
      toast({
        title: "Order Placed!",
        description:
          "We've received your order and will verify your payment shortly.",
      });
      router.push("/");
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: error.message || "An unexpected error occurred.",
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
          <div className="p-4 rounded-lg bg-secondary border space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-semibold">{ACCOUNT_DETAILS.bank}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(ACCOUNT_DETAILS.bank)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p className="font-semibold">{ACCOUNT_DETAILS.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(ACCOUNT_DETAILS.name)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-semibold text-lg">
                  {ACCOUNT_DETAILS.number}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(ACCOUNT_DETAILS.number)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center pt-2 border-t mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="font-bold text-xl text-primary">
                  ₦{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

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
