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
    // yearlyPrice: 0,
    buttonText: "Use for Free",
    features: [
      "1 class with up to 3 lessons per class",
      "Up to 50 MB of study materials",
      "Generate up to 3 tests total",
      "Maximum of 3 active tests",
      "Each test can use up to 30 pages of input",
      "Share test results through read-only links",
    ],
    popular: false,
    isPopular: true,
    priceId: "free",
    // stripePriceIds: {
    //   monthly: "free",
    //   yearly: "free",
    // },
  },
  {
    id: "starter",
    name: "Starter",
    title: "Starter",
    description: "For educators with growing needs",
    price: "7",
    // yearlyPrice: 76, // 7 * 12 * 0.9 (10% discount)
    buttonText: "Switch to Starter",
    features: [
      "Up to 3 classes with 10 lessons each",
      "Up to 250 MB of study materials",
      "Generate up to 20 tests per month",
      "Up to 10 active tests at any time",
      "Each test can use up to 50 pages of input",
      "Test results can be shared and taken by others",
    ],
    popular: true,
    isPopular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
  },
  {
    id: "pro",
    name: "Pro",
    title: "Pro",
    description: "For advanced educational needs",
    price: "15",
    // yearlyPrice: 162, // 15 * 12 * 0.9 (10% discount)
    buttonText: "Switch to Pro",
    features: [
      "5 or more classes with up to 20 lessons each",
      "500 MB or more of study materials",
      "Generate unlimited tests",
      "Up to 30 active tests at a time",
      "Each test can use up to 100 pages of input",
      "Collaborative classes with shared materials",
      "Collaborative editing of test results",
    ],
    popular: false,
    isPopular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  },
];

export const YEARLY_DISCOUNT = 0.1; // 10% discount for yearly billing
export const FREE_PRICE_ID = "free"; // Special priceId to identify unsubscribe action
