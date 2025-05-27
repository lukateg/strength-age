"use client";
import { api } from "../../../../../convex/_generated/api";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { useTestMutations } from "@/hooks/use-test-mutations";

import AlertDialogModal from "@/components/alert-dialog";
import ListCard, { ListItem } from "@/components/list-card";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { BookOpen, Eye, Trash } from "lucide-react";
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
