"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Terminal, Key, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid identity format." }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      setSubmitted(true);
      toast({
        title: "Recovery Initiated",
        description: "Recovery link sent to your inbox.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Could not initiate recovery. Verify email.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <Card className="w-full max-w-md bg-zinc-950 border-zinc-900 rounded-none relative z-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]" />

        <CardHeader className="text-center pt-12 pb-8">
          <div className="flex justify-center mb-4 text-[#FF6B00]">
            <Key className="h-10 w-10" />
          </div>
          <CardTitle className="font-display text-3xl font-black uppercase tracking-tighter text-white">
            Account Recovery
          </CardTitle>
          <CardDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">
            Reset your password
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          {!submitted ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@gmail.com"
                          {...field}
                          className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] focus:ring-0 transition-all text-white h-12 font-mono text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-[0.2em] py-6 text-xs"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "RESET"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <p className="text-sm text-zinc-400 font-mono italic">
                Check your email inbox or spam folder for the reset link.
              </p>
              <Link href="/login" className="block">
                <Button className="w-full border border-zinc-800 bg-transparent hover:bg-zinc-900 transition-all rounded-none font-black uppercase tracking-[0.2em] py-6 text-xs">
                  RETURN TO LOGIN
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col items-center space-y-4">
            <Link
              href="/login"
              className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase font-bold tracking-widest hover:text-[#FF6B00] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
            <div className="flex items-center gap-2 text-zinc-800">
              <Terminal className="h-3 w-3" />
              <span className="text-[8px] uppercase font-bold tracking-[0.4em]">
                Bytefront Recovery Protocol
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
