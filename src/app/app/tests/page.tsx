"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { useTests } from "@/providers/tests-provider";

import RecentTests from "./components/recent-tests";
import RecentReviews from "./components/recent-reviews";
import DashboardStats from "../../../components/dashboard-stats";
import TestsSection from "./components/tests-section/tests-section";
import TestReviewsSection from "./components/test-reviews-section/test-reviews-section";

import { generateStats } from "./utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Tests() {
  const { testsByUser, testReviewsByUser, weeklyTestReviews, weeklyTests } =
    useTests();

  const stats = generateStats(
    testReviewsByUser,
    weeklyTestReviews,
    testsByUser
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">AI Test Generator</h1>
          <p className="text-muted-foreground mt-2">
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
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <RecentTests testsByUser={weeklyTests} />

            <RecentReviews testReviewsByUser={weeklyTestReviews} />
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <TestsSection />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <TestReviewsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
