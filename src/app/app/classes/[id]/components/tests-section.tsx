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

      <CardContent>
        <ItemsScrollArea className="h-[400px] md:h-[650px]">
          <TestsList tests={tests.data} />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
