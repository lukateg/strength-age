import Link from "next/link";
import ListCard, { ListItem } from "@/components/list-card";
import FeatureFlagTooltip from "@/components/feature-flag-tooltip";
import LessonsItemDropdown from "./lessons-item-dropdown";

import { Button } from "@/components/ui/button";
import { Eye, FileText, Plus } from "lucide-react";

import { type Lesson } from "@/components/generate-test-form/components/lesson-select-view/lesson-select-table";

export default function LessonsSectionComponent({
  classId,
  lessons,
  canCreateLesson,
}: {
  classId: string;
  lessons: Lesson[];
  canCreateLesson: boolean;
}) {
  return (
    <ListCard
      title="Course Lessons"
      description="PDF documents and study materials"
      items={lessons}
      cardAction={
        <Button
          disabled={!canCreateLesson}
          variant={canCreateLesson ? "positive" : "positive-outline"}
        >
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
