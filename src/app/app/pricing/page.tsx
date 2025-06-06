"use client";

import { useState } from "react";
import { PricingCard } from "./components/pricing-card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserContext } from "@/providers/user-provider";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const { user } = useUserContext();
  const stripePaymentAction = useAction(api.stripe.handleStripeCheckout);

  const toggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly");
  };

  const discount = 0.1; // 10% discount for yearly billing

  const handleSubscribe = async (priceId: string) => {
    console.log("handleSubscribe", priceId);
    try {
      const url = await stripePaymentAction({
        priceId,
        redirectRootUrl: window.location.origin,
        // cancelUrl: `${window.location.origin}/app/pricing`,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

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
          <PricingCard
            name="Free"
            description="Perfect for individuals just getting started"
            price={billingPeriod === "monthly" ? 0 : 0}
            billingPeriod={billingPeriod}
            features={[
              "1 class with up to 3 lessons per class",
              "Up to 50 MB of study materials",
              "Generate up to 3 tests total",
              "Maximum of 3 active tests",
              "Each test can use up to 30 pages of input",
              "Share test results through read-only links",
            ]}
            buttonText={
              user?.subscriptionTier === "free" ? "Current Plan" : "Get Started"
            }
            buttonVariant="outline"
            isActive={user?.subscriptionTier === "free"}
            disabled={user?.subscriptionTier === "free"}
          />

          <PricingCard
            name="Starter"
            description="For educators with growing needs"
            price={
              billingPeriod === "monthly"
                ? 7
                : Math.round(7 * 12 * (1 - discount))
            }
            billingPeriod={billingPeriod}
            features={[
              "Up to 3 classes with 10 lessons each",
              "Up to 250 MB of study materials",
              "Generate up to 20 tests per month",
              "Up to 10 active tests at any time",
              "Each test can use up to 50 pages of input",
              "Test results can be shared and taken by others",
            ]}
            buttonText={
              user?.subscriptionTier === "starter"
                ? "Current Plan"
                : "Upgrade Now"
            }
            buttonVariant="default"
            popular={true}
            isActive={user?.subscriptionTier === "starter"}
            disabled={user?.subscriptionTier === "starter"}
            onClick={() =>
              handleSubscribe(
                billingPeriod === "monthly"
                  ? process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID!
                  : process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID!
              )
            }
          />

          <PricingCard
            name="Pro"
            description="For advanced educational needs"
            price={
              billingPeriod === "monthly"
                ? 15
                : Math.round(15 * 12 * (1 - discount))
            }
            billingPeriod={billingPeriod}
            features={[
              "5 or more classes with up to 20 lessons each",
              "500 MB or more of study materials",
              "Generate unlimited tests",
              "Up to 30 active tests at a time",
              "Each test can use up to 100 pages of input",
              "Collaborative classes with shared materials",
              "Collaborative editing of test results",
            ]}
            buttonText={
              user?.subscriptionTier === "pro" ? "Current Plan" : "Go Pro"
            }
            buttonVariant="default"
            isActive={user?.subscriptionTier === "pro"}
            disabled={user?.subscriptionTier === "pro"}
            onClick={() =>
              handleSubscribe(
                billingPeriod === "monthly"
                  ? process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!
                  : process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID!
              )
            }
          />
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
