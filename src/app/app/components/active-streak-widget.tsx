import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function DashboardStreak({ streak }: { streak: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Flame className="h-12 w-12 fill-transparent stroke-primary stroke-1" />
          <div>
            <p className="text-2xl font-bold">{streak} days</p>
            <p className="text-sm text-muted-foreground">
              {streak > 0
                ? "Keep up the great work!"
                : "Start your streak today!"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
