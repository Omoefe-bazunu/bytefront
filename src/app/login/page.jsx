"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { Eye, EyeOff, Loader2, Terminal, Shield } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid identity format." }),
  password: z
    .string()
    .min(6, { message: "Password protocol requires 6+ characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Authentication Success",
        description: "Identity verified.",
      });
      router.push("/cart");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Check your identity matrix.",
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
            <Shield className="h-10 w-10" />
          </div>
          <CardTitle className="font-display text-3xl font-black uppercase tracking-tighter text-white">
            Account Access
          </CardTitle>
          <CardDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">
            Access your account securely
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                      Identity (Email)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@protocol.com"
                        {...field}
                        className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] focus:ring-0 transition-all text-white h-12 font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex justify-between items-end">
                      <FormLabel className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                        Access Key
                      </FormLabel>
                      {/* --- FORGOT PASSWORD PROTOCOL --- */}
                      <Link
                        href="/forgot-password"
                        className="text-[9px] uppercase font-bold text-zinc-500 hover:text-[#FF6B00] transition-colors tracking-tighter"
                      >
                        FORGOT PASSWORD
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] focus:ring-0 transition-all text-white h-12 font-mono"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-0 h-full text-zinc-600 hover:text-[#FF6B00] hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                  "LOGIN"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col items-center space-y-4">
            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
              Unregistered Identity?{" "}
              <Link
                href="/signup"
                className="text-[#FF6B00] hover:text-white transition-colors"
              >
                Create Account
              </Link>
            </p>
            <div className="flex items-center gap-2 text-zinc-800">
              <Terminal className="h-3 w-3" />
              <span className="text-[8px] uppercase font-bold tracking-[0.4em]">
                Bytefront Security Layer Active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
