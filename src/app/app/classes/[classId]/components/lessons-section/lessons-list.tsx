"use client";

import { useClass } from "@/providers/class-context-provider";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import ListItem from "@/components/list-item";
import Loader from "@/components/loader";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import LessonsItemDropdown from "./lessons-item-dropdown";

import { Eye, FileText } from "lucide-react";

export default function LessonsList() {
  const { classId, lessons } = useClass();

  if (lessons.isPending) {
    return <Loader />;
  }

  if (lessons.isError) {
    return <div>Error loading lessons</div>;
  }

  if (lessons.isSuccess && lessons.data?.length === 0) {
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
            <span className="text-sm md:text-base w-[14ch] md:w-full text-ellipsis overflow-hidden whitespace-nowrap">
              {lesson.title}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              className="text-xs md:text-base"
              variant="outline"
              size="sm"
            >
              <Link
                href={`/app/classes/${classId}/lessons/${lesson._id}`}
                className="flex items-center"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden md:block ml-2">View</span>
              </Link>
            </Button>

            <FeatureFlagTooltip>
              <Button
                className="hidden md:block"
                variant="outline"
                size="sm"
                disabled
              >
                Generate Test
              </Button>
            </FeatureFlagTooltip>

            <LessonsItemDropdown lessonId={lesson._id} classId={classId} />
          </div>
        </ListItem>
      ))}
    </>
  );
}
