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
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Test Reviews</CardTitle>
        </div>
        <CardDescription>All test reviews created by you</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[650px]">
          <TestReviewsList classId={classId} />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
