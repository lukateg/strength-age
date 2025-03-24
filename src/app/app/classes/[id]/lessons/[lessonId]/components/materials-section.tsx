"use client";

import { api } from "../../../../../../../../convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ItemsScrollArea from "@/components/items-scroll-area";
import MaterialsList from "@/app/app/classes/[id]/components/materials-list";
import Loader from "@/components/loader";

export default function MaterialsSection() {
  const { lessonId }: { lessonId: Id<"lessons"> } = useParams();
  // TODO check this useQuery
  const lessonData = useQuery(api.lessons.getLessonData, {
    lessonId,
  });

  if (!lessonData) {
    return <Loader />;
  }

  const { lesson, lessonPDFs } = lessonData;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{lesson?.title}</CardTitle>
          <CardDescription>{lesson?.description}</CardDescription>
        </div>
        <Link
          href={`/app/classes/${lesson?.classId}/lessons/${lesson?._id}/file-upload`}
        >
          <Button>Add new material</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[650px]">
          <MaterialsList materials={lessonPDFs} />
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
