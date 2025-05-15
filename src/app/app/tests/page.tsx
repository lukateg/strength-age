"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { useTests } from "@/providers/tests-provider";

import RecentTests from "./components/recent-tests-card";
import RecentReviews from "./components/recent-reviews-card";
import DashboardStats from "../../../components/dashboard-stats";
import AllTestsCard from "./components/all-tests-card";
import AllTestReviewsCard from "./components/all-test-reviews-card";

import { generateStats } from "./utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Tests() {
  // TODO: create a function with Promise.all to fetch all the data at useTests and then here implement loading skeleton pattern
  const { testsByUser, testReviewsByUser, weeklyTestReviews } = useTests();

  const stats = generateStats(
    testReviewsByUser?.data,
    weeklyTestReviews?.data,
    testsByUser?.data
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">AI Test Generator</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Let AI generate tests from your materials
          </p>
        </div>
        <Button>
          <Link href={`/app/tests/generate-test`}>
            <span className="flex items-center gap-2">
              <FilePlus2 size={16} />
              Generate Test
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
            <RecentTests />

            <RecentReviews />
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <AllTestsCard />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <AllTestReviewsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
