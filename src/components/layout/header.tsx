"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "/laptops", label: "Laptops" },
  { href: "/smartphones", label: "Smartphones" },
  { href: "/why-bytefront", label: "Why Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/affiliate", label: "Affiliate" },
];

const ADMIN_EMAIL = "raniem57@gmail.com";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "There was an error logging you out. Please try again.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex justify-evenly items-center w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 justify-center items-center max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Mobile Nav Trigger */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex items-center justify-center rounded-md"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pl-1 pr-0 pt-9">
              <SheetHeader className="px-7">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Link href="/" className="flex items-center">
                  <Logo className="mr-2 h-6 w-6" />
                  <span className="font-bold font-headline">ByteFront</span>
                </Link>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <nav className="mt-8 flex flex-col gap-2 px-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                        pathname === link.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 hidden sm:inline-block" />
            <span className="hidden font-bold sm:inline-block font-headline">
              ByteFront
            </span>
          </Link>
        </div>

        {/* Mobile Logo (centered) */}
        <div className="flex-1 flex justify-center md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold font-headline">ByteFront</span>
          </Link>
        </div>

        {/* Desktop Nav (centered) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {loading ? (
                <DropdownMenuLabel>Loading...</DropdownMenuLabel>
              ) : user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        My Account
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.email === ADMIN_EMAIL && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Log In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
