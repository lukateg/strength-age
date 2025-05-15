"use client";

import { useClass } from "@/providers/class-context-provider";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import ListCard, { ListItem } from "@/components/list-card";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import LessonsItemDropdown from "./lessons-item-dropdown";

import { Eye, FileText } from "lucide-react";

import { type Id } from "convex/_generated/dataModel";

export default function LessonsSectionComponent({
  classId,
}: {
  classId: Id<"classes">;
}) {
  const { lessonsByClass } = useClass();

  return (
    <ListCard
      title="Course Lessons"
      description="PDF documents and study materials"
      items={lessonsByClass.data}
      isLoading={lessonsByClass.isPending}
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
