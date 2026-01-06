import type { FaqItem, TrustFeature } from "@/lib/types";
import {
  ShieldCheck,
  PackageCheck,
  Ship,
  Star,
  Award,
  Headset,
} from "lucide-react";

export const faqItems: FaqItem[] = [
  {
    question: "Where do your laptops and accessories come from?",
    answer:
      "All laptops and accessories are sourced and tested from verified Chinese suppliers through our local importation partners (Sure Imports) to ensure they meet our quality standards before we ship to your location.",
  },
  {
    question: "Are the laptops and Accessories brand new?",
    answer:
      "The laptops are pre-owned and not brand new, but are refurbished by the Chinese suppliers in their factories to function and look like a brand new laptop with zero defects. The accessories on the other hand are brand new, unused, and come in their original packaging with all manufacturer seals intact.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "All our laptops and accessories take 10 business days to get to our Lagos Office from China. Then nationwide delivery typically takes 1-2 working days depending on your location. Delivery is free for all orders regardless of your location in Nigeria.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes, all laptops and accessories from our China suppliers come with a 90 days (3 months) Warranty.",
  },
  {
    question: "Can I pay on delivery?",
    answer:
      "We currently do not support pay-on-delivery. We accept secure online payment transfer to our Parent Company Account (HIGH-ER ENTERPRISES) to ensure your transaction is safe. You can always query a transaction from our contact page or via WhatsApp. We will be sure to respond within 24 hours.",
  },

  {
    question: "How do I contact ByteFront?",
    answer:
      "You can reach us through our Contact page, send an email to info@higher.com.ng, or chat with us directly on WhatsApp (+2349043970401) for a faster response.",
  },
];

export const trustFeatures: TrustFeature[] = [
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    description:
      "We only source from verified Chinese suppliers and trusted importation partners.",
  },
  {
    icon: PackageCheck,
    title: "Pre-Tested & Verified",
    description:
      "Our gadgets are pre-tested and verified by local partners before being listed for sale.",
  },
  {
    icon: Ship,
    title: "Nationwide Shipping",
    description:
      "We provide clear delivery timelines and fast, reliable shipping across Nigeria.",
  },
  {
    icon: Star,
    title: "Real Customer Reviews",
    description:
      "See genuine reviews from real customers on every single product page.",
  },
  {
    icon: Award,
    title: "Genuine Discounts",
    description:
      "We offer genuine discounts and value for your money, not fake price slashes.",
  },
  {
    icon: Headset,
    title: "Responsive Support",
    description:
      "Our support team is always ready to help via WhatsApp, email, and phone.",
  },
];
