"use client";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import RecentClasses from "./components/recent-classes-section";
import RecentTests from "./tests/components/recent-tests-card";
import NotFound from "@/components/not-found";
import DashboardStats from "@/components/dashboard-stats";
import MainPageSkeleton from "@/components/page-components/main-page-skeleton";

import { Plus } from "lucide-react";
import { generateStats } from "./utils";

export default function Dashboard() {
  const dashboardData = useAuthenticatedQueryWithStatus(
    api.pages.dashboardPage.getDashboardPageData
  );

  const stats = generateStats(
    dashboardData.data?.classes,
    dashboardData.data?.materials,
    dashboardData.data?.tests,
    dashboardData.data?.testReviews
  );

  if (dashboardData.isPending) {
    return <MainPageSkeleton />;
  }

  if (dashboardData.isError) {
    return <NotFound />;
  }

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
          disabled={!dashboardData.data?.permissions.canCreateClass}
        >
          <Link
            href="/app/classes/create-class"
            className={"flex items-center justify-center"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {dashboardData.data?.permissions.canCreateClass
              ? "Create New Class"
              : "Upgrade to create classes"}
          </Link>
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentClasses classes={dashboardData.data?.classes} />
        <RecentTests tests={dashboardData.data?.tests} />
      </div>
    </div>
  );
}
