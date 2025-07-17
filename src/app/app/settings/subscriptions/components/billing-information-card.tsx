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
  stripeCustomer,
  isActive,
  isCanceled,
  isCanceling,
  hasSubscription,
}: {
  stripeCustomer?: Doc<"stripeCustomers"> | null;
  isActive: boolean;
  isCanceled: boolean;
  isCanceling: boolean;
  hasSubscription: boolean;
}) {
  // Show next billing date only if subscription is active and not canceling
  const shouldShowNextBilling =
    isActive && !isCanceling && stripeCustomer?.currentPeriodEnd;
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
                {new Date(
                  stripeCustomer.currentPeriodEnd! * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          )}

          {isCanceling && stripeCustomer?.currentPeriodEnd && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Access until:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(
                  stripeCustomer.currentPeriodEnd * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          )}

          {isCanceled && stripeCustomer?.currentPeriodEnd && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Canceled on:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(
                  stripeCustomer.currentPeriodEnd * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Payment method:</span>
            <span className="text-sm text-muted-foreground">
              {stripeCustomer?.paymentMethod?.last4
                ? "•••• •••• •••• " + stripeCustomer.paymentMethod.last4
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Subscribed from:</span>
            <span className="text-sm text-muted-foreground">
              {stripeCustomer?._creationTime
                ? new Date(stripeCustomer._creationTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {hasSubscription && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price:</span>
              <span className="text-sm text-muted-foreground">
                {(() => {
                  const plan = SUBSCRIPTION_PLANS.find(
                    (p) => p.priceId === stripeCustomer?.priceId
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

          {isCanceled && (
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
