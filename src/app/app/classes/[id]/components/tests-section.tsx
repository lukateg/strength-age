"use client";

import Link from "next/link";

import { useClass } from "@/providers/class-context-provider";

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

export default function TestsSection({ classId }: { classId: string }) {
  const { tests } = useClass();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Course Tests</CardTitle>

          <Button asChild>
            <Link href={`/app/classes/${classId}/generate-test`}>
              <Upload className="h-4 w-4 mr-2" />
              Generate Test
            </Link>
          </Button>
        </div>
        <CardDescription>
          AI-generated tests from your materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[650px]">
          <TestsList tests={tests} />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
