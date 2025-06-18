"use client";

import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useLesson } from "@/providers/lesson-provider";
import { useRouter } from "next/navigation";

import LessonForm from "@/app/app/classes/[classId]/lessons/[lessonId]/components/lesson-form/lesson-form";
import NotFound from "@/app/not-found";
import SectionHeader from "@/components/page-components/page-header";
import DangerZone from "@/components/danger-zone";

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

  if (lesson.isPending) {
    return <div>lesson skeleton loading...</div>;
  }

  if (lesson.isError) {
    return <NotFound />;
  }

  if (!lesson.data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Lesson not found</h3>
        <p className="text-muted-foreground mt-2">
          The lesson you are looking for does not exist anymore.
        </p>
      </div>
    );
  }

  const { permissions } = lesson.data;

  return (
    <div className="space-y-10">
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
}
