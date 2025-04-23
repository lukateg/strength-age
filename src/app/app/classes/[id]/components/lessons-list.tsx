"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

import ListItem from "@/components/list-item";
import Loader from "@/components/loader";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";

import { Button } from "@/components/ui/button";
import { useClass } from "@/providers/class-context-provider";

export default function LessonsList() {
  const { classId, lessons } = useClass();

  if (lessons.isPending) {
    return <Loader />;
  }

  if (lessons.isError) {
    return <div>Error loading lessons</div>;
  }

  if (lessons.isSuccess && !lessons.data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Lessons Yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first lesson to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      {lessons.data?.map((lesson) => (
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
            <FeatureFlagTooltip>
              <Button variant="outline" size="sm" disabled>
                Generate Test
              </Button>
            </FeatureFlagTooltip>
          </div>
        </ListItem>
      ))}
    </>
  );
}
