"use client";

import { useTestMutations } from "@/hooks/use-test-mutation";
import { useTests } from "@/providers/tests-provider";

import ListCard, { ListItem } from "@/components/list-card";
import RetryTestButton from "@/components/retry-test-button";
import AlertDialogModal from "@/components/alert-dialog";

import { Button } from "@/components/ui/button";

import { FileText, RotateCcw, Trash } from "lucide-react";

export default function TestsSection() {
  const { testsByUser } = useTests();
  const { deleteTest } = useTestMutations();

  return (
    <ListCard
      title="Tests"
      description="All tests created by you"
      height="h-[400px] md:h-[650px]"
      items={testsByUser?.data}
      isLoading={testsByUser?.isPending}
      renderItem={(test) => (
        <ListItem key={test._id} icon={FileText} title={test.title}>
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
