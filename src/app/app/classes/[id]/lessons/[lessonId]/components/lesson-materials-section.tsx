"use client";

import { api } from "../../../../../../../../convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Headphones } from "lucide-react";
import Link from "next/link";

export default function LessonMaterialsSectionComponent() {
  const { lessonId }: { lessonId: Id<"lessons"> } = useParams();
  const lessonData = useQuery(api.lessons.getLessonData, {
    lessonId,
  });

  if (!lessonData) {
    return <div>Loading...</div>;
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
        <div className="space-y-4">
          {lessonPDFs.map((pdf) => (
            <div
              key={pdf._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <Headphones className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{pdf.fileUrl}</span>
              </div>
              <Button variant="outline" size="sm">
                Play
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
