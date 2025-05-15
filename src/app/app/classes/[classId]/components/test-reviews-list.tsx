"use client";

import Link from "next/link";

import ListItem from "@/components/list-item";
import Loader from "@/components/loader";
import NotFound from "@/components/not-found";
import AlertDialogModal from "@/components/alert-dialog";

import { Button } from "@/components/ui/button";
import { useClass } from "@/providers/class-context-provider";
import { useTestMutations } from "@/hooks/use-test-mutation";

import { FileText, Eye, Trash } from "lucide-react";

export default function TestsList() {
  const { testReviews } = useClass();
  const { deleteTestReview } = useTestMutations();

  if (testReviews.isPending) {
    return <Loader />;
  }

  if (testReviews.isError) {
    return <NotFound />;
  }

  if (testReviews.isSuccess && testReviews.data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Tests Yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first test to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      {testReviews.data.map((testReview) => (
        <ListItem key={testReview._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm md:text-base w-[14ch] md:w-full text-ellipsis overflow-hidden whitespace-nowrap">
              {testReview.title}
            </span>
          </div>
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
      ))}
    </>
  );
}
