"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Resend } from "resend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { EmailTemplate } from "@/components/EmailTemplates";

const ADMIN_EMAIL = "raniem57@gmail.com";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    setLoading(true);

    try {
      // Save message to Firestore
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      // Send email notification using Resend
      const resend = new Resend(process.env.RESEND_PASSWORD);
      const { error } = await resend.emails.send({
        from: "ByteFront <info@higher.com.ng>",
        to: [ADMIN_EMAIL],
        subject: "New Contact Message from ByteFront",
        react: <EmailTemplate name={name} email={email} message={message} />,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({ title: "Success", description: "Your message has been sent!" });
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Contact ByteFront
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We're here to help! Whether you have a question about a product, an
          order, or our services, feel free to reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Send us a Message
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help you today?"
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-gradient"
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold font-headline">
            Other Ways to Reach Us
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-muted-foreground">
                  For support, sales, and inquiries.
                </p>
                <a
                  href="mailto:support@bytefront.com"
                  className="text-primary hover:underline"
                >
                  info@higher.com.ng
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-muted-foreground">
                  Speak directly with our team.
                </p>
                <a
                  href="tel:+2349043970401"
                  className="text-primary hover:underline"
                >
                  +234 9043970401
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-500/10 text-green-600 p-3 rounded-full">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">WhatsApp</h3>
                <p className="text-muted-foreground">
                  Chat with us for a quick response.
                </p>
                <Link
                  href="https://wa.me/2349043970401"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Start a Chat
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Operating Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 24/7</p>
                <p className="text-muted-foreground">
                  Saturday: 11:00 AM - 11:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
