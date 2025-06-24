import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type api } from "../../../../../../convex/_generated/api";
import { BookOpen, FileText, GraduationCap } from "lucide-react";
import { type QueryStatus } from "@/hooks/use-authenticated-query";
import { LIMITATIONS } from "@/lib/limitations";
import { getPercentageColor } from "@/components/progress-components/get-percentage-color";
import MiniPieChart from "@/app/app/components/mini-pie-chart";
import { formatBytesToMB } from "@/lib/utils";

type ClassStatsProps = {
  totalLessons: number;
  totalTests: number;
  classStorageUsage: number;
  classSuccessRate: number;
  user: QueryStatus<typeof api.users.getUserData>["data"] | undefined;
};

export default function ClassStats({
  totalLessons,
  totalTests,
  classStorageUsage,
  classSuccessRate,
  user,
}: ClassStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">
            Lessons by Class
          </CardTitle>
          <GraduationCap className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalLessons}{" "}
            <span className="text-muted-foreground">
              / {LIMITATIONS[user?.subscriptionTier ?? "free"].tests}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">
            Tests by Class
          </CardTitle>
          <FileText className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-start gap-2">
          <div className="text-2xl font-bold">{totalTests}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">
            Storage by Class
          </CardTitle>
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-start gap-2">
          <div className="text-xl font-bold">
            {formatBytesToMB(classStorageUsage)} /{" "}
            {formatBytesToMB(
              LIMITATIONS[user?.subscriptionTier ?? "free"].materials
            )}
            MB
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
          <CardTitle className="text-base font-medium">
            Class Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <div className="text-2xl font-bold">
            {Math.round(classSuccessRate)}%
          </div>
          <MiniPieChart
            progressColor={getPercentageColor(classSuccessRate, "ascending")}
            percentage={classSuccessRate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
