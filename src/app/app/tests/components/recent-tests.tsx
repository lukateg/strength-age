import ItemsScrollArea from "@/components/items-scroll-area";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { BookOpen } from "lucide-react";

import { type Doc } from "convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentTests({
  testsByUser,
}: {
  testsByUser?: Doc<"tests">[];
}) {
  if (!testsByUser) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tests</CardTitle>
        <CardDescription>
          Your recently created or modified tests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[600px]">
          {testsByUser.length > 0 ? (
            testsByUser.map((test) => (
              <div
                key={test._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{test.title}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/app/tests/${test._id}`}>Retake</Link>
                </Button>
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
