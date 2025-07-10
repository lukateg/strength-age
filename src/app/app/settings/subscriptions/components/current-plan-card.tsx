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
import { useStripe } from "@/hooks/use-stripe";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { FeatureFlags, validateFeatureFlag } from "@/lib/feature-flags";

export default function CurrentPlanCard({
  currentPlan,
  isActive,
}: {
  currentPlan?: string;
  isActive: boolean;
}) {
  const { handlePlanChangeAction } = useStripe();
  const isBetaFeatureEnabled = useFeatureFlagEnabled(FeatureFlags.BETA_FEATURE);

  // Validate and gate flag-dependent code
  const shouldDisablePaidPlans =
    validateFeatureFlag(FeatureFlags.BETA_FEATURE) &&
    isBetaFeatureEnabled === true;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                {...plan}
                onSelect={() => handlePlanChangeAction(plan.priceId)}
                isCurrent={currentPlan === plan.priceId && isActive}
                isDisabled={shouldDisablePaidPlans && plan.id !== "free"}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
