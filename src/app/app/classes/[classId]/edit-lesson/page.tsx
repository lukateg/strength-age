"use client";

import { api } from "../../../../../../convex/_generated/api";

import { useLessonMutations } from "@/hooks/use-lesson-mutations";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { useUserContext } from "@/providers/user-provider";

import LessonForm from "@/app/app/classes/[classId]/lessons/[lessonId]/components/lesson-form/lesson-form";
import NotFound from "@/app/not-found";
import SectionHeader from "@/components/page-components/page-header";
import DangerZone from "@/components/danger-zone";

import { type EditLessonFormData } from "@/types/lesson";

export default function EditLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  const { classId, updateLesson, deleteLesson } = useLessonMutations();
  const { can } = useUserContext();

  const lessonRequest = useAuthenticatedQueryWithStatus(
    api.lessons.getLessonById,
    {
      lessonId: lessonId ?? "skip",
    }
  );

  const canDeleteLesson = can("lessons", "delete", {
    lesson: lessonRequest.data,
  });

  const onSubmit = (data: EditLessonFormData) => {
    void updateLesson({
      lessonId: lessonId ?? "skip",
      title: data.title,
      description: data.description,
    }).then(() => router.push(`/app/classes/${classId}`));
  };

  if (lessonRequest.status === "pending") {
    return <div>lesson skeleton</div>;
  }

  if (lessonRequest.status === "error") {
    return <NotFound />;
  }

  if (!lessonRequest.data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Lesson not found</h3>
        <p className="text-muted-foreground mt-2">
          The lesson you are looking for does not exist anymore.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Edit Lesson"
        description="Edit the lesson details"
        backRoute={`/app/classes/${classId}/lessons/${lessonId}`}
      />

      <LessonForm
        onSubmit={onSubmit}
        isEditMode={true}
        defaultValues={lessonRequest.data}
      />

      {canDeleteLesson && (
        <DangerZone
          onDelete={() => {
            void deleteLesson(lessonId ?? "skip").then(() =>
              router.push(`/app/classes/${classId}`)
            );
          }}
        />
      )}
    </div>
  );
}
