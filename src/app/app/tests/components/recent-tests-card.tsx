"use client";
import { api } from "../../../../../convex/_generated/api";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { useTestMutations } from "@/hooks/use-test-mutation";

import AlertDialogModal from "@/components/alert-dialog";
import RetryTestButton from "@/components/retry-test-button";
import ListCard, { ListItem } from "@/components/list-card";

import { Button } from "@/components/ui/button";

import { BookOpen, RotateCcw, Trash } from "lucide-react";
export default function RecentTests() {
  const recentTests = useAuthenticatedQueryWithStatus(
    api.tests.getWeeklyTestsByUserId
  );
  const { deleteTest } = useTestMutations();

  return (
    <ListCard
      title="Recent Tests"
      description="Latest AI-generated tests for you"
      items={recentTests?.data}
      isLoading={recentTests?.isPending}
      renderItem={(test) => (
        <ListItem key={test._id} icon={BookOpen} title={test.title}>
          <div className="flex gap-2">
            <RetryTestButton to={`/app/tests/${test._id}`} variant="outline">
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
  );
}
