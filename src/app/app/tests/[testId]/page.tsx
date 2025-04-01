"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { testData } from "@/lib/mock-data";

export type Question = {
  questionText: string;
  questionType: "multiple_choice" | "short_answer" | "true_false";
  availableAnswers?: string[];
  correctAnswer: string[];
};

export default function TestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const questionsPerPage = 10;
  const totalPages = Math.ceil(testData.questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = testData.questions.slice(startIndex, endIndex);
  const progress =
    (Object.keys(answers).length / testData.questions.length) * 100;

  const handleAnswerChange = (
    questionIndex: number,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const renderQuestion = (question: Question, index: number) => {
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{testData.title}</h1>
          <p className="text-muted-foreground">{testData.description}</p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Progress: {Math.round(progress)}%
          </p>
        </div>

        <div className="space-y-6">
          {currentQuestions.map((question, index) => (
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

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
