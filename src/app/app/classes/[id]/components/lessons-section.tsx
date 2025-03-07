"use client";
import Link from "next/link";

import { useClass } from "@/providers/class-context-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FileText } from "lucide-react";

// TODO:
// - add case when there are no lessons

export default function LessonsSectionComponent() {
  const { classId, lessons } = useClass();

  // if (isLoading) return <div>Loading materials...</div>;
  if (!lessons) return <div>no lessons</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Course Lessons</CardTitle>
          <Button asChild>
            <Link href={`/app/classes/${classId}/new-lesson`}>
              Create new Lesson
            </Link>
          </Button>
        </div>
        <CardDescription>PDF documents and study materials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{lesson.title}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Link href={`/app/classes/${classId}/lessons/${lesson._id}`}>
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  Generate Test
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
