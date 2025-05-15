"use client";
import Link from "next/link";

import { api } from "../../../convex/_generated/api";
import { generateStats } from "./utils";

import { Button } from "@/components/ui/button";

import RecentClasses from "./components/recent-classes-section";
import RecentTests from "./tests/components/recent-tests-card";
import DashboardStats from "@/components/dashboard-stats";

import { Plus } from "lucide-react";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

export default function Dashboard() {
  const classes = useAuthenticatedQueryWithStatus(
    api.classes.getAllClassesByUserId
  );
  const allTests = useAuthenticatedQueryWithStatus(api.tests.getAllTestsByUser);
  const materials = useAuthenticatedQueryWithStatus(
    api.materials.getAllPDFsByUser
  );
  const testReviews = useAuthenticatedQueryWithStatus(
    api.tests.getAllTestReviewsByUser
  );

  const stats = generateStats(
    classes.data,
    materials.data,
    allTests.data,
    testReviews.data
  );

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
        <Button asChild className="hidden md:flex">
          <Link href="/app/classes/create-class">
            <Plus className="h-4 w-4 mr-2" />
            Create New Class
          </Link>
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentClasses />
        <RecentTests />
      </div>
    </div>
  );
}
