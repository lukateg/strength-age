import { LIMITATIONS } from "./limitations";
import { formatTokenUsageNumber } from "./utils";

export interface SubscriptionPlan {
  id: string;
  name: string;
  title: string; // For subscription page compatibility
  description: string;
  price: string;
  // yearlyPrice: number;
  buttonText: string;
  features: string[];
  popular?: boolean;
  isPopular?: boolean; // For subscription page compatibility
  priceId: string;
  // stripePriceIds: {
  //   monthly: string;
  //   yearly: string;
  // };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    title: "Free",
    description: "Perfect for individuals just getting started",
    price: "Free",
    buttonText: "Use for Free",
    features: [
      `Create up to ${LIMITATIONS.free.classes} classes`,
      `Up to ${Math.round(LIMITATIONS.free.materials / (1024 * 1024))} MB of study materials`,
      `${formatTokenUsageNumber(LIMITATIONS.free.tokens)} tokens for test generation monthly`,
      "Share test results through read-only links",
    ],
    popular: false,
    isPopular: true,
    priceId: "free",
  },
  {
    id: "starter",
    name: "Starter",
    title: "Starter",
    description: "For educators with growing needs",
    price: "6.99",
    // yearlyPrice: 76, // 7 * 12 * 0.9 (10% discount)
    buttonText: "Use Starter",
    features: [
      `Create up to ${LIMITATIONS.starter.classes} classes`,
      `Up to ${Math.round(LIMITATIONS.starter.materials / (1024 * 1024))} MB of study materials`,
      `${formatTokenUsageNumber(LIMITATIONS.starter.tokens)} tokens for test generation monthly`,
      "Share test results through read-only links",
      "Let other people take your tests",
    ],
    popular: true,
    isPopular: true,
    priceId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT!,
  },
  {
    id: "pro",
    name: "Pro",
    title: "Pro",
    description: "For advanced educational needs",
    price: "14.99",
    // yearlyPrice: 162, // 15 * 12 * 0.9 (10% discount)
    buttonText: "Go Pro",
    features: [
      `Create up to ${LIMITATIONS.pro.classes} classes`,
      `Up to ${Math.round(LIMITATIONS.pro.materials / (1024 * 1024))} MB of study materials`,
      `${formatTokenUsageNumber(LIMITATIONS.pro.tokens)} tokens for test generation monthly`,
      "Share test results through read-only links",
      "Let other people take your tests",
      // "Collaborative classes with shared materials",
    ],
    popular: false,
    isPopular: false,
    priceId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT!,
  },
];

export const YEARLY_DISCOUNT = 0.1; // 10% discount for yearly billing
export const FREE_PRICE_ID = "free"; // Special priceId to identify unsubscribe action
