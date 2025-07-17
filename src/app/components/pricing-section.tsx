"use client";

import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { FeatureFlags, isFeatureFlagEnabled } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";

export default function PricingSection() {
  const router = useRouter();
  const shouldDisablePaidPlans = !isFeatureFlagEnabled(
    FeatureFlags.SUBSCRIPTIONS
  );

  const handleSubscription = (priceId: string, isDisabled: boolean) => {
    if (isDisabled) return;

    if (priceId === "free") {
      router.push("/app/app");
    } else {
      router.push(`/app/settings/subscriptions`);
    }
  };

  return (
    <section id="pricing" className="py-20 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUBSCRIPTION_PLANS.map((plan, index) => {
              const isDisabled = shouldDisablePaidPlans && plan.id !== "free";

              return (
                <Card
                  key={index}
                  className={cn(
                    "relative flex flex-col bg-card/50 border-border/40 transition-all duration-300 hover:border-primary/20",
                    plan.popular ? "border-primary scale-105 bg-card/80" : "",
                    isDisabled && "opacity-75"
                  )}
                >
                  {/* Coming Soon Overlay */}
                  {isDisabled && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Coming Soon
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          This plan will be available soon
                        </p>
                      </div>
                    </div>
                  )}

                  {plan.popular && !isDisabled && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Best Deal
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {plan.price === "Free" ? "Free" : `$${plan.price}`}
                      </span>
                      {plan.price !== "Free" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 ">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      className={`w-full mb-6 mt-auto ${
                        plan.popular && !isDisabled
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      onClick={() =>
                        handleSubscription(plan.priceId, isDisabled)
                      }
                      disabled={isDisabled}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
