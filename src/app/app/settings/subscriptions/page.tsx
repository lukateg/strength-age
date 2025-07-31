"use client";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../../../convex/_generated/api";

import CancelSubscriptionCard from "./components/cancel-subscription-card";
import BillingInformationCard from "./components/billing-information-card";
import PricingSection from "./components/pricing-section";
import QueryState from "@/components/data-query/query-state";
import UndoCancelingCard from "./components/undo-canceling-card";
import SettingsPageSkeleton from "../components/settings-page-skeleton";

export default function SubscriptionsPage() {
  const data = useAuthenticatedQueryWithStatus(
    api.pages.settingsPage.getSubscriptionPageData
  );

  return (
    <QueryState query={data} pending={<SettingsPageSkeleton />}>
      {(data) => {
        const { customer } = data;
        const isActive = customer?.status === "active";
        const isCanceled = customer?.status === "canceled";
        const isCanceling = customer?.cancelAtPeriodEnd === true;
        const hasSubscription = customer?.subscriptionId;

        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Subscriptions</h1>
              <p className="text-muted-foreground mt-2">
                Manage your subscription and billing preferences
              </p>
            </div>

            <PricingSection
              currentPlan={customer?.subscriptionTier}
              isActive={isActive}
            />
            <BillingInformationCard
              customer={customer}
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
