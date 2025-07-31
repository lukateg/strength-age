"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { SubscriptionCard } from "@/app/app/settings/components/subscription-card";
import { FeatureFlags, isFeatureFlagEnabled } from "@/lib/feature-flags";
import { useSubscriptions } from "@/hooks/use-subscriptions";

export default function PricingSection({
  currentPlan,
  isActive,
}: {
  currentPlan?: string;
  isActive: boolean;
}) {
  const { getCheckoutUrl, isPending } = useSubscriptions();
  const shouldDisablePaidPlans = !isFeatureFlagEnabled(
    FeatureFlags.SUBSCRIPTIONS
  );

  const handleSelect = (variantId: string) => {
    void getCheckoutUrl(parseInt(variantId));
  };

  console.log(currentPlan);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage your plan</CardTitle>
        <CardDescription>
          You are currently on the{" "}
          {currentPlan
            ? SUBSCRIPTION_PLANS.find((p) => p.id === currentPlan)?.name
            : "Free"}{" "}
          plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                {...plan}
                onSelect={() => handleSelect(plan.priceId)}
                isCurrent={currentPlan === plan.id && isActive}
                isDisabled={
                  (shouldDisablePaidPlans && plan.id !== "free") || isPending
                }
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
