"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// import { testData } from "@/lib/mock-data";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

import TestFooter from "./components/test-footer";

import { type Id } from "../../../../../convex/_generated/dataModel";
import { useTestMutations } from "@/hooks/use-test-mutation";

import { type TestReview } from "@/lib/schemas";
import { useRouter } from "next/navigation";

export type TestQuestion = {
  questionText: string;
  questionType: string;
  // questionType: "multiple_choice" | "short_answer" | "true_false";
  availableAnswers?: string[];
  correctAnswer: string[];
};

const TEST_ID_10_QUESTIONS = "kh750ayw0qrzk19gq21ht9kk657daak6";
const TEST_ID_20_QUESTIONS = "kh74f5qpv6mmnbypacs2fc2c3h7dbxcm";

export default function TestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const { testId } = useParams();
  const test = useQuery(api.tests.getTestById, {
    testId: testId as Id<"tests">,
  });
  const { createTestReview } = useTestMutations();
  const router = useRouter();
  const questionsPerPage = 10;
  // const totalPages = Math.ceil(test?.questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = test?.questions.slice(startIndex, endIndex);
  // const isLastPage = test?.questions
  //   ? currentPage === Math.ceil(test.questions.length / questionsPerPage)
  //   : false;
  // const progress =
  //   (Object.keys(answers).length / test?.questions.length) * 100;
  const handleAnswerChange = (
    questionIndex: number,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    console.log(answers, "answers");
    console.log(test, "test");
    if (!test) {
      return;
    }

    const requestBody = {
      test: test,
      answers: answers,
    };

    try {
      const response = await fetch("/api/reviewTest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const { response: data } = (await response.json()) as {
        response: TestReview;
      };

      console.log(data, "review test response");

      const testReviewId = await createTestReview({
        ...data,
        testId: test._id,
        classId: test.classId,
      });
      console.log(testReviewId, "test review id");
      void router.push(`/app/tests/${testReviewId}/review`);
    } catch (error) {
      console.error("Error generating test:", error);
      // TODO: Add proper error handling/user feedback
    }
  };

  const renderQuestion = (question: TestQuestion, index: number) => {
    const globalIndex = startIndex + index;

    switch (question.questionType) {
      case "true_false":
        return (
          <RadioGroup
            value={answers[globalIndex] as string}
            onValueChange={(value) => handleAnswerChange(globalIndex, value)}
          >
            {question?.availableAnswers?.map((answer: string) => (
              <div key={answer} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={answer}
                  id={`${globalIndex}-${answer}`}
                />
                <Label htmlFor={`${globalIndex}-${answer}`}>{answer}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {question?.availableAnswers?.map((answer: string) => (
              <div key={answer} className="flex items-center space-x-2">
                <Checkbox
                  id={`${globalIndex}-${answer}`}
                  checked={(answers[globalIndex] as string[])?.includes(answer)}
                  onCheckedChange={(checked) => {
                    const currentAnswers =
                      (answers[globalIndex] as string[]) || [];
                    const newAnswers = checked
                      ? [...currentAnswers, answer]
                      : currentAnswers.filter((a) => a !== answer);
                    handleAnswerChange(globalIndex, newAnswers);
                  }}
                />
                <Label htmlFor={`${globalIndex}-${answer}`}>{answer}</Label>
              </div>
            ))}
          </div>
        );

      case "short_answer":
        return (
          <Textarea
            value={(answers[globalIndex] as string) || ""}
            onChange={(e) => handleAnswerChange(globalIndex, e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[100px]"
          />
        );

      default:
        return null;
    }
  };

  if (!test) {
    return <div>Test not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
          <p className="text-muted-foreground">{test.description}</p>
        </div>

        {/* <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Progress: {Math.round(progress)}%
          </p>
        </div> */}

        <div className="space-y-6">
          {currentQuestions?.map((question, index) => (
            <Card key={startIndex + index} className="p-6">
              <div className="mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {startIndex + index + 1}
                </span>
                <h2 className="text-xl font-semibold mt-1">
                  {question.questionText}
                </h2>
              </div>
              {renderQuestion(question, index)}
            </Card>
          ))}
        </div>

        <TestFooter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          test={test}
          questionsPerPage={questionsPerPage}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
