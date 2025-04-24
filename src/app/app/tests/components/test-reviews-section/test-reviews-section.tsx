import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TestReviewsList from "./test-reviews-list";
import ItemsScrollArea from "@/components/items-scroll-area";

export default function TestReviewsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Test Reviews</CardTitle>
        </div>
        <CardDescription>All test reviews created by you</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[400px] md:h-[650px]">
          <TestReviewsList />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
