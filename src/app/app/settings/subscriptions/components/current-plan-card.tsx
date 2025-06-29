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

export default function CurrentPlanCard({
  currentPlan,
  isActive,
}: {
  currentPlan?: string;
  isActive: boolean;
}) {
  const { handlePlanChangeAction } = useStripe();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>
          You are currently on the{" "}
          {SUBSCRIPTION_PLANS.find((p) => p.id === currentPlan)?.title} plan
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
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
