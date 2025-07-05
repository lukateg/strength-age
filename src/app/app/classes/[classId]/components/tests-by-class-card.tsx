"use client";

import { useTestMutations } from "@/hooks/use-test-mutations";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ListCard, { ListItem } from "@/components/list-card";
import AlertDialogModal from "@/components/alert-dialog";
import Link from "next/link";

import { BookOpen, Eye, Trash, Upload } from "lucide-react";
import { type Doc } from "convex/_generated/dataModel";
import { TestReviewListItem } from "@/app/app/tests/components/test-review-list-item";

export default function TestsSection({
  classId,
  tests,
  canCreateTest,
  testReviews,
}: {
  classId: string;
  canCreateTest: boolean;
  tests: Doc<"tests">[];
  testReviews: Doc<"testReviews">[];
}) {
  const { deleteTest, deleteTestReview, isPending, copyTestReviewShareLink } =
    useTestMutations();

  return (
    <div>
      <CardHeader className="flex flex-col gap-2 md:flex-row justify-between">
        <div>
          <CardTitle className="text-xl md:text-2xl">Course Tests</CardTitle>
          <CardDescription className="text-sm md:text-base">
            AI-generated tests from your materials
          </CardDescription>
        </div>
        <Button
          disabled={!canCreateTest}
          variant="default"
          className="text-xs md:text-base"
        >
          <Link
            href={`/app/classes/${classId}/generate-test`}
            className="flex items-center justify-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            {canCreateTest ? "Generate Test" : "Limit Reached"}
          </Link>
        </Button>
      </CardHeader>

      <div className="grid xl:grid-cols-2 gap-6">
        <ListCard
          title="Recent Tests"
          description="Latest AI-generated tests for you"
          items={tests}
          renderItem={(test) => (
            <ListItem key={test._id} icon={BookOpen} title={test.title}>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/app/tests/${test._id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="hidden md:block ml-2">Preview</span>
                  </Link>
                </Button>

                <AlertDialogModal
                  onConfirm={async () => {
                    if (test?._id) {
                      await deleteTest(test._id);
                    }
                  }}
                  title="Delete Test"
                  description="Are you sure you want to delete this test?"
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

        <ListCard
          title="Recent Test Reviews"
          description="Latest AI test test reviews"
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
      </div>
    </div>
  );
}
