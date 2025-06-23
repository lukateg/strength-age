import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type api } from "../../convex/_generated/api";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  FileText,
  GraduationCap,
} from "lucide-react";
import { type QueryStatus } from "@/hooks/use-authenticated-query";
import { LIMITATIONS } from "@/lib/limitations";

type TestStatsProps = {
  totalTests: number;
  totalAttempts: number;
  mostActiveTest: string | null;
  weeklySuccess: {
    rate: number;
    trend: "higher" | "lower" | "same";
    percentageChange: number;
  };
  user: QueryStatus<typeof api.users.getUserData>["data"];
};

// TODO: refactor stats to be
// 1/2 tests active
// total attempts
// percentage high score / most active test
// weekly success rate (with a trend arrow)

export default function TestStats({
  totalTests,
  totalAttempts,
  mostActiveTest,
  weeklySuccess,
  user,
}: TestStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">Tests Active</CardTitle>
          <GraduationCap className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalTests}{" "}
            <span className="text-muted-foreground">
              / {LIMITATIONS[user?.subscriptionTier ?? "free"].tests}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">
            Total Attempts
          </CardTitle>
          <FileText className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-start gap-2">
          <div className="text-2xl font-bold">{totalAttempts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">
            Most Active Test
          </CardTitle>
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-start gap-2">
          <div className="text-xl font-bold">{mostActiveTest}</div>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">
            Weekly Success
          </CardTitle>
          <div className="text-sm text-muted-foreground absolute right-6 bottom-6 flex items-center gap-1 flex-col">
            {weeklySuccess.trend === "higher" && (
              <ArrowUp className="h-4 w-4 text-green-500" />
            )}
            {weeklySuccess.trend === "lower" && (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs">{weeklySuccess.percentageChange}%</span>
          </div>
        </CardHeader>
        <CardContent className="flex items-start gap-2">
          <div className="text-2xl font-bold">{weeklySuccess.rate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
