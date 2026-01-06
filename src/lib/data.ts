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
      "Our hardware is sourced from two primary hubs: China and Nigeria. Laptops from China are sourced through our local importation partners (Sure Imports), while our Nigerian stock is sourced directly from our verified Lagos supplier (Reloaded Tech) to ensure high-standard UK-used quality.",
  },
  {
    question: "Are the laptops and accessories brand new?",
    answer:
      "Laptops from our China suppliers are professionally refurbished to function and look brand new with zero defects. Laptops from our Lagos suppliers are premium UK-used units. All accessories, however, are 100% brand new, unused, and come in their original factory-sealed packaging.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery timelines depend on the source of the unit. Laptops from China take 10 days to reach our Lagos office, then 1-2 working days to reach your location. Laptops from our Lagos suppliers are delivered within 1-2 working days nationwide. Shipping is free for all orders regardless of your location in Nigeria.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes, we provide technical coverage for all units. Laptops from our China suppliers come with a 90-day (3-month) warranty. Laptops sourced from our Lagos suppliers come with a 1-month warranty.",
  },
  {
    question: "Can I pay on delivery?",
    answer:
      "We currently do not support pay-on-delivery. We accept secure online payment transfers to our Parent Company Account (HIGH-ER ENTERPRISES) to ensure your transaction is safe. You can always query a transaction from our contact page or via WhatsApp, and we will respond in 30 minutes or less.",
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
