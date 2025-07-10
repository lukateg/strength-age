import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen } from "lucide-react";
import { LIMITATIONS } from "@/lib/limitations";
import { type Doc } from "convex/_generated/dataModel";

type DashboardStatsProps = {
  totalTests: number;
  totalClasses: number;
  subscriptionTier?: Doc<"users">["subscriptionTier"];
};

export default function DashboardStats({
  totalTests,
  totalClasses,
  subscriptionTier = "free",
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-base font-medium">Classes</CardTitle>
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-wide">
            <span>{totalClasses} </span>
            <span className="text-muted-foreground tracking-wide">
              / {LIMITATIONS[subscriptionTier].classes}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-base font-medium">Tests</CardTitle>
          <GraduationCap className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTests}</div>
        </CardContent>
      </Card>
    </div>
  );
}
