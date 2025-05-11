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
      <CardHeader className="flex flex-col gap-2 md:flex-row justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">Test Reviews</CardTitle>
          <CardDescription className="text-sm md:text-base">
            All test reviews created by you
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[400px] md:h-[650px]">
          <TestReviewsList />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
