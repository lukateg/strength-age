"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useParams } from "next/navigation";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import { api } from "../../../../../convex/_generated/api";

import TestFooter from "./components/test-footer";
import QuestionAnswers from "./components/question-answers";
import TestSkeleton from "./components/test-skeleton";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

import { useTestMutations } from "@/hooks/use-test-mutation";
import { useLoadingContext } from "@/providers/loading-context";

import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createAnswerSchema } from "@/lib/schemas";

import { type Id } from "../../../../../convex/_generated/dataModel";
import type * as z from "zod";
import { Pause, CircleX } from "lucide-react";
import { reviewTest } from "@/server/test-actions";

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

  const test = useAuthenticatedQueryWithStatus(api.tests.getTestById, {
    testId,
  });

  const { createTestReview } = useTestMutations();
  const router = useRouter();
  const questionsPerPage = 10;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = test?.data?.questions.slice(startIndex, endIndex);

  const formSchema = createAnswerSchema(test?.data);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: "onSubmit",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!test) {
      return;
    }
    setLoading(true, "Reviewing test...");

    sessionStorage.setItem("fromTestPage", "true");

    if (!test.data) {
      return;
    }
    const requestBody = {
      test: test.data,
      answers: data,
    };

    try {
      const responseData = await reviewTest(requestBody);

      const testReviewId = await createTestReview({
        ...responseData,
        testId: test.data._id,
        classId: test.data.classId,
      });
      void router.push(`/app/tests/${testId}/review/${testReviewId}`);
    } catch (error) {
      console.error("Error generating test:", error);
    } finally {
      setLoading(false);
    }
  };

  if (test.isPending) {
    return <TestSkeleton />;
  }

  if (test.isError) {
    return <div>Error loading test</div>;
  }

  return (
    <ScrollArea className="max-w-screen-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-8 text-center flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mr-4 border-red-600/50 text-primary border-2"
              type="button"
            >
              <CircleX className="w-4 h-4 mr-2 text-red-600/50" />
              Exit Test
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{test.data?.title}</h1>
              <p className="text-muted-foreground">{test.data?.description}</p>
            </div>

            <FeatureFlagTooltip>
              <Button
                type="button"
                variant="outline"
                className="border-green-600/90 text-primary border-2"
                disabled
              >
                <Pause className="w-4 h-4 mr-2 text-green-600/90" />
                Pause Test
              </Button>
            </FeatureFlagTooltip>
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
        </form>
        <TestFooter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          test={test.data}
          questionsPerPage={questionsPerPage}
          handleSubmit={form.handleSubmit(onSubmit)}
          isLoading={loading}
        />
      </Form>
    </ScrollArea>
  );
}
