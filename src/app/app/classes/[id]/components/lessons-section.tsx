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

import ItemsScrollArea from "@/components/items-scroll-area";
import ListItem from "@/components/list-item";

import { FileText } from "lucide-react";

export default function LessonsSectionComponent() {
  const { classId, lessons } = useClass();

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
        <ItemsScrollArea className="h-[650px]">
          {lessons.map((lesson) => (
            <ListItem key={lesson._id} variant="outline">
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
            </ListItem>
          ))}
        </ItemsScrollArea>
      </CardContent>
    </Card>
  );
}
