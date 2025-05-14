import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { isAppError } from "../../convex/utils/utils";
import { useCallback } from "react";
import { useMutation } from "convex/react";
import { useClass } from "@/providers/class-context-provider";
import { useUploadThing } from "./use-upload-thing";

import {
  type LessonFormData,
  type CreateBasicLessonParams,
  type AddPDFToLessonParams,
  type EditLessonFormData,
} from "@/types/lesson";

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
  const updateLessonMutation = useMutation(api.lessons.updateLesson);
  const deleteLessonMutation = useMutation(api.lessons.deleteLesson);

  const createLesson = useCallback(
    async ({ title, description }: LessonFormData) => {
      try {
        const params: CreateBasicLessonParams = {
          classId,
          title,
          description,
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
      materialsToUpload,
      lessonId,
    }: {
      materialsToUpload: File[];
      lessonId: Id<"lessons">;
    }) => {
      const toastId = toast.loading("Please wait while we upload your files");

      try {
        await startUpload(materialsToUpload, { lessonId, classId });

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

  const updateLesson = useCallback(
    async (data: { lessonId: string } & EditLessonFormData) => {
      const { lessonId, title, description } = data;
      try {
        await updateLessonMutation({
          lessonId,
          title,
          description,
        });

        toast.success("Lesson updated successfully");
      } catch (error) {
        let errorData = "Failed to update lesson. Please try again.";
        if (isAppError(error)) {
          errorData = error.data.message;
        }
        toast.error(errorData);
      }
    },
    [updateLessonMutation]
  );

  const deleteLesson = useCallback(
    async (lessonId: string) => {
      try {
        await deleteLessonMutation({ lessonId });
        toast.success("Lesson deleted successfully");
      } catch (error) {
        console.error("Failed to delete lesson:", error);
        toast.error("Failed to delete lesson. Please try again.");
      }
    },
    [deleteLessonMutation]
  );

  return {
    isUploading,
    createLesson,
    addExistingPdfsToLesson,
    uploadNewPdfsToLesson,
    updateLesson,
    deleteLesson,
    classId,
    allMaterials,
  };
};
