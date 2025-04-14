"use client";
import Link from "next/link";

import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { generateStats } from "./utils";

import { Button } from "@/components/ui/button";

import RecentClasses from "./components/recent-classes";
import RecentTests from "./tests/components/recent-tests";
import DashboardStats from "@/components/dashboard-stats";

import { Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();

  const classes = useQuery(api.classes.getAllClasses);
  const allTests = useQuery(api.tests.getAllTestsByUser, {
    userId: user?.id,
  });
  const materials = useQuery(api.materials.getAllPDFsByUser, {
    userId: user?.id,
  });
  const testReviews = useQuery(api.tests.getAllTestReviewsByUser, {
    userId: user?.id,
  });

  const stats = generateStats(classes, materials, allTests, testReviews);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome to Teach-me</h1>
          <p className="text-muted-foreground mt-2">
            Your AI-powered learning assistant
          </p>
        </div>
        <Button asChild>
          <Link href="/app/classes/new-class">
            <Plus className="h-4 w-4 mr-2" />
            Create New Class
          </Link>
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentClasses classesByUser={classes} />
        <RecentTests testsByUser={allTests} />
      </div>
    </div>
  );
}
