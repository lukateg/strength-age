"use client";

import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import { api } from "../../../../../convex/_generated/api";

import TestSkeleton from "./components/test-skeleton";
import Link from "next/link";
import ListCard from "@/components/list-card";
import AlertDialogModal from "@/components/alert-dialog";
import TestSuccessRate from "./components/test-success-rate";
import QueryState from "@/components/data-query/query-state";
import NotFound from "@/components/data-query/not-found";

import { useTestMutations } from "@/hooks/use-test-mutations";
import { ArrowLeft, Brain, Eye, Trash, Play } from "lucide-react";
import { TestDetails } from "./components/test-details";
import { TestActions } from "./components/test-actions";
import { ListItem } from "@/components/list-card";
import { useLoadingContext } from "@/providers/loading-context";

export type TestQuestion = {
  questionText: string;
  questionType: string;
  availableAnswers?: string[];
  correctAnswer: string[];
};

export default function TestPreviewPage() {
  const { testId }: { testId: string } = useParams();
  const { deleteTestReview, isPending } = useTestMutations();
  const { setLoading } = useLoadingContext();

  const router = useRouter();

  const testData = useAuthenticatedQueryWithStatus(
    api.pages.testPage.getTestPageData,
    {
      testId,
    }
  );

  const handleRetakeTest = async () => {
    setLoading(true, "Loading test...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/app/tests/${testId}/active`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
  };

  return (
    <QueryState
      query={testData}
      pending={<TestSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold">{data.title}</h1>
                </div>
                <p className="text-muted-foreground">{data.description}</p>
              </div>

              <AlertDialogModal
                onConfirm={handleRetakeTest}
                title="Retake Test"
                description="After you press confirm you will be redirected to the test. Good luck!"
                variant="positive"
                alertTrigger={
                  <Button className="text-xs md:text-base" variant="positive">
                    <Play className="h-4 w-4 mr-2" />
                    Start Test!
                  </Button>
                }
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="col-span-2 space-y-4">
                <TestDetails
                  questionCount={data.questions.length}
                  questionTypes={data.questionTypes}
                  difficulty={data.difficulty}
                  lessons={data.lessons.map((lesson) => ({
                    _id: lesson.lessonId,
                    title: lesson.lessonTitle,
                  }))}
                  classTitle={data.class?.title}
                />

                <TestActions handleRetakeTest={handleRetakeTest} />
              </div>

              <div className="col-span-1">
                <TestSuccessRate testReviews={data.testReviews} />
              </div>
            </div>

            <ListCard
              title="Previous Attempts"
              description="All test attempts you took"
              height="h-[400px] md:h-[300px]"
              items={data.testReviews}
              isLoading={isPending}
              renderItem={(testReview) => (
                <ListItem
                  key={testReview._id}
                  icon={Brain}
                  title={testReview.title}
                >
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Link
                        href={`/app/tests/${testReview.testId}/review/${testReview._id}`}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden md:block ml-2">Results</span>
                      </Link>
                    </Button>

                    <AlertDialogModal
                      onConfirm={async () => {
                        if (testReview?._id) {
                          await deleteTestReview(testReview._id);
                        }
                      }}
                      title="Delete Test Review"
                      description="Are you sure you want to delete this test review?"
                      variant="destructive"
                      alertTrigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-base"
                          disabled={isPending}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      }
                    />
                  </div>
                </ListItem>
              )}
            />
          </div>
        );
      }}
    </QueryState>
  );
}
