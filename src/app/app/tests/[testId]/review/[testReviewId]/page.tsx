"use client";

import { api } from "../../../../../../../convex/_generated/api";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLoadingContext } from "@/providers/loading-context";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";

import TestReviewSkeleton from "./components/test-review-skeleton";
import NotFound from "@/components/data-query/not-found";
import TestReviewPage from "./components/test-review-page";

import { type Id } from "convex/_generated/dataModel";
import QueryState from "@/components/data-query/query-state";

export default function ReviewPage() {
  const {
    testReviewId,
    testId,
  }: { testReviewId: Id<"testReviews">; testId: Id<"tests"> } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { setLoading } = useLoadingContext();

  const testReviewPageData = useAuthenticatedQueryWithStatus(
    api.pages.testReviewPage.getTestReviewByIdQuery,
    {
      testReviewId,
      shareToken: token ?? undefined,
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
      query={testReviewPageData}
      pending={<TestReviewSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        const { testReview, permissions, perQuestionTypeAccuracy } = data;
        return (
          <TestReviewPage
            testReview={testReview}
            backRoute={`/app/tests`}
            isViewedByOwner={permissions.isViewedByOwner}
            canTakeTest={permissions.canTakeTest}
            handleRetakeTest={handleRetakeTest}
            perQuestionTypeAccuracy={perQuestionTypeAccuracy}
          />
        );
      }}
    </QueryState>
  );
}
