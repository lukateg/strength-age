import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { toast } from "sonner";
import { isAppError } from "../../convex/utils";

import { type Doc } from "convex/_generated/dataModel";
import { type LucideIcon } from "lucide-react";
import { Sparkles, Star, Crown } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toastError = (error: unknown, message: string) => {
  let errorData = message;
  if (isAppError(error)) {
    errorData = error.data.message;
  }
  toast.error(errorData);
};

export type SubscriptionTier = Doc<"users">["subscriptionTier"] | undefined;

type SubscriptionTierInfo = {
  name: string;
  icon: LucideIcon;
};

export const formatTokenUsageNumber = (num: number): string => {
  if (num >= 1000000) {
    // For millions, show as XM or X.XM
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  } else if (num >= 1000) {
    // For thousands, show as XK or X.XK
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  } else {
    return num.toString();
  }
};

export const formatBytesToMB = (bytes: number): number => {
  const mb = bytes / (1024 * 1024);
  return Math.round(mb * 10) / 10;
};

export const getSubscriptionTierByStripeRecord = (
  customer?: Doc<"lemonSqueezyCustomers"> | null
) => {
  if (!customer || customer.status === "canceled") {
    return "free";
  }
  return customer.subscriptionTier ?? "free";
};

export const getSubscriptionNameByPriceId = (
  priceId?: string
): "free" | "starter" | "pro" => {
  if (priceId === "free") {
    return "free";
  }
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
    return "starter";
  }
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
    return "pro";
  }
  return "free";
};

export const getSubscriptionTierButton = (
  priceId?: string
): SubscriptionTierInfo => {
  if (priceId === "free") {
    return {
      name: "Free",
      icon: Sparkles,
    };
  }
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
    return {
      name: "Starter",
      icon: Star,
    };
  }
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
    return {
      name: "Pro",
      icon: Crown,
    };
  }
  return {
    name: "Free",
    icon: Sparkles,
  };
};
