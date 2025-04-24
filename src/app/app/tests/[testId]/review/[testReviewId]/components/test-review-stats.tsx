import { Card } from "@/components/ui/card";
import { Clock, Award } from "lucide-react";

import CircularProgress from "./circular-progress";

import { type Doc } from "convex/_generated/dataModel";

export default function TestReviewStats({
  testReview,
}: {
  testReview: Doc<"testReviews">;
}) {
  const score = testReview.questions.filter(
    (question) => question.isCorrect
  ).length;
  const total = testReview.questions.length;
  const percentage = (score / total) * 100;

  return (
    <div className="flex flex-col items-center mb-12 pt-8">
      <div className="flex flex-col w-full items-center gap-8 md:flex-row md:gap-16">
        <Card className="w-1/2 items-center justify-center flex  min-h-48 min-w-48">
          <CircularProgress value={percentage} />
        </Card>

        <Card className="text-center w-1/2 items-center min-h-48 min-w-48 justify-center flex md:text-left">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="text-base md:text-xl font-semibold">
                Score Summary
              </h2>
            </div>
            <div className="text-4xl flex items-center justify-center md:justify-start gap-4 mb-2">
              <span className="text-primary">{score}</span>
              <span className="text-muted-foreground">/</span>
              <span>{total}</span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 hidden md:block" />
              Questions Answered Correctly
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
