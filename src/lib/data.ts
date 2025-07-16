import type { Review, FaqItem, TrustFeature } from "@/lib/types";
import {
  ShieldCheck,
  PackageCheck,
  Ship,
  Star,
  Award,
  Headset,
} from "lucide-react";

export const reviews: Review[] = [
  {
    id: "rev_1",
    productId: "prod_1",
    author: "Tunde Adebayo",
    rating: 5,
    comment:
      "This laptop is a beast! Handles my video editing projects flawlessly.",
    date: "2023-10-15",
  },
  {
    id: "rev_2",
    productId: "prod_3",
    author: "Chiamaka Nwosu",
    rating: 5,
    comment:
      "The camera on this phone is absolutely insane. Worth every penny!",
    date: "2023-10-12",
  },
  {
    id: "rev_3",
    productId: "prod_2",
    author: "David Okon",
    rating: 4,
    comment:
      "Great for work and travel. So light I barely notice it in my bag.",
    date: "2023-10-10",
  },
  {
    id: "rev_4",
    productId: "prod_4",
    author: "Fatima Bello",
    rating: 5,
    comment: "Amazing phone for the price. The battery lasts forever.",
    date: "2023-10-08",
  },
  {
    id: "rev_5",
    productId: "prod_1",
    author: "Emeka Obi",
    rating: 4,
    comment:
      "Fast delivery and excellent customer service. The laptop is perfect.",
    date: "2023-10-05",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Where do your laptops and phones come from?",
    answer:
      "All brand new laptops and phones are sourced from verified Chinese suppliers and tested by our local importation partners (Sure Imports) to ensure they meet our high-quality standards, While all Pre-owned laptops come from the UK with our partners also inspecting within 5 days for defects before we ship to your location.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Brand new laptops and Phones take 10 business days to get to our Lagos Office from China. Then nationwide delivery typically takes 2–5 working days. You will see a more precise estimate at checkout based on your location.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes, some devices include a limited warranty. Please check the product description page for specific warranty information for each item.",
  },
  {
    question: "Can I pay on delivery?",
    answer:
      "We currently do not offer pay-on-delivery. We accept secure online payments transfer to our Parent Company Account (HIGH-ER ENTERPRISES) to ensure your transaction is safe.",
  },
  {
    question: "How can I join the affiliate program?",
    answer:
      "Simply navigate to our affiliate page, fill out the sign-up form, and you'll get a unique referral link to start earning commissions from your referrals.",
  },
  {
    question: "How do I contact ByteFront?",
    answer:
      "You can reach us through our Contact page, send an email to info@higher.com.ng, or chat with us directly on WhatsApp for a faster response.",
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
