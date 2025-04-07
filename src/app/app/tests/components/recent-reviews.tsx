import { redirect } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ItemsScrollArea from "@/components/items-scroll-area";

import { Brain } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";

export default function RecentReviews({
  testReviewsByUser,
}: {
  testReviewsByUser?: Doc<"testReviews">[];
}) {
  if (!testReviewsByUser) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Test Reviews</CardTitle>
        <CardDescription>
          Latest AI-generated test reviews from your materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[600px]">
          {testReviewsByUser.length > 0 ? (
            testReviewsByUser.map((testReview) => (
              <div
                key={testReview._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{testReview.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    redirect(
                      `/app/tests/${testReview.testId}/review/${testReview._id}`
                    );
                  }}
                >
                  View Results
                </Button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No test reviews found</p>
            </div>
          )}
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
