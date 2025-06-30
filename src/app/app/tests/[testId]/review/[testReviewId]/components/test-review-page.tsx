import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import AlertDialogModal from "@/components/alert-dialog";

import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCcw,
  Target,
} from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";
import TestReviewShareButton from "./test-review-share-button";
import SectionHeader from "@/components/page-components/page-header";
import TestReviewProgress from "./test-review-progress";
import TestReviewDetails from "./test-review-details";

export default function TestReviewPage({
  testReview,
  backRoute,
  isViewedByOwner,
  canTakeTest,
  handleRetakeTest,
  perQuestionTypeAccuracy,
}: {
  testReview: Doc<"testReviews">;
  isViewedByOwner: boolean;
  canTakeTest: boolean;
  backRoute: string;
  handleRetakeTest: () => void;
  perQuestionTypeAccuracy: Record<string, { correct: number; total: number }>;
}) {
  const score = testReview.questions.filter(
    (question) => question.isCorrect
  ).length;
  const total = testReview.questions.length;
  const percentage = (score / total) * 100;

  return (
    <>
      <SectionHeader
        title={"Test Review"}
        description={"Review your test results"}
        backRoute={backRoute}
        actionButton={
          isViewedByOwner && (
            <div className="flex items-center gap-2">
              {canTakeTest && (
                <AlertDialogModal
                  onConfirm={handleRetakeTest}
                  title="Retake Test"
                  description="After you press confirm you will be redirected to the test. Good luck!"
                  variant="positive"
                  alertTrigger={
                    <Button className="text-xs md:text-base" variant="positive">
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Retake Test
                    </Button>
                  }
                />
              )}
              <TestReviewShareButton
                testReviewId={testReview._id}
                testId={testReview.testId}
              />
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TestReviewDetails perQuestionTypeAccuracy={perQuestionTypeAccuracy} />

        <TestReviewProgress
          percentage={percentage}
          score={score}
          total={total}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">Detailed Review</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {testReview.questions.map((question, index) => (
                <Card key={question.questionText} className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Question {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {question.questionType.replace("_", " ")}
                          </Badge>
                        </div>

                        {question.isCorrect ? (
                          <CheckCircle2 className="text-green-500 h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                        ) : (
                          <XCircle className="text-destructive h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                        )}
                      </div>
                      <h2 className="text-base md:text-lg  mt-1">
                        {question.questionText}
                      </h2>
                    </div>
                  </div>
                  <div className="mt-2 text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">
                        Your answer:{" "}
                      </span>
                      {question.answer}
                    </p>
                    <p className="text-green-500">
                      <span className="text-muted-foreground">Correct: </span>
                      {question.correctAnswer.join(", ")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
