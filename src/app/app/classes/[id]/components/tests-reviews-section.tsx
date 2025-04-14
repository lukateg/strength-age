import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TestReviewsList from "./test-reviews-list";
import ItemsScrollArea from "@/components/items-scroll-area";

export default function TestReviewsSection({ classId }: { classId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-2">
          <CardTitle>Test Reviews</CardTitle>
          <CardDescription>All test reviews created by you</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[650px]">
          <TestReviewsList classId={classId} />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
