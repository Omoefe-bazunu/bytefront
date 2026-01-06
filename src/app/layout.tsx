import type { Metadata } from "next";
import { Bricolage_Grotesque, Poppins } from "next/font/google"; // Import Next.js fonts
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { FloatingNav } from "@/components/layout/floating-nav";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import Script from "next/script";

// Initialize Bricolage Grotesque (Primary - Headings)
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

// Initialize Poppins (Secondary - Body/UI)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ByteFront Commerce | High-Performance Tech",
  description:
    "Premium Laptops and Phones Delivered to Your Doorstep in Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add font variables to the html tag
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(bricolage.variable, poppins.variable, "dark")}
    >
      <head>
        {/* Tawk.to script remains the same */}
        <Script
          id="tawkto"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6878cd80ec69531912e7402b/1j0bu5g0o';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-white"
        )}
      >
        <AuthProvider>
          <CartProvider>
            <div className="relative flex min-h-dvh flex-col">
              {/* Header now uses Bricolage via font-display classes */}
              <Header />

              <main className="flex-1 bg-background">{children}</main>

              <Footer />
              <FloatingNav />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
