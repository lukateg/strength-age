"use client";

import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useLesson } from "@/providers/lesson-provider";
import { useRouter } from "next/navigation";

import LessonForm from "@/app/app/classes/[classId]/lessons/[lessonId]/components/lesson-form/lesson-form";
import NotFound from "@/app/not-found";
import SectionHeader from "@/components/page-components/page-header";
import DangerZone from "@/components/danger-zone";
import QueryState from "@/components/data-query/query-state";
import EditLessonSkeleton from "./components/edit-lesson-skeleton";

import { type EditLessonFormData } from "@/types/lesson";

export default function EditLessonPage() {
  const router = useRouter();

  const { classId, updateLesson, deleteLesson, isPending } =
    useLessonMutations();
  const { lesson } = useLesson();

  const onSubmit = (data: EditLessonFormData) => {
    void updateLesson({
      lessonId: lesson.data?.lessonId ?? "skip",
      title: data.title,
      description: data.description,
    }).then(() => router.push(`/app/classes/${classId}`));
  };

  return (
    <QueryState
      query={lesson}
      pending={<EditLessonSkeleton />}
      noData={<NotFound />}
    >
      {(data) => {
        const { permissions } = data;
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Edit Lesson"
              description="Edit the lesson details"
              backRoute={`/app/classes/${classId}/lessons/${lesson.data?.lessonId}`}
            />

            <LessonForm
              onSubmit={onSubmit}
              isEditMode={true}
              materials={lesson.data?.materials ?? []}
              defaultValues={lesson.data}
              isSubmitting={isPending}
            />

            {permissions.canDeleteLesson && (
              <DangerZone
                onDelete={() => {
                  void deleteLesson(lesson.data?.lessonId ?? "skip").then(() =>
                    router.push(`/app/classes/${classId}`)
                  );
                }}
                isDeleting={isPending}
              />
            )}
          </div>
        );
      }}
    </QueryState>
  );
}
