"use client";

import { useTests } from "@/providers/tests-provider";

import Link from "next/link";
import RecentTests from "./components/recent-tests-card";
import RecentReviews from "./components/recent-reviews-card";
import DashboardStats from "../../../components/dashboard-stats";
import AllTestsCard from "./components/all-tests-card";
import AllTestReviewsCard from "./components/all-test-reviews-card";
import MainPageSkeleton from "@/components/page-components/main-page-skeleton";
import NotFound from "@/components/data-query/not-found";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { FilePlus2 } from "lucide-react";
import QueryState from "@/components/data-query/query-state";

export default function Tests() {
  const { testsPageData } = useTests();

  return (
    <QueryState
      query={testsPageData}
      pending={<MainPageSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        const { tests, testReviews, permissions } = data;
        const canGenerateTest = permissions.canGenerateTest;

        return (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  AI Test Generator
                </h1>
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

            <DashboardStats testReviews={testReviews} tests={tests} />

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
      }}
    </QueryState>
  );
}
