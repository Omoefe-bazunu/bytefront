import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Truck, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trustFeatures } from "@/lib/data";

export default function WhyBytefrontPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-primary font-semibold font-headline">
            Why ByteFront?
          </p>
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mt-2">
            Built on Trust. Powered by Quality.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            We're not just another e-commerce store. We are your dedicated
            partner in acquiring high-quality, verified technology in Nigeria.
            Discover the ByteFront difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {trustFeatures.map((feature, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full inline-block">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <Card className="bg-background shadow-none">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl font-bold font-headline">
                  Still have questions?
                </h2>
                <p className="mt-2 text-muted-foreground max-w-lg">
                  Our team is here to help. Check our frequently asked questions
                  or get in touch with us directly.
                </p>
              </div>
              <div className="flex gap-4 flex-shrink-0">
                <Link href="/faq">
                  <Button size="lg" variant="outline">
                    View FAQs
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="btn-gradient">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center ">
          <h3 className="text-2xl font-semibold font-headline mb-4">
            Our Unwavering Promise
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-center items-center">
            <div className="flex items-center gap-2 font-medium text-muted-foreground justify-center">
              <ShieldCheck className="h-6 w-6 text-green-500" /> Verified
              Importers
            </div>
            <div className="flex items-center gap-2 font-medium text-muted-foreground justify-center">
              <Lock className="h-6 w-6 text-green-500" /> Secure Checkout
            </div>
            <div className="flex items-center gap-2 font-medium text-muted-foreground justify-center">
              <Truck className="h-6 w-6 text-green-500" /> Fast Nationwide
              Delivery
            </div>
            <div className="flex items-center gap-2 font-medium text-muted-foreground justify-center">
              <Headset className="h-6 w-6 text-green-500" /> Customer Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
