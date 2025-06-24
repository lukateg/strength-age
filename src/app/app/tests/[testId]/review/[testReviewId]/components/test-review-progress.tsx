import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle } from "lucide-react";
import { getQuestionTypeLabel } from "@/lib/utils";
import { getPercentageColor } from "@/components/progress-components/get-percentage-color";
import CircularProgress from "@/components/progress-components/circular-progress";

export default function TestReviewProgress({
  percentage,
  score,
  total,
}: {
  percentage: number;
  score: number;
  total: number;
}) {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Pass rate
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CircularProgress
          value={percentage}
          isColored={true}
          order="descending"
        />
        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Correct answers: </p>
            <p className="text-lg font-medium ml-auto w-20 text-center">
              {score}/{total}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
