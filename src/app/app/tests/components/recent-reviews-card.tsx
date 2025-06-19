"use client";

import { useTestMutations } from "@/hooks/use-test-mutations";
import { TestReviewListItem } from "./test-review-list-item";
import ListCard from "@/components/list-card";
import { type Doc } from "convex/_generated/dataModel";

export default function RecentReviews({
  testReviews,
}: {
  testReviews: Doc<"testReviews">[];
}) {
  const { deleteTestReview, isPending, copyTestReviewShareLink } =
    useTestMutations();

  const recentTestReviews = testReviews.sort((a, b) => {
    return (
      new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime()
    );
  });

  return (
    <ListCard
      title="Recent Test Reviews"
      description="Latest AI test reviews"
      items={recentTestReviews}
      renderItem={(testReview) => (
        <TestReviewListItem
          key={testReview._id}
          testReview={testReview}
          onDelete={async () => {
            if (testReview?._id) {
              await deleteTestReview(testReview._id);
            }
          }}
          onShare={async (testReviewId, testId) => {
            await copyTestReviewShareLink(testReviewId, testId);
          }}
        />
      )}
    />
  );
}
