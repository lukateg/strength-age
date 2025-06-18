"use client";

import { useUserContext } from "@/providers/user-provider";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import RecentClasses from "./components/recent-classes-section";
import RecentTests from "./tests/components/recent-tests-card";
import NotFound from "@/components/data-query/not-found";
import DashboardStats from "@/components/dashboard-stats";
import MainPageSkeleton from "@/components/page-components/main-page-skeleton";

import { getSubscriptionTier } from "@/lib/utils";
import QueryState from "@/components/data-query/query-state";

export default function Dashboard() {
  const dashboardData = useAuthenticatedQueryWithStatus(
    api.pages.dashboardPage.getDashboardPageData
  );
  const { user } = useUserContext();
  const subscriptionTier = getSubscriptionTier(user?.data?.subscriptionTier);

  return (
    <QueryState
      query={dashboardData}
      pending={<MainPageSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        const { classes, tests, testReviews, permissions } = data;

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
              <Button
                className="hidden md:flex"
                disabled={!permissions.canCreateClass}
              >
                <Link
                  href="/app/classes/create-class"
                  className={"flex items-center justify-center"}
                >
                  <div className="flex items-center gap-2">
                    <subscriptionTier.icon className="h-4 w-4" />
                    <span>{`${subscriptionTier.name} tier`}</span>
                  </div>
                </Link>
              </Button>
            </div>

            <DashboardStats testReviews={testReviews} tests={tests} />

            <div className="grid gap-6 xl:grid-cols-2">
              <RecentClasses classes={classes} />
              <RecentTests tests={tests} />
            </div>
          </div>
        );
      }}
    </QueryState>
  );
}
