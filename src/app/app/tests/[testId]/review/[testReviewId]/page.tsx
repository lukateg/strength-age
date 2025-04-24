"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import TestReviewStats from "./components/test-review-stats";
import TestReviewSkeleton from "./components/test-review-skeleton";
import RetryTestButton from "@/components/retry-test-button";

import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Target,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import { type Id } from "convex/_generated/dataModel";
import { useEffect } from "react";

export default function ReviewPage() {
  const {
    testReviewId,
    testId,
  }: { testReviewId: Id<"testReviews">; testId: Id<"tests"> } = useParams();
  const router = useRouter();
  const testReview = useAuthenticatedQueryWithStatus(
    api.tests.getTestReviewById,
    {
      testReviewId,
    }
  );
  const fromTestPage = sessionStorage.getItem("fromTestPage");

  const handleBackNavigation = () => {
    if (fromTestPage) {
      sessionStorage.removeItem("fromTestPage");
      router.push(`/app/tests`);
    } else {
      router.back();
    }
  };

  if (testReview.isPending) {
    return <TestReviewSkeleton />;
  }

  if (testReview.isError) {
    return <div>Error loading test review</div>;
  }

  if ((testReview.isSuccess && !testReview.data) || testReview.data === null) {
    return <div>Test review not found</div>;
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleBackNavigation}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">
              {testReview.data.title}
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            {testReview.data.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg md:text-2xl">
                Test Results
              </CardTitle>
            </div>
            <RetryTestButton
              to={`/app/tests/${testId}`}
              variant="default"
              className="text-xs md:text-base"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Retake Test
              </span>
            </RetryTestButton>
          </div>
        </CardHeader>
        <CardContent>
          <TestReviewStats testReview={testReview.data} />

          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Detailed Review</h3>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {testReview.data?.questions.map((question, index) => (
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
                      <h2 className="text-base md:text-xl font-semibold mt-1">
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
