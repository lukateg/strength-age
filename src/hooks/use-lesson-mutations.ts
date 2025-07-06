import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";

import { useCallback, useState } from "react";
import { useMutation } from "convex/react";
import { useClass } from "@/providers/class-context-provider";
import { useUploadThing } from "./use-upload-thing";

import {
  type LessonFormData,
  type CreateBasicLessonParams,
  type AddMaterialToLessonParams,
  type EditLessonFormData,
} from "@/types/lesson";

export const useLessonMutations = () => {
  const { classId } = useClass();
  const { startUpload, isUploading } = useUploadThing("materialUploader", {
    onUploadError: (error: Error) => {
      throw error;
    },
  });
  const [isPending, setIsPending] = useState(false);

  // Mutations
  const createLessonMutation = useMutation(api.lessons.createLessonMutation);
  const addManyMaterialsToLessonMutation = useMutation(
    api.lessons.addManyMaterialsToLessonMutation
  );
  const updateLessonMutation = useMutation(api.lessons.updateLessonMutation);
  const deleteLessonMutation = useMutation(api.lessons.deleteLessonMutation);

  const createLesson = useCallback(
    async ({ title, description }: LessonFormData) => {
      try {
        setIsPending(true);
        const params: CreateBasicLessonParams = {
          classId,
          title,
          description,
        };

        const lessonId = await createLessonMutation(params);

        toast.success("Lesson created successfully");

        return lessonId;
      } catch (error) {
        toastError(error, "Failed to create lesson. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [classId, createLessonMutation]
  );

  const uploadNewMaterialsToLesson = useCallback(
    async ({
      materialsToUpload,
      lessonId,
    }: {
      materialsToUpload: File[];
      lessonId?: string;
    }) => {
      const toastId = toast.loading(
        "We're uploading your files. Please don't refresh or close the page."
      );

      try {
        setIsPending(true);
        await startUpload(materialsToUpload, { lessonId, classId });

        toast.dismiss(toastId);
        toast.success("Materials uploaded to lesson successfully");
      } catch (error) {
        toast.dismiss(toastId);
        toastError(
          error,
          "Failed to upload materials to lesson. Please try again"
        );
      } finally {
        setIsPending(false);
      }
    },
    [startUpload, classId]
  );

  const addExistingMaterialsToLesson = useCallback(
    async (params: AddMaterialToLessonParams) => {
      try {
        setIsPending(true);
        await addManyMaterialsToLessonMutation({
          lessonId: params.lessonId,
          materialIds: params.materialIds,
          classId,
        });

        toast.success("Materials added to lesson successfully");
      } catch (error) {
        toastError(
          error,
          "Failed to add materials to lesson. Please try again"
        );
      } finally {
        setIsPending(false);
      }
    },
    [addManyMaterialsToLessonMutation, classId]
  );

  const updateLesson = useCallback(
    async (data: { lessonId: string } & EditLessonFormData) => {
      const { lessonId, title, description } = data;
      try {
        setIsPending(true);
        await updateLessonMutation({
          lessonId,
          title,
          description,
        });

        toast.success("Lesson updated successfully");
      } catch (error) {
        toastError(error, "Failed to update lesson. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [updateLessonMutation]
  );

  const deleteLesson = useCallback(
    async (lessonId: string) => {
      try {
        setIsPending(true);
        await deleteLessonMutation({ lessonId });
        toast.success("Lesson deleted successfully");
      } catch (error) {
        toastError(error, "Failed to delete lesson. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [deleteLessonMutation]
  );

  return {
    isPending,
    isUploading,
    createLesson,
    addExistingMaterialsToLesson,
    uploadNewMaterialsToLesson,
    updateLesson,
    deleteLesson,
    classId,
  };
};
