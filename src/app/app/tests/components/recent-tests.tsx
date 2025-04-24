import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import ItemsScrollArea from "@/components/items-scroll-area";
import RetryTestButton from "@/components/retry-test-button";

import { BookOpen, RotateCcw } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";

export default function RecentTests({
  testsByUser,
}: {
  testsByUser?: Doc<"tests">[] | null;
}) {
  if (!testsByUser) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tests</CardTitle>
        <CardDescription>Latest AI-generated tests for you</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[400px] md:h-[600px]">
          {testsByUser.length > 0 ? (
            testsByUser.map((test) => (
              <div
                key={test._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm md:text-base w-[14ch] md:w-full text-ellipsis overflow-hidden whitespace-nowrap">
                    {test.title}
                  </span>
                </div>
                <RetryTestButton
                  to={`/app/tests/${test._id}`}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Retry</span>
                </RetryTestButton>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No tests found</p>
            </div>
          )}
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
