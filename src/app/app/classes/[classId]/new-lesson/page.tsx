"use client";

import type * as z from "zod";
import { useRouter } from "next/navigation";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";

import LessonForm from "../lessons/[lessonId]/components/lesson-form/lesson-form";
import SectionHeader from "@/components/page-components/page-header";
import QueryState from "@/components/data-query/query-state";
import NewLessonPageSkeleton from "./components/new-lesson-page-skeleton";

import { type createLessonSchema } from "@/lib/schemas";
import { useClass } from "@/providers/class-context-provider";

type LessonFormData = z.infer<typeof createLessonSchema>;

// TODO: implement suspense

export default function NewLessonPage() {
  const router = useRouter();
  const { classData } = useClass();

  const {
    classId,
    createLesson,
    uploadNewMaterialsToLesson,
    addExistingMaterialsToLesson,
    isUploading,
    isPending,
  } = useLessonMutations();

  const onSubmit = async (data: LessonFormData) => {
    const lessonId = await createLesson(data);
    if (!lessonId) return;

    const shouldCreateLessonWithNewMaterials =
      data.materialsToUpload.length && !data.showExistingMaterials;
    const shouldCreateLessonWithExistingMaterials =
      data.materialsToAdd.length && data.showExistingMaterials;

    if (shouldCreateLessonWithNewMaterials) {
      void uploadNewMaterialsToLesson({
        lessonId,
        materialsToUpload: data.materialsToUpload,
      });
    } else if (shouldCreateLessonWithExistingMaterials) {
      await addExistingMaterialsToLesson({
        lessonId,
        materialIds: data.materialsToAdd,
      });
    }

    router.push(`/app/classes/${classId}`);
  };

  return (
    <QueryState query={classData} pending={<NewLessonPageSkeleton />}>
      {(data) => {
        const { materials } = data;
        return (
          <div className="space-y-6">
            <SectionHeader
              title="New Lesson"
              description="Create a new lesson for your class"
              backRoute={`/app/classes/${classId}`}
            />
            <LessonForm
              onSubmit={onSubmit}
              materials={materials}
              isSubmitting={isUploading || isPending}
            />
          </div>
        );
      }}
    </QueryState>
  );
}
