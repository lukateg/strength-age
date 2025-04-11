"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { useTests } from "@/providers/tests-provider";

import RecentTests from "./components/recent-tests";
import RecentReviews from "./components/recent-reviews";
import DashboardStats from "../../../components/dashboard-stats";

import { generateStats } from "./utils";

export default function Tests() {
  const { testsByUser, testReviewsByUser, weeklyTestReviews } = useTests();

  const stats = generateStats(
    testReviewsByUser,
    weeklyTestReviews,
    testsByUser
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">AI Test Generator</h1>
          <p className="text-muted-foreground mt-2">
            Let AI generate tests from your materials.
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

      <div className="grid gap-6 md:grid-cols-2">
        <RecentTests testsByUser={testsByUser} />

        <RecentReviews testReviewsByUser={testReviewsByUser} />
      </div>
    </div>
  );
}
