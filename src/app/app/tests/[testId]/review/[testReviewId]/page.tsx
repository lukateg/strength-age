"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
// TODO: duplicate
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import { useQuery } from "convex/react";

import { type Question } from "@/lib/schemas";
import { type Id } from "convex/_generated/dataModel";

function CircularProgress({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 60; // increased radius to 60
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-48 h-48">
        {" "}
        {/* increased size */}
        <circle
          className="text-muted stroke-current"
          strokeWidth="6"
          fill="transparent"
          r="60"
          cx="96"
          cy="96"
        />
        <circle
          className="text-primary stroke-current transition-all duration-1000 ease-in-out"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r="60"
          cx="96"
          cy="96"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {/* <Trophy className="w-8 h-8 mb-2 text-primary" /> */}
        <div className="text-4xl ">{Math.round(value)}%</div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const {
    testReviewId,
    testId,
  }: { testReviewId: Id<"testReviews">; testId: Id<"tests"> } = useParams();
  const router = useRouter();

  const testReview = useQuery(api.tests.getTestReviewById, {
    testReviewId,
  });

  if (!testReview) {
    return <div>Test review not found</div>;
  }
  const score = testReview.questions.filter(
    (question) => question.isCorrect
  ).length;
  const total = testReview.questions.length;
  const percentage = (score / total) * 100;

  const retakeTest = () => {
    void router.push(`/app/tests/${testId}`);
  };

  return (
    <div className="bg-background text-foreground p-6">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{testReview.title}</h1>
            </div>
            <p className="text-muted-foreground">{testReview.description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle>Test Results</CardTitle>
              </div>
              <Button onClick={retakeTest}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Test
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-12 pt-8">
              <div className="flex flex-col w-full items-center gap-8 md:flex-row md:gap-16">
                <Card className="w-1/2 items-center justify-center flex  min-h-48 min-w-48">
                  <CircularProgress value={percentage} />
                </Card>

                <Card className="text-center w-1/2 items-center min-h-48 min-w-48 justify-center flex md:text-left">
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-primary" />
                      <h2 className="text-xl font-semibold">Score Summary</h2>
                    </div>
                    <div className="text-4xl flex items-center justify-center md:justify-start gap-4 mb-2">
                      <span className="text-primary">{score}</span>
                      <span className="text-muted-foreground">/</span>
                      <span>{total}</span>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Questions Answered Correctly
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Detailed Review</h3>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {testReview.questions.map((question, index) => (
                  <Card key={question.questionText} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Question {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {question.questionType.replace("_", " ")}
                          </Badge>
                        </div>
                        <h2 className="text-xl font-semibold mt-1">
                          {question.questionText}
                        </h2>
                      </div>
                      {question.isCorrect ? (
                        <CheckCircle2 className="text-green-500 h-6 w-6 flex-shrink-0" />
                      ) : (
                        <XCircle className="text-destructive h-6 w-6 flex-shrink-0" />
                      )}
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
      </div>
    </div>
  );
}
