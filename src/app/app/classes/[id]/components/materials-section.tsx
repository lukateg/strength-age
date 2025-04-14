"use client";

import { useClass } from "@/providers/class-context-provider";
import ItemsScrollArea from "@/components/items-scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import MaterialsList from "./materials-list";
import Link from "next/link";

import { Upload } from "lucide-react";

import { type Id } from "convex/_generated/dataModel";
interface MaterialsSectionComponentProps {
  classId: Id<"classes">;
}

export default function MaterialsSectionComponent({
  classId,
}: MaterialsSectionComponentProps) {
  const { materials } = useClass();

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-2">
          <CardTitle>Course Materials</CardTitle>
          <CardDescription>PDF documents and study materials</CardDescription>
        </div>
        <Button asChild>
          <Link href={`/app/classes/${classId}/file-upload`}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Materials
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[650px]">
          <MaterialsList materials={materials} />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
