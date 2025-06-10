"use client";

import { api } from "../../../../../../convex/_generated/api";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { BookOpen } from "lucide-react";
import CircularProgress from "../review/[testReviewId]/components/circular-progress";

export default function TestIncludedMaterials({ testId }: { testId: string }) {
  const testReviews = useAuthenticatedQueryWithStatus(
    api.tests.getTestReviewsByTestId,
    {
      testId,
    }
  );

  const totalAttempts = testReviews.data?.length ?? 0;
  const bestSuccessRatePercentages = testReviews.data?.length
    ? Math.max(
        ...testReviews.data.map((review) => {
          const correctAnswers = review.questions.filter(
            (q) => q.isCorrect
          ).length;
          return (correctAnswers / review.questions.length) * 100;
        })
      )
    : 0;

  const totalSuccessRatePercentage = testReviews.data?.length
    ? testReviews.data.reduce((acc, review) => {
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
        <CircularProgress value={totalSuccessRatePercentage} />
        <Separator />

        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Total attempts</p>
            <p className="text-lg font-medium">{totalAttempts}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Best score</p>
            <p className="text-lg font-medium">{bestSuccessRatePercentages}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
