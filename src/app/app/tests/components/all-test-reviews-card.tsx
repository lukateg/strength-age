"use client";

import { useTestMutations } from "@/hooks/use-test-mutations";

import ListCard from "@/components/list-card";
import { TestReviewListItem } from "./test-review-list-item";

import { type Doc } from "convex/_generated/dataModel";

export default function AllTestReviewsCard({
  testReviews,
}: {
  testReviews: Doc<"testReviews">[];
}) {
  const { deleteTestReview, copyTestReviewShareLink } = useTestMutations();

  return (
    <ListCard
      title="Test Reviews"
      description="All test reviews created by you"
      height="h-[400px] md:h-[650px]"
      items={testReviews}
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
