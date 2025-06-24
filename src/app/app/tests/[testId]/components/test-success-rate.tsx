import CircularProgress from "../../../../../components/progress-components/circular-progress";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import { getPercentageColor } from "@/components/progress-components/get-percentage-color";

import { type Doc } from "convex/_generated/dataModel";

export default function TestSuccessRate({
  testReviews,
}: {
  testReviews: Doc<"testReviews">[];
}) {
  const totalAttempts = testReviews?.length ?? 0;
  const bestSuccessRatePercentages = testReviews?.length
    ? Math.max(
        ...testReviews.map((review) => {
          const correctAnswers = review.questions.filter(
            (q) => q.isCorrect
          ).length;
          return (correctAnswers / review.questions.length) * 100;
        })
      )
    : 0;

  const totalSuccessRatePercentage = testReviews?.length
    ? testReviews.reduce((acc, review) => {
        const correctAnswers = review.questions.filter(
          (q) => q.isCorrect
        ).length;
        return acc + (correctAnswers / review.questions.length) * 100;
      }, 0) / totalAttempts
    : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Success rate
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CircularProgress
          value={totalSuccessRatePercentage}
          isColored={true}
          order="descending"
        />
        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Total attempts: </p>
            <p className="text-lg font-medium ml-auto w-20 text-center">
              {totalAttempts}
            </p>
          </div>
          <Separator />

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Best score: </p>
            <p className="text-lg font-medium ml-auto w-20 text-center">
              {bestSuccessRatePercentages}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
