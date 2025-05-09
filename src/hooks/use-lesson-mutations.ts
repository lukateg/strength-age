import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useClass } from "@/providers/class-context-provider";
import { toast } from "sonner";

import {
  type LessonFormData,
  type CreateBasicLessonParams,
  type AddPDFToLessonParams,
} from "@/types/lesson";
import { useUploadThing } from "./use-upload-thing";
import { isAppError } from "../../convex/utils/utils";

import { type Id } from "convex/_generated/dataModel";

export const useLessonMutations = () => {
  const { classId, materials: allMaterials } = useClass();
  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onUploadError: (error: Error) => {
      throw error;
    },
  });

  // Mutations
  const createLessonMutation = useMutation(api.lessons.createLesson);
  const addManyPdfsToLessonMutation = useMutation(
    api.lessons.addManyPdfsToLesson
  );

  const createLesson = useCallback(
    async (data: LessonFormData) => {
      try {
        const params: CreateBasicLessonParams = {
          classId,
          title: data.lessonTitle,
          description: data.lessonDescription,
        };

        const lessonId = await createLessonMutation(params);

        toast.success("Lesson created successfully");

        return lessonId;
      } catch (error) {
        let errorData = "Failed to create lesson. Please try again.";
        if (isAppError(error)) {
          errorData = error.data.message;
        }
        toast.error(errorData);
      }
    },
    [classId, createLessonMutation]
  );

  const uploadNewPdfsToLesson = useCallback(
    async ({
      uploadedMaterials,
      lessonId,
    }: {
      uploadedMaterials: File[];
      lessonId: Id<"lessons">;
    }) => {
      const toastId = toast.loading("Please wait while we upload your files");

      try {
        await startUpload(uploadedMaterials, { lessonId, classId });

        toast.dismiss(toastId);
        toast.success("PDFs uploaded to lesson successfully");
      } catch (error) {
        console.error("Failed to upload new PDFs to lesson:", error);
        toast.dismiss(toastId);
        toast.error("Failed to upload PDFs to lesson. Please try again");
      }
    },
    [startUpload, classId]
  );

  const addExistingPdfsToLesson = useCallback(
    async (params: AddPDFToLessonParams) => {
      try {
        await addManyPdfsToLessonMutation({
          lessonId: params.lessonId,
          pdfIds: params.pdfIds,
          classId,
        });

        toast.success("PDFs added to lesson successfully");
      } catch (error) {
        console.error("Failed to add PDF to lesson:", error);
        toast.error("Failed to add PDFs to lesson. Please try again");
      }
    },
    [addManyPdfsToLessonMutation, classId]
  );

  return {
    isUploading,
    createLesson,
    addExistingPdfsToLesson,
    uploadNewPdfsToLesson,
    classId,
    allMaterials,
  };
};
