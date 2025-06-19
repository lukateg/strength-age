import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Doc } from "convex/_generated/dataModel";
import { GraduationCap, FileText, BookOpen, HardDrive } from "lucide-react";
import { LIMITATIONS } from "@/shared/constants";

type DashboardStatsProps = {
  tests: Doc<"tests">[];
  classes: Doc<"classes">[];
  testReviews: Doc<"testReviews">[];
  storageUsed: number;
  subscriptionTier: "free" | "starter" | "pro";
};

export default function DashboardStats({
  tests,
  classes,
  testReviews,
  storageUsed,
  subscriptionTier,
}: DashboardStatsProps) {
  const formatStorageUsage = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${Math.round(mb * 10) / 10}`;
  };

  const globalSuccessRate =
    testReviews.length > 0
      ? (testReviews.reduce(
          (acc, review) =>
            acc +
            review.questions.filter((q) => q.isCorrect).length /
              review.questions.length,
          0
        ) /
          testReviews.length) *
        100
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* {stats.map((stat) => ( */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Classes</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {classes.length}
            <span className="text-muted-foreground">
              /{LIMITATIONS[subscriptionTier].classes}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Global Success Rate
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{globalSuccessRate}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tests</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {tests.length}
            <span className="text-muted-foreground">
              /{LIMITATIONS[subscriptionTier].tests}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatStorageUsage(storageUsed)}
            <span className="text-muted-foreground">
              /{formatStorageUsage(LIMITATIONS[subscriptionTier].materials)}GB
            </span>
          </div>
        </CardContent>
      </Card>
      {/* ))} */}
    </div>
  );
}
