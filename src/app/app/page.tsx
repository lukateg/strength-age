"use client";

import { useUserContext } from "@/providers/user-provider";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { getSubscriptionTier } from "@/lib/utils";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

import QueryState from "@/components/data-query/query-state";
import Link from "next/link";
import NotFound from "@/components/data-query/not-found";
import DashboardStats from "@/components/dashboard-stats";
import MainPageSkeleton from "@/components/page-components/main-page-skeleton";
import DashboardProgressWidgets from "./components/dashboard-progress-widgets";
import WeekActivityWidget from "./components/week-activity-widget";
import ActiveStreakWidget from "./components/active-streak-widget";
import MostActiveClassWidget from "./components/most-active-class-widget";

export default function Dashboard() {
  const newDashboardData = useAuthenticatedQueryWithStatus(
    api.pages.dashboardPage.getNewDashboardData
  );
  const { user } = useUserContext();
  const subscriptionTier = getSubscriptionTier(user?.data?.subscriptionTier);

  return (
    <QueryState
      query={newDashboardData}
      pending={<MainPageSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        const {
          totalClasses,
          totalTests,
          streak,
          weeklyActivity,
          mostActiveClass,
          globalSuccessRate,
          totalTestReviews,
        } = data;

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
                  <subscriptionTier.icon className="h-4 w-4" />
                  <span>{`${subscriptionTier.name} tier`}</span>
                </div>
              </Button>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-6">
                <div className="grid w-1/2">
                  <DashboardStats
                    totalTests={totalTests}
                    totalClasses={totalClasses}
                    subscriptionTier={user?.data?.subscriptionTier}
                  />
                  <ActiveStreakWidget streak={streak} />
                </div>
                <div className="w-1/2 flex flex-row gap-6">
                  <DashboardProgressWidgets
                    globalSuccessRate={globalSuccessRate}
                    totalTestReviews={totalTestReviews}
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
