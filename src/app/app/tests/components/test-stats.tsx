import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { BookOpen, Brain, FileText, Users } from "lucide-react";

export default function TestStats({
  stats,
}: {
  stats: {
    averageSuccessRate: number;
    averageWeeklySuccessRate: number;
    totalTestLength: number;
    weeklyTestLength: number;
  } | null;
}) {
  if (!stats) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    );
  }

  const STATS_TO_SHOW = [
    {
      title: "Total Tests",
      icon: BookOpen,
      value: stats.totalTestLength,
    },
    {
      title: "Global Success Rate",
      icon: FileText,
      value: `${stats.averageSuccessRate}%`,
    },
    {
      title: "Weekly Streak",
      icon: Brain,
      value: stats.weeklyTestLength,
    },
    {
      title: "Weekly Success Rate",
      icon: Users,
      value: `${stats.averageWeeklySuccessRate}%`,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {STATS_TO_SHOW.map((stat) => (
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
