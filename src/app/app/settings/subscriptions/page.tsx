"use client";

import CancelSubscriptionCard from "./components/cancel-subscription-card";
import BillingInformationCard from "./components/billing-information-card";
import CurrentPlanCard from "./components/current-plan-card";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../../../convex/_generated/api";
import QueryState from "@/components/data-query/query-state";
import UndoCancelingCard from "./components/undo-canceling-card";

export default function SubscriptionsPage() {
  const data = useAuthenticatedQueryWithStatus(
    api.pages.settingsPage.getSubscriptionPageData
  );

  return (
    <QueryState query={data} pending={<div>Loading...</div>}>
      {(data) => {
        const { stripeCustomer } = data;
        const isActive = stripeCustomer?.status === "active";
        const isCanceled = stripeCustomer?.status === "canceled";
        const isCanceling = stripeCustomer?.cancelAtPeriodEnd === true;
        const hasSubscription = stripeCustomer?.subscriptionId;

        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Subscriptions</h1>
              <p className="text-muted-foreground mt-2">
                Manage your subscription and billing preferences
              </p>
            </div>

            <CurrentPlanCard
              currentPlan={stripeCustomer?.priceId}
              isActive={isActive}
            />
            <BillingInformationCard
              stripeCustomer={stripeCustomer}
              isActive={isActive}
              isCanceled={isCanceled}
              isCanceling={isCanceling}
              hasSubscription={!!hasSubscription}
            />
            {isActive && !isCanceling && <CancelSubscriptionCard />}
            {isActive && isCanceling && <UndoCancelingCard />}
          </div>
        );
      }}
    </QueryState>
  );
}
