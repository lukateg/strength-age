"use client";

import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";

import Link from "next/link";
import RecentTests from "./components/recent-tests-card";
import RecentReviews from "./components/recent-reviews-card";
import DashboardStats from "../../../components/dashboard-stats";
import AllTestsCard from "./components/all-tests-card";
import AllTestReviewsCard from "./components/all-test-reviews-card";
import MainPageSkeleton from "@/components/page-components/main-page-skeleton";
import NotFound from "@/components/not-found";

import { generateStats } from "./utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../../convex/_generated/api";

export default function Tests() {
  // TODO: create a function with Promise.all to fetch all the data at useTests and then here implement loading skeleton pattern
  // and pass the data to the display components instead of fetching it there
  const testPageData = useAuthenticatedQueryWithStatus(
    api.pages.tests.getTestsPageDataQuery
  );

  if (testPageData.status === "pending") {
    return <MainPageSkeleton />;
  }

  if (testPageData.status === "error") {
    return <NotFound />;
  }

  const { tests, testReviews, weeklyTestReviews, permissions } =
    testPageData.data;

  const stats = generateStats(testReviews, weeklyTestReviews, tests);

  const canGenerateTest = permissions.canGenerateTest;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">AI Test Generator</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Let AI generate tests from your materials
          </p>
        </div>
        <Button disabled={!canGenerateTest}>
          <Link href={`/app/tests/generate-test`}>
            <span className="flex items-center gap-2">
              <FilePlus2 size={16} />
              {canGenerateTest ? "Generate Test" : "Upgrade to generate"}
            </span>
          </Link>
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent" className="text-xs md:text-base">
            Recent
          </TabsTrigger>
          <TabsTrigger value="tests" className="text-xs md:text-base">
            Tests
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs md:text-base">
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-6 xl:grid-cols-2">
            <RecentTests tests={tests} />

            <RecentReviews testReviews={testReviews} />
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <AllTestsCard tests={tests} />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <AllTestReviewsCard testReviews={testReviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
