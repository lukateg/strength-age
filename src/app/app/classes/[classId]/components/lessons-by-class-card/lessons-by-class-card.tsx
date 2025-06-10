"use client";

import { useClass } from "@/providers/class-context-provider";
import { useUserContext } from "@/providers/user-provider";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import ListCard, { ListItem } from "@/components/list-card";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import LessonsItemDropdown from "./lessons-item-dropdown";

import { Eye, FileText, Plus } from "lucide-react";

export default function LessonsSectionComponent({
  classId,
}: {
  classId: string;
}) {
  const { lessonsByClass, classData } = useClass();
  const { can } = useUserContext();

  const canCreateLesson = can("lessons", "create", {
    existingLessonsLength: lessonsByClass.data?.length ?? 0,
    class: classData.data,
  });

  return (
    <ListCard
      title="Course Lessons"
      description="PDF documents and study materials"
      items={lessonsByClass.data}
      isLoading={lessonsByClass.isPending}
      cardAction={
        <Button disabled={!canCreateLesson}>
          <Link
            href={`/app/classes/${classId}/new-lesson`}
            className={"flex items-center justify-center"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {canCreateLesson ? "Add new lesson" : "Upgrade to add lesson"}
          </Link>
        </Button>
      }
      renderItem={(lesson) => (
        <ListItem key={lesson._id} icon={FileText} title={lesson.title}>
          <div className="flex gap-2 items-center">
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
      )}
    />
  );
}
