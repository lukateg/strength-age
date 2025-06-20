import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { type api } from "../../../../convex/_generated/api";

export default function DashboardActivity({
  weeklyActivity,
}: {
  weeklyActivity: {
    classes: { count: number; trend: string };
    tests: { count: number; trend: string };
    lessons: { count: number; trend: string };
    testReviews: { count: number; trend: string };
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week&apos;s Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {weeklyActivity.classes.count}
            </span>
            <div className="flex items-center">
              <span className=" text-muted-foreground">Classes Created</span>
              {weeklyActivity.classes.trend === "higher" && (
                <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
              )}
              {weeklyActivity.classes.trend === "lower" && (
                <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
              )}
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {weeklyActivity.tests.count}
            </span>
            <div className="flex items-center">
              <span className=" text-muted-foreground">Tests (created)</span>
              {weeklyActivity.tests.trend === "higher" && (
                <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
              )}
              {weeklyActivity.tests.trend === "lower" && (
                <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
              )}
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {weeklyActivity.lessons.count}
            </span>
            <div className="flex items-center">
              <span className=" text-muted-foreground">Lessons Added</span>
              {weeklyActivity.lessons.trend === "higher" && (
                <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
              )}
              {weeklyActivity.lessons.trend === "lower" && (
                <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
              )}
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {weeklyActivity.testReviews.count}
            </span>
            <div className="flex items-center">
              <span className=" text-muted-foreground">Tests Taken</span>
              {weeklyActivity.testReviews.trend === "higher" && (
                <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
              )}
              {weeklyActivity.testReviews.trend === "lower" && (
                <ArrowDown className="h-4 w-4 text-red-500 ml-1" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
