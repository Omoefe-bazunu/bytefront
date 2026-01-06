import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import type { ShippingInfo } from "@/app/checkout/page";

export type Spec = {
  key: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  brand: string;
  category: "Laptops" | "Smartphones" | "Accessories";
  images: string[];
  aiHint: string;
  video?: string;
  specs: string; // Changed from Record<string, string>
  isFeatured?: boolean;
  isNew?: boolean;
  createdAt?: Timestamp;
};

export type CartItem = Product & {
  quantity: number;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  productId?: string; // Optional
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TrustFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Order = {
  id: string;
  userId: string;
  shippingInfo: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentReceiptUrl: string;
  status: "pending" | "fulfilled" | "cancelled";
  createdAt: Timestamp;
};
