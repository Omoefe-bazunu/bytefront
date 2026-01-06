"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex justify-center items-center min-h-screen">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button className="btn-gradient">Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
