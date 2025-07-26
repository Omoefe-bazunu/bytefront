// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, Loader2 } from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";
import { useAuth } from "@/hooks/use-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "A valid phone number is required"),
  address: z.string().min(10, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

export type ShippingInfo = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { cartItems, subtotal, total, shipping } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);

  const form = useForm<ShippingInfo>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = (values: ShippingInfo) => {
    setShippingInfo(values);
    setIsModalOpen(true);
  };

  if (cartItems.length === 0) {
    router.push("/");
    return null;
  }

  return (
    <>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={total}
        shippingInfo={shippingInfo}
      />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            Checkout
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Shipping and Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Shipping & Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+234 800 123 4567"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Lagos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Lagos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="row-start-1 lg:row-auto">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Your Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md"
                          data-ai-hint={item.aiHint}
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₦{shipping.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full mt-6 btn-gradient"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={form.formState.isSubmitting}
                >
                  <Lock className="mr-2 h-5 w-5" /> Proceed to Payment
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Secure payment via Manual Bank Transfer
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
