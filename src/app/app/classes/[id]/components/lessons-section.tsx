"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useClass } from "@/providers/class-context-provider";

import { FileText } from "lucide-react";
import Link from "next/link";

// TODO:
// - hook up lessons from database and show them

export default function LessonsSectionComponent() {
  const { classId } = useClass();

  // if (isLoading) return <div>Loading materials...</div>;
  // if (error) return <div>Error: {error}</div>;
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
          {[
            "Chapter 1 - Introduction to Calculus",
            "Chapter 2 - Derivatives",
            "Chapter 3 - Integrals",
          ].map((material) => (
            <div
              key={material}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{material}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
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
