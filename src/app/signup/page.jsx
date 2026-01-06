"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
import { Eye, EyeOff, Loader2, UserPlus, Terminal } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid identity format. Provide a valid email." }),
  password: z
    .string()
    .min(6, { message: "Security protocol requires at least 6 characters." }),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Registration Successful",
        description: "Account created successfully.",
      });
      router.push("/cart");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "System error during account creation.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 selection:bg-[#FF6B00] selection:text-white">
      {/* Carbon Fibre Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <Card className="w-full max-w-md bg-zinc-950 border-zinc-900 rounded-none relative z-10 overflow-hidden shadow-2xl">
        {/* Cyber Orange Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]" />

        <CardHeader className="text-center pt-12 pb-8">
          <div className="flex justify-center mb-4 text-[#FF6B00]">
            <UserPlus className="h-10 w-10" />
          </div>
          <CardTitle className="font-display text-3xl font-black uppercase tracking-tighter text-white">
            Register Account
          </CardTitle>
          <CardDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">
            Create New User Account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
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
                        placeholder="identity@protocol.com"
                        {...field}
                        className="bg-black border-zinc-800 rounded-none focus:border-[#FF6B00] focus:ring-0 transition-all text-white h-12 font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-bold text-red-500 tracking-tighter" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                      Secure Password
                    </FormLabel>
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
                    <FormMessage className="text-[10px] uppercase font-bold text-red-500 tracking-tighter" />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-white hover:text-black transition-all rounded-none font-black uppercase tracking-[0.2em] py-6 text-xs"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Register Identity"
                  )}
                </Button>

                <p className="text-[9px] text-zinc-600 uppercase text-center leading-relaxed px-4">
                  By clicking register, you agree to the Bytefront Gadgets{" "}
                  <Link
                    href="/terms"
                    className="text-zinc-400 hover:text-[#FF6B00] underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-zinc-400 hover:text-[#FF6B00] underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </Form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col items-center space-y-4">
            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
              Existing Identity?{" "}
              <Link
                href="/login"
                className="text-[#FF6B00] hover:text-white transition-colors"
              >
                Login
              </Link>
            </p>
            <div className="flex items-center gap-2 text-zinc-800">
              <Terminal className="h-3 w-3" />
              <span className="text-[8px] uppercase font-bold tracking-[0.4em]">
                Bytefront Global Sourcing Network
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
