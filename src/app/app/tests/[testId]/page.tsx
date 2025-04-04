"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

import TestFooter from "./components/test-footer";

import { type Id, type Doc } from "../../../../../convex/_generated/dataModel";
import { useTestMutations } from "@/hooks/use-test-mutation";

import { type TestReview } from "@/lib/schemas";
import { useRouter } from "next/navigation";

export type TestQuestion = {
  questionText: string;
  questionType: string;
  availableAnswers?: string[];
  correctAnswer: string[];
};

// type Test = {
//   _id: Id<"tests">;
//   classId: Id<"classes">;
//   questions: TestQuestion[];
//   title: string;
//   description: string;
// };

// const TEST_ID_10_QUESTIONS = "kh750ayw0qrzk19gq21ht9kk657daak6";
// const TEST_ID_20_QUESTIONS = "kh74f5qpv6mmnbypacs2fc2c3h7dbxcm";

const createAnswerSchema = (test: Doc<"tests"> | undefined | null) => {
  if (!test) return z.object({});

  const answerFields: Record<string, z.ZodTypeAny> = {};

  test.questions.forEach((question: TestQuestion, index: number) => {
    switch (question.questionType) {
      case "true_false":
      case "short_answer":
        answerFields[`question-${index}`] = z
          .string({
            required_error: "Answer is required",
          })
          .min(1, { message: "Answer is required" });
        break;
      case "multiple_choice":
        answerFields[`question-${index}`] = z
          .array(z.string(), {
            required_error: "Select at least one answer",
          })
          .min(1, { message: "Select at least one answer" });
        break;
    }
  });

  return z.object(answerFields);
};

export default function TestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { testId }: { testId: Id<"tests"> } = useParams();

  const test = useQuery(api.tests.getTestById, {
    testId,
  });

  const { createTestReview } = useTestMutations();
  const router = useRouter();
  const questionsPerPage = 10;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = test?.questions.slice(startIndex, endIndex);

  const formSchema = createAnswerSchema(test);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!test) {
      return;
    }

    const requestBody = {
      test: test,
      answers: data,
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

      const { response: responseData } = (await response.json()) as {
        response: TestReview;
      };

      const testReviewId = await createTestReview({
        ...responseData,
        testId: test._id,
        classId: test.classId,
      });

      void router.push(`/app/tests/${testId}/review/${testReviewId}`);
    } catch (error) {
      console.error("Error generating test:", error);
    }
  };

  const renderQuestion = (question: TestQuestion, index: number) => {
    const globalIndex = startIndex + index;
    const fieldName = `question-${globalIndex}` as never;

    switch (question.questionType) {
      case "true_false":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {question?.availableAnswers?.map((answer: string) => (
                      <div key={answer} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={answer}
                          id={`${globalIndex}-${answer}`}
                        />
                        <Label htmlFor={`${globalIndex}-${answer}`}>
                          {answer}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "multiple_choice":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    {question?.availableAnswers?.map((answer: string) => (
                      <div key={answer} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${globalIndex}-${answer}`}
                          checked={((field.value as string[]) || []).includes(
                            answer
                          )}
                          onCheckedChange={(checked) => {
                            const currentAnswers =
                              (field.value as string[]) || [];
                            const newAnswers = checked
                              ? [...currentAnswers, answer]
                              : currentAnswers.filter((a) => a !== answer);
                            field.onChange(newAnswers);
                          }}
                        />
                        <Label htmlFor={`${globalIndex}-${answer}`}>
                          {answer}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "short_answer":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type your answer here..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
            <p className="text-muted-foreground">{test.description}</p>
          </div>

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
            handleSubmit={form.handleSubmit(onSubmit)}
          />
        </form>
      </Form>
    </div>
  );
}
