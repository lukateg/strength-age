"use client";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import {
  getSubscriptionTierButton,
  getSubscriptionTierByStripeRecord,
} from "@/lib/utils";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

import QueryState from "@/components/data-query/query-state";
import NotFound from "@/components/data-query/not-found";
import DashboardStats from "@/components/dashboard-stats";
import DashboardProgressWidgets from "./components/dashboard-progress-widgets";
import WeekActivityWidget from "./components/week-activity-widget";
import ActiveStreakWidget from "./components/active-streak-widget";
import MostActiveClassWidget from "./components/most-active-class-widget";
import DashboardSkeleton from "./components/dashboard-skeleton";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const newDashboardData = useAuthenticatedQueryWithStatus(
    api.pages.dashboardPage.getNewDashboardData
  );

  return (
    <QueryState
      query={newDashboardData}
      pending={<DashboardSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        const {
          totalClasses,
          totalTests,
          streak,
          weeklyActivity,
          mostActiveClass,
          tokensUsedThisMonth,
          totalStorageUsage,
          stripeCustomer,
        } = data;

        const subscriptionTier =
          getSubscriptionTierByStripeRecord(stripeCustomer);

        return (
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  Welcome to Teach-me
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                  Your AI-powered learning assistant
                </p>
              </div>
              <Button className="hidden md:flex ">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>{`${subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} tier`}</span>
                </div>
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="grid w-full lg:w-1/2">
                  <DashboardStats
                    totalTests={totalTests}
                    totalClasses={totalClasses}
                    subscriptionTier={getSubscriptionTierByStripeRecord(
                      stripeCustomer
                    )}
                  />
                  <ActiveStreakWidget streak={streak} />
                </div>
                <div className="w-full lg:w-1/2 flex flex-row gap-6">
                  <DashboardProgressWidgets
                    totalStorageUsage={totalStorageUsage}
                    tokensUsedThisMonth={tokensUsedThisMonth}
                    subscriptionTier={getSubscriptionTierByStripeRecord(
                      stripeCustomer
                    )}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <WeekActivityWidget weeklyActivity={weeklyActivity} />
                <MostActiveClassWidget mostActiveClass={mostActiveClass} />
              </div>
            </div>
          </div>
        );
      }}
    </QueryState>
  );
}
