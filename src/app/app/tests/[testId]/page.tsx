"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

import TestFooter from "./components/test-footer";
import QuestionAnswers from "./components/question-answers";
import TestSkeleton from "./components/test-skeleton";

import { useTestMutations } from "@/hooks/use-test-mutation";
import { useLoadingContext } from "@/providers/loading-context";

import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createAnswerSchema } from "@/lib/schemas";

import { type TestReview } from "@/lib/schemas";
import { type Id } from "../../../../../convex/_generated/dataModel";
import type * as z from "zod";

export type TestQuestion = {
  questionText: string;
  questionType: string;
  availableAnswers?: string[];
  correctAnswer: string[];
};

export default function TestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { testId }: { testId: Id<"tests"> } = useParams();
  const { setLoading, loading } = useLoadingContext();

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
    setLoading(true, "Reviewing test...");

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
    } finally {
      setLoading(false);
    }
  };

  if (!test) {
    return <TestSkeleton />;
  }

  return (
    <ScrollArea>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
            <p className="text-muted-foreground">{test.description}</p>
          </div>

          <div className="space-y-6 ">
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

                <QuestionAnswers
                  question={question}
                  index={index}
                  startIndex={startIndex}
                  form={form}
                />
              </Card>
            ))}
          </div>

          <TestFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            test={test}
            questionsPerPage={questionsPerPage}
            handleSubmit={form.handleSubmit(onSubmit)}
            isLoading={loading}
          />
        </form>
      </Form>
    </ScrollArea>
  );
}
