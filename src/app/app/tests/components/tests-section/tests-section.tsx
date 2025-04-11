import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TestsList from "./tests-list";
import ItemsScrollArea from "@/components/items-scroll-area";

export default function TestsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Tests</CardTitle>
        </div>
        <CardDescription>All tests created by you</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[650px]">
          <TestsList />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
