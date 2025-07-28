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
    question: "Where do your laptops and phones come from?",
    answer:
      "All brand new laptops and phones are sourced from verified Chinese suppliers and tested by our local importation partners (Sure Imports) to ensure they meet our high-quality standards, While all Pre-owned laptops come from the UK with our partner in Lagos (Re-Loaded Computers) also inspecting within 5 days for defects before we ship to your location.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Brand new laptops and Phones take 10 business days to get to our Lagos Office from China. Then nationwide delivery typically takes 2-5 working days depending on your location. Pre-owned laptops take 5 days for us to inspect and monitor the laptop to be sure there's no performance issues or defect before we ship to your location.Then nationwide delivery typically takes 2-5 days depending on your location.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes, all Brand New laptops and Smartphones from our China suppliers come with a Warranty. Laptops have 90 days Warranty and Smartphones have 1 year Warranty. UK-USED laptops on the otherhand, only have a two weeks (14 days) Warranty. That is why we take 5 days to inspect before sending. But rest assured no product will be sent to you with any known defect or issues.",
  },
  {
    question: "Can I pay on delivery?",
    answer:
      "We currently do not offer pay-on-delivery. We accept secure online payments transfer to our Parent Company Account (HIGH-ER ENTERPRISES) to ensure your transaction is safe. You can always query a transaction from on our contact page or via WhatsApp. We will be sure to respond within 24 hours.",
  },

  // {
  //   question: "How can I join the affiliate program?",
  //   answer:
  //     "Simply navigate to our affiliate page, fill out the sign-up form, and you'll get a unique referral link to start earning commissions from your referrals.",
  // },
  {
    question: "How do I contact ByteFront?",
    answer:
      "You can reach us through our Contact page, send an email to info@higher.com.ng, or chat with us directly on WhatsApp(+2349043970401) for a faster response.",
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
