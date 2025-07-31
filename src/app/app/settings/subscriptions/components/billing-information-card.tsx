"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { type Doc } from "../../../../../../convex/_generated/dataModel";
import { AlertCircle } from "lucide-react";

export default function BillingInformationCard({
  customer,
  isActive,
  isCanceled,
  isCanceling,
  hasSubscription,
}: {
  customer?: Doc<"lemonSqueezyCustomers"> | null;
  isActive: boolean;
  isCanceled: boolean;
  isCanceling: boolean;
  hasSubscription: boolean;
}) {
  // Show next billing date only if subscription is active and not canceling
  const shouldShowNextBilling =
    isActive && !isCanceling && customer?.currentPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          {isCanceled
            ? "Your subscription has been canceled"
            : isCanceling
              ? "Your subscription will be canceled at the end of the current period"
              : "Your next billing date and payment method"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shouldShowNextBilling && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Next billing date:</span>
              <span className="text-sm text-muted-foreground">
                {customer?.currentPeriodEnd
                  ? new Date(customer.currentPeriodEnd).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          )}

          {isCanceling && customer?.currentPeriodEnd && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Access until:</span>
              <span className="text-sm text-muted-foreground">
                {customer?.currentPeriodEnd
                  ? new Date(customer.currentPeriodEnd).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          )}

          {isCanceled && customer?.currentPeriodEnd && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Canceled on:</span>
              <span className="text-sm text-muted-foreground">
                {customer?.currentPeriodEnd
                  ? new Date(customer.currentPeriodEnd).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Payment method:</span>
            <span className="text-sm text-muted-foreground">
              {customer?.paymentMethod?.last4
                ? "•••• •••• •••• " + customer.paymentMethod.last4
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Subscribed from:</span>
            <span className="text-sm text-muted-foreground">
              {customer?._creationTime
                ? new Date(customer._creationTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Subscription status:</span>
            <span className="text-sm text-muted-foreground">
              {customer?.status
                ? customer.status.charAt(0).toUpperCase() +
                  customer.status.slice(1)
                : "N/A"}
            </span>
          </div>

          {hasSubscription && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price:</span>
              <span className="text-sm text-muted-foreground">
                {(() => {
                  const plan = SUBSCRIPTION_PLANS.find(
                    (p) => p.priceId === customer?.variantId?.toString()
                  );
                  if (!plan) return "N/A";
                  return `$${plan.price}/month`;
                })()}
              </span>
            </div>
          )}

          {isCanceling && (
            <div className="w-full text-start text-yellow-500 border border-yellow-500 rounded-md p-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">
                Your subscription will be canceled at the end of your current
                billing period. You&apos;ll continue to have access until then.
                You can undo this action by the end of the current billing
                period.
              </p>
            </div>
          )}

          {isCanceled && !isCanceling && (
            <div className="w-full text-start text-red-500 border border-red-500 rounded-md p-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">
                Your subscription has been canceled. You no longer have access
                to premium features.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
