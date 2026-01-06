"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart"; // ✅ Added useCart
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/laptops", label: "Laptops" },
  { href: "/accessories", label: "Accessories" },
  { href: "/why-bytefront", label: "Why Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const ADMIN_EMAIL = "raniem57@gmail.com";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cartItems } = useCart(); // ✅ Get cart items
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);

  // Calculate total items in cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Session Terminated",
        description: "Securely logged out of Bytefront.",
      });
      router.push("/");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Logout failed.",
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex justify-center w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-black border-zinc-800 py-3"
          : "bg-zinc-950 border-zinc-900 py-5"
      )}
    >
      <div className="container flex h-12 justify-between items-center max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Logo - Bricolage Grotesque */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl font-extrabold tracking-tighter text-white ">
            Bytefront
          </span>
        </Link>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-1">
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* ✅ Mobile Cart Indicator */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF6B00] text-black text-[9px] font-black h-4 w-4 flex items-center justify-center border border-black leading-none">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-400">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black border-l border-zinc-800 text-white w-full p-0 rounded-none"
            >
              <SheetHeader className="p-6 border-b border-zinc-900 text-left">
                <SheetTitle className="font-display text-lg font-bold tracking-widest text-zinc-100">
                  Bytefront
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full font-sans">
                <nav className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-6 py-5 text-sm uppercase tracking-widest border-b border-zinc-900 transition-colors",
                        pathname === link.href
                          ? "text-[#FF6B00] bg-zinc-900/50"
                          : "text-zinc-500 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto p-6 flex flex-col gap-3">
                  {!user ? (
                    <Link href="/login" className="w-full">
                      <Button className="w-full bg-white text-black hover:bg-[#FF6B00] hover:text-white transition-colors rounded-none font-bold tracking-widest uppercase text-xs">
                        Establish Identity
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="border-zinc-800 text-zinc-400 rounded-none uppercase text-xs tracking-widest hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-sans text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-200",
                pathname === link.href
                  ? "text-[#FF6B00] border-b-2 border-[#FF6B00] pb-1"
                  : "text-zinc-500 hover:text-zinc-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop UI Icons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-[#FF6B00] hover:bg-zinc-900 rounded-none relative" // ✅ Added relative
            >
              <ShoppingCart className="h-4 w-4" />
              {/* ✅ Desktop Cart Indicator */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-black text-[9px] font-black h-4 w-4 flex items-center justify-center border border-black leading-none">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-[#FF6B00] hover:bg-zinc-900 rounded-none"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-black border border-zinc-800 rounded-none text-zinc-300 p-0 font-sans shadow-2xl"
            >
              {loading ? (
                <DropdownMenuLabel className="p-4 text-[10px] uppercase tracking-widest text-zinc-500">
                  Syncing Node...
                </DropdownMenuLabel>
              ) : user ? (
                <>
                  <DropdownMenuLabel className="px-4 py-4 bg-zinc-950 border-b border-zinc-900">
                    <p className="text-[10px] uppercase text-zinc-600 font-black tracking-widest">
                      Authorized User
                    </p>
                    <p className="text-xs text-white truncate font-medium mt-1">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <div className="p-1">
                    <DropdownMenuItem
                      asChild
                      className="focus:bg-zinc-900 rounded-none cursor-pointer py-2"
                    >
                      <Link
                        href="/orders"
                        className="w-full text-xs uppercase tracking-tighter"
                      >
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    {user.email === ADMIN_EMAIL && (
                      <DropdownMenuItem
                        asChild
                        className="focus:bg-zinc-900 rounded-none cursor-pointer py-2"
                      >
                        <Link
                          href="/admin"
                          className="w-full text-xs uppercase tracking-tighter text-[#FF6B00]"
                        >
                          System Control
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-zinc-900 my-1" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 focus:bg-red-950/40 focus:text-red-400 rounded-none cursor-pointer text-xs uppercase tracking-tighter py-2"
                    >
                      <LogOut className="mr-2 h-3 w-3" /> Terminate
                    </DropdownMenuItem>
                  </div>
                </>
              ) : (
                <div className="p-1">
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-zinc-900 rounded-none cursor-pointer text-xs uppercase tracking-tighter py-2"
                  >
                    <Link href="/login">Log In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-zinc-900 rounded-none cursor-pointer text-xs uppercase tracking-tighter py-2"
                  >
                    <Link href="/signup">Register</Link>
                  </DropdownMenuItem>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
