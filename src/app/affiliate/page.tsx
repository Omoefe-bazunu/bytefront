import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart, DollarSign, Copy, CheckCircle } from "lucide-react";

export default function AffiliatePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Affiliate Program</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Join the ByteFront family and earn commissions by promoting our products. It's simple, free, and rewarding.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Affiliate Dashboard</CardTitle>
                <CardDescription>Track your referrals and earnings in one place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <Label htmlFor="referral-link" className="font-semibold">Your Unique Referral Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input id="referral-link" readOnly defaultValue="https://bytefront.com/?ref=AFF123XYZ" />
                    <Button variant="outline" size="icon" aria-label="Copy link">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 text-center">
                  <Card>
                    <CardHeader className="items-center pb-2">
                      <Users className="h-8 w-8 text-primary" />
                      <p className="text-3xl font-bold">12</p>
                      <CardTitle className="text-base font-medium text-muted-foreground">Referred Buyers</CardTitle>
                    </CardHeader>
                  </Card>
                   <Card>
                    <CardHeader className="items-center pb-2">
                      <DollarSign className="h-8 w-8 text-green-500" />
                      <p className="text-3xl font-bold">₦45,750</p>
                      <CardTitle className="text-base font-medium text-muted-foreground">Total Earnings</CardTitle>
                    </CardHeader>
                  </Card>
                   <Card>
                    <CardHeader className="items-center pb-2">
                      <BarChart className="h-8 w-8 text-accent" />
                       <p className="text-3xl font-bold">5.2%</p>
                      <CardTitle className="text-base font-medium text-muted-foreground">Conversion Rate</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                
                <div>
                    <h3 className="font-semibold text-lg font-headline mb-2">Payment Status</h3>
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Last Payout of ₦30,000 sent on Oct 1, 2023.</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Next payout scheduled for Nov 1, 2023.</p>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Become an Affiliate</CardTitle>
                <CardDescription>Complete the form below to get your unique referral link.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" placeholder="Your Full Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" />
                  </div>
                  <Button type="submit" className="w-full btn-gradient">Create Account</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
