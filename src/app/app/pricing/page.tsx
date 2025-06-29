"use client";

import { useState } from "react";
import { PricingCard, type PricingCardProps } from "./components/pricing-card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserContext } from "@/providers/user-provider";
import {
  SUBSCRIPTION_PLANS,
  YEARLY_DISCOUNT,
  FREE_PRICE_ID,
} from "@/lib/constants";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const { user } = useUserContext();
  const stripePaymentAction = useAction(api.stripe.handleStripeCheckout);

  const toggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly");
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      const url = await stripePaymentAction({
        priceId,
        redirectRootUrl: window.location.origin,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error processing subscription change:", error);
    }
  };

  const pricingPlans: PricingCardProps[] = SUBSCRIPTION_PLANS.map((plan) => ({
    name: plan.name,
    description: plan.description,
    price: plan.price,
    billingPeriod,
    features: plan.features,
    buttonText:
      user.data?.subscriptionTier === plan.id
        ? "Current Plan"
        : plan.id === "free" && user.data?.subscriptionTier !== "free"
          ? "Unsubscribe"
          : plan.id === "free"
            ? "Get Started"
            : plan.id === "starter"
              ? "Upgrade Now"
              : "Go Pro",
    buttonVariant: plan.id === "free" ? "outline" : "default",
    popular: plan.popular,
    isActive: user.data?.subscriptionTier === plan.id,
    disabled: user.data?.subscriptionTier === plan.id,
    onClick: async () =>
      await handleSubscribe(
        billingPeriod === "monthly" ? plan.priceId : plan.priceId
      ),
  }));

  return (
    <div className="mx-auto container p-6 space-y-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Choose the plan that works best for your educational needs
          </p>
        </div>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Free trial
        </Button>
      </div>

      <div className="space-y-10">
        <div className="text-center">
          <div className="flex items-center justify-center mt-8 space-x-4">
            <span
              className={`text-sm ${billingPeriod === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch
              checked={billingPeriod === "yearly"}
              onCheckedChange={toggleBillingPeriod}
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={`text-sm flex items-center gap-1 ${billingPeriod === "yearly" ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              Yearly
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Save 10%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          All plans include:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            "AI-powered test generation",
            "Responsive support",
            "Browser-based testing",
            "Regular feature updates",
            "Secure data storage",
            "Multiple test formats",
          ].map((feature) => (
            <div key={feature} className="flex items-center space-x-2 p-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 p-6 bg-card rounded-lg border border-border max-w-3xl mx-auto">
        <h3 className="text-xl font-medium text-foreground mb-2">
          Need a custom solution?
        </h3>
        <p className="text-muted-foreground mb-4">
          Contact us for custom pricing options designed for larger institutions
          or specialized educational needs.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
}
