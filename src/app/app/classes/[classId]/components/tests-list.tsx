"use client";

import { useClass } from "@/providers/class-context-provider";
import { useTestMutations } from "@/hooks/use-test-mutation";

import ListItem from "@/components/list-item";
import RetryTestButton from "@/components/retry-test-button";
import AlertDialogModal from "@/components/alert-dialog";

import { Button } from "@/components/ui/button";

import { FileText, Loader, RotateCcw, Trash } from "lucide-react";

export default function TestsList() {
  const { tests } = useClass();
  const { deleteTest } = useTestMutations();

  if (tests.isPending) {
    return <Loader />;
  }

  if (tests.isError) {
    return <div>Error loading tests</div>;
  }

  if (tests.isSuccess && tests.data.length === 0) {
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
      {tests.data?.map((test) => (
        <ListItem key={test._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm md:text-base w-[14ch] md:w-full text-ellipsis overflow-hidden whitespace-nowrap">
              {test?.title}
            </span>
          </div>
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
      ))}
    </>
  );
}
