"use client";

import { FileText } from "lucide-react";
import { useTests } from "@/providers/tests-provider";
import Link from "next/link";

import ListItem from "@/components/list-item";
import Loader from "@/components/loader";

import { Button } from "@/components/ui/button";

export default function TestsList() {
  const { testReviewsByUser } = useTests();

  if (!testReviewsByUser) {
    return <Loader />;
  }

  if (testReviewsByUser.length === 0) {
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
      {testReviewsByUser.map((testReview) => (
        <ListItem key={testReview._id} variant="outline">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{testReview.title}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Link
                href={`/app/tests/${testReview.testId}/review/${testReview._id}`}
              >
                Review Test
              </Link>
            </Button>
          </div>
        </ListItem>
      ))}
    </>
  );
}
