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
import { type Question } from "@/lib/schemas";

// Mock data
const mockTest = {
  title: "JavaScript Fundamentals",
  description: "Test covering multiple lessons",
  questions: [
    {
      questionText: "What is the capital of France?",
      questionType: "multiple_choice",
      availableAnswers: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: ["Paris"],
    },
    {
      questionText: "Is JavaScript a compiled language?",
      questionType: "true_false",
      availableAnswers: ["True", "False"],
      correctAnswer: ["False"],
    },
    {
      questionText: "What does HTML stand for?",
      questionType: "short_answer",
      correctAnswer: ["HyperText Markup Language"],
    },
    {
      questionText: "Which of these are JavaScript frameworks?",
      questionType: "multiple_choice",
      availableAnswers: ["React", "Angular", "Vue", "jQuery"],
      correctAnswer: ["React", "Angular", "Vue"],
    },
    {
      questionText: "CSS is used for styling web pages.",
      questionType: "true_false",
      availableAnswers: ["True", "False"],
      correctAnswer: ["True"],
    },
  ] as Question[],
};

const mockAnswers = [
  "Paris",
  "True",
  "HyperText Markup Language",
  "React",
  "True",
];

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
          strokeWidth="6"
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
        <Trophy className="w-8 h-8 mb-2 text-primary" />
        <div className="text-4xl font-bold">{Math.round(value)}%</div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const score = 8;

  const total = mockTest.questions.length;
  const percentage = (score / total) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{mockTest.title}</h1>
            </div>
            <p className="text-muted-foreground">{mockTest.description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle>Test Results</CardTitle>
              </div>
              <Button onClick={() => (window.location.href = "/")}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Test
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-12 pt-8">
              <div className="flex flex-col items-center gap-8 md:flex-row md:gap-16">
                <CircularProgress value={percentage} />
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold">Score Summary</h2>
                  </div>
                  <div className="text-4xl font-bold flex items-center justify-center md:justify-start gap-4 mb-2">
                    <span className="text-primary">{score}</span>
                    <span className="text-muted-foreground">/</span>
                    <span>{total}</span>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Questions Answered Correctly
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Detailed Review</h3>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {mockTest.questions.map((question, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Question {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {question.questionType.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm">{question.questionText}</p>
                      </div>
                      {mockAnswers[index] &&
                      question.correctAnswer.some(
                        (answer) => answer === mockAnswers[index]
                      ) ? (
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
                        {mockAnswers[index]}
                      </p>
                      <p className="text-green-500">
                        <span className="text-muted-foreground">Correct: </span>
                        {question.correctAnswer.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
