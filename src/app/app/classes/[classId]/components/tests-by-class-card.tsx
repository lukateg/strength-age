"use client";

import { useTestMutations } from "@/hooks/use-test-mutation";
import { useClass } from "@/providers/class-context-provider";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ListCard, { ListItem } from "@/components/list-card";
import RetryTestButton from "@/components/retry-test-button";
import AlertDialogModal from "@/components/alert-dialog";
import Link from "next/link";

import { BookOpen, Brain, Eye, RotateCcw, Trash, Upload } from "lucide-react";

export default function TestsSection({ classId }: { classId: string }) {
  const { testsByClass, testReviewsByClass } = useClass();
  const { deleteTest, deleteTestReview } = useTestMutations();

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">Course Tests</CardTitle>
          <CardDescription className="text-sm md:text-base">
            AI-generated tests from your materials
          </CardDescription>
        </div>
        <Button asChild className="text-xs md:text-base">
          <Link href={`/app/classes/${classId}/generate-test`}>
            <Upload className="h-4 w-4 mr-2" />
            Generate Test
          </Link>
        </Button>
      </CardHeader>

      <div className="grid xl:grid-cols-2 gap-6 px-6">
        <ListCard
          title="Recent Tests"
          description="Latest AI-generated tests for you"
          items={testsByClass.data}
          isLoading={testsByClass.isPending}
          renderItem={(test) => (
            <ListItem key={test._id} icon={BookOpen} title={test.title}>
              <div className="flex gap-2">
                <RetryTestButton
                  to={`/app/tests/${test._id}`}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Retry</span>
                </RetryTestButton>

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
          items={testReviewsByClass.data}
          isLoading={testReviewsByClass.isPending}
          renderItem={(testReview) => (
            <ListItem
              key={testReview._id}
              icon={Brain}
              title={testReview.title}
            >
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/app/tests/${testReview.testId}/review/${testReview._id}`}
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
      </div>
    </Card>
  );
}
