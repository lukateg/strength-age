import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { generateStats } from "../app/app/tests/utils";
import { type Doc } from "convex/_generated/dataModel";

type TestStatsProps = {
  testReviews: Doc<"testReviews">[];
  tests: Doc<"tests">[];
};

export default function TestStats({ testReviews, tests }: TestStatsProps) {
  const stats = generateStats(testReviews, tests);

  if (!stats) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Skeleton className="w-full h-[110px]" />
        <Skeleton className="w-full h-[110px]" />
        <Skeleton className="w-full h-[110px]" />
        <Skeleton className="w-full h-[110px]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
