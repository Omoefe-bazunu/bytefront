"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, ShieldCheck, Cpu, Terminal, ChevronRight } from "lucide-react";
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
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(3, "Full legal name is required"),
  email: z.string().email("Invalid identity format"),
  phone: z.string().min(10, "A valid phone protocol is required"),
  address: z.string().min(10, "Full deployment address is required"),
  city: z.string().min(2, "City designation required"),
  state: z.string().min(2, "State designation required"),
});

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { cartItems, subtotal, total, shipping } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);

  const form = useForm({
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

  const onSubmit = (values) => {
    setShippingInfo(values);
    setIsModalOpen(true);
  };

  // ✅ Updated useEffect: Only redirect if the cart is empty AND the modal is closed.
  // This prevents the page from redirecting while the Success Modal is still visible.
  useEffect(() => {
    if (cartItems.length === 0 && !isModalOpen) {
      router.push("/cart");
    }
  }, [cartItems, router, isModalOpen]);

  if (cartItems.length === 0 && !isModalOpen) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={total}
        shippingInfo={shippingInfo}
      />

      {/* --- HEADER --- */}
      <section className="pt-8 pb-12 border-b border-zinc-900 bg-zinc-950">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
              <ShieldCheck className="h-3 w-3" /> Secure Deployment Protocol
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Final <span className="text-zinc-700">Checkout</span>
            </h1>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-bold">
              Confirm your shipping details
            </p>
          </div>
        </div>
      </section>

      <main className="container max-w-screen-xl px-4 py-16 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* --- DEPLOYMENT DETAILS (SHIPPING) --- */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-[#FF6B00]" />
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
                SHIPPING DETAILS
              </h2>
            </div>

            <Card className="bg-zinc-950 border-zinc-900 rounded-none shadow-none">
              <CardContent className="p-8">
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
                          <FormLabel className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                            Legal Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-12"
                              placeholder="Full Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-12 font-mono"
                                placeholder="user@protocol.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                              Phone Number (WhatsApp Preferred)
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-12 font-mono"
                                placeholder="+234"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                            Physical Destination
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-12"
                              placeholder="Street Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-12"
                                placeholder="Lagos"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                              State Region
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] h-12"
                                placeholder="Lagos"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* --- ORDER SUMMARY (STICKY) --- */}
          <div className="row-start-1 lg:row-auto lg:sticky lg:top-32">
            <Card className="bg-zinc-950 border-zinc-900 rounded-none overflow-hidden">
              <div className="bg-[#FF6B00] py-1 px-4 text-black text-[10px] font-black uppercase tracking-[0.2em]">
                ORDER SUMMARY
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="font-display text-2xl font-bold uppercase tracking-tighter">
                  Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 bg-black border border-zinc-900 flex-shrink-0">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-tight group-hover:text-[#FF6B00] transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            QTY {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-mono text-sm">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-zinc-900" />

                <div className="space-y-3 font-mono text-xs uppercase tracking-tighter">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="text-white">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Logistics Fee</span>
                    <span className="text-white">
                      ₦{shipping.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Total Procurement
                  </span>
                  <span className="font-display text-4xl font-black text-[#FF6B00]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-[0.2em] py-7 mt-4 text-xs"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={form.formState.isSubmitting}
                >
                  <Lock className="mr-2 h-4 w-4" /> Finalize & Pay
                </Button>

                <div className="flex items-center justify-center gap-2 pt-4 opacity-40">
                  <Terminal className="h-3 w-3" />
                  <p className="text-[9px] uppercase font-bold tracking-widest">
                    Protocol: Manual Bank Transfer Only
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* --- FOOTER STATUS --- */}
      <section className="py-12 border-t border-zinc-900 bg-black">
        <div className="container max-w-screen-xl px-4 mx-auto flex justify-center">
          <div className="flex items-center gap-4 text-zinc-800">
            <Cpu className="h-3 w-3" />
            <span className="text-[9px] uppercase font-bold tracking-[0.4em]">
              Hardware Deployment Hub active
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
