"use client";

import { useTests } from "@/providers/tests-provider";
import { useTestMutations } from "@/hooks/use-test-mutation";

import Link from "next/link";
import ListCard, { ListItem } from "@/components/list-card";
import AlertDialogModal from "@/components/alert-dialog";

import { Button } from "@/components/ui/button";

import { Brain, Eye, Trash } from "lucide-react";

export default function TestReviewsSection() {
  const { testReviewsByUser } = useTests();
  const { deleteTestReview } = useTestMutations();

  return (
    <ListCard
      title="Test Reviews"
      description="All test reviews created by you"
      height="h-[400px] md:h-[650px]"
      items={testReviewsByUser?.data}
      isLoading={testReviewsByUser?.isPending}
      renderItem={(testReview) => (
        <ListItem key={testReview._id} icon={Brain} title={testReview.title}>
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
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              }
            />
          </div>
        </ListItem>
      )}
    />
  );
}
