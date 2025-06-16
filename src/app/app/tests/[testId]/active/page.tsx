"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import { api } from "../../../../../../convex/_generated/api";

import TestFooter from "../components/test-footer";
import QuestionAnswers from "../components/question-answers";
import TestSkeleton from "../components/test-skeleton";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import NotFound from "@/components/not-found";

import { useTestMutations } from "@/hooks/use-test-mutations";
import { useLoadingContext } from "@/providers/loading-context";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";
import { createAnswerSchema } from "@/lib/schemas";

import { type Id } from "../../../../../../convex/_generated/dataModel";
import type * as z from "zod";
import { Pause, DoorOpen } from "lucide-react";
import { reviewTest } from "@/server/test-actions";

export type TestQuestion = {
  questionText: string;
  questionType: string;
  availableAnswers?: string[];
  correctAnswer: string[];
};

export default function ActiveTestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { testId }: { testId: Id<"tests"> } = useParams();
  const { setLoading, loading } = useLoadingContext();

  const test = useAuthenticatedQueryWithStatus(api.tests.getTestByIdQuery, {
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

      void router.replace(`/app/tests/${testId}/review/${testReviewId}`);
    } catch (error) {
      let errorMessage = "An unknown error occurred. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error("Error reviewing test", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (test.isPending) {
    return <TestSkeleton />;
  }

  if (test.isError) {
    return <NotFound />;
  }

  return (
    <ScrollArea className="max-w-screen-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-8 text-center flex justify-between items-center">
            <Button
              variant="destructive"
              onClick={() => router.back()}
              type="button"
            >
              <DoorOpen />
              <span className="hidden md:block md:ml-2">Exit Test</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-bold mb-2">
                {test.data?.title}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground hidden md:block">
                {test.data?.description}
              </p>
            </div>

            <FeatureFlagTooltip>
              <Button type="button" variant="positive" disabled>
                <Pause className="w-4 h-4" />
                <span className="hidden md:block md:ml-2">Pause Test</span>
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
