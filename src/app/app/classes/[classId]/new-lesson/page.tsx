"use client";

import type * as z from "zod";
import { useRouter } from "next/navigation";
import { useLessonMutations } from "@/hooks/use-lesson-mutations";

import LessonForm from "../lessons/[lessonId]/components/lesson-form/lesson-form";
import SectionHeader from "@/components/page-components/page-header";

import { type createLessonSchema } from "@/lib/schemas";
import { useClass } from "@/providers/class-context-provider";

type LessonFormData = z.infer<typeof createLessonSchema>;

export default function NewLessonPage() {
  const router = useRouter();
  const { classData } = useClass();

  const {
    classId,
    createLesson,
    uploadNewPdfsToLesson,
    addExistingPdfsToLesson,
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
      void uploadNewPdfsToLesson({
        lessonId,
        materialsToUpload: data.materialsToUpload,
      });
    } else if (shouldCreateLessonWithExistingMaterials) {
      await addExistingPdfsToLesson({
        lessonId,
        pdfIds: data.materialsToAdd,
      });
    }

    router.push(`/app/classes/${classId}`);
  };

  if (!classData.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title="New Lesson"
        description="Create a new lesson for your class"
        backRoute={`/app/classes/${classId}`}
      />
      <LessonForm
        onSubmit={onSubmit}
        materials={classData.data?.materials}
        isSubmitting={isUploading || isPending}
      />
    </div>
  );
}
