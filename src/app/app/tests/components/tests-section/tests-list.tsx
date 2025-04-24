"use client";

import { FileText, RotateCcw } from "lucide-react";
import { useTests } from "@/providers/tests-provider";

import Loader from "@/components/loader";
import ListItem from "@/components/list-item";
import RetryTestButton from "@/components/retry-test-button";

export default function TestsList() {
  const { testsByUser } = useTests();

  if (testsByUser?.isPending) {
    return <Loader />;
  }

  if (testsByUser?.data?.length === 0) {
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
      {testsByUser?.data?.map((test) => (
        <ListItem key={test._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm md:text-base w-[14ch] md:w-full text-ellipsis overflow-hidden whitespace-nowrap">
              {test.title}
            </span>
          </div>
          <div className="flex gap-2">
            <RetryTestButton to={`/app/tests/${test._id}`} variant="outline">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden md:block ml-2">Retry</span>
            </RetryTestButton>
          </div>
        </ListItem>
      ))}
    </>
  );
}
