import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { FloatingNav } from '@/components/layout/floating-nav';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';

export const metadata: Metadata = {
  title: 'ByteFront Commerce',
  description: 'Premium Laptops and Phones Delivered to Your Doorstep in Nigeria.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <AuthProvider>
          <CartProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
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
