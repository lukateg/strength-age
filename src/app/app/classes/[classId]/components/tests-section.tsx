import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ItemsScrollArea from "@/components/items-scroll-area";
import TestsList from "./tests-list";

import { Upload } from "lucide-react";
import TestReviewsList from "./test-reviews-list";

export default function TestsSection({ classId }: { classId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">Course Tests</CardTitle>
          <CardDescription className="text-sm md:text-base">
            AI-generated tests from your materials
          </CardDescription>
        </div>
        <Button asChild className="text-xs md:text-base">
          <Link href={`/app/classes/${classId}/generate-test`}>
            <Upload className="h-4 w-4 mr-2" />
            Generate Test
          </Link>
        </Button>
      </CardHeader>

      <div className="grid xl:grid-cols-2">
        <div>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Generated Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemsScrollArea className="h-[400px] md:h-[650px]">
              <TestsList />
            </ItemsScrollArea>
          </CardContent>
        </div>

        <div>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Test Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemsScrollArea className="h-[400px] md:h-[650px]">
              <TestReviewsList />
            </ItemsScrollArea>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
