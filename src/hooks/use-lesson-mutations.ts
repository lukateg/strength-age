import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useClass } from "@/providers/class-context-provider";
import { toast } from "@/hooks/use-toast";

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

        toast({
          title: "Success",
          description: "Lesson created successfully.",
          variant: "default",
        });

        return lessonId;
      } catch (error) {
        let errorData = "Failed to create lesson. Please try again.";
        if (isAppError(error)) {
          errorData = error.data.message;
        }
        toast({
          title: "Error",
          description: errorData,
          variant: "destructive",
        });
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
      const { dismiss } = toast({
        title: "Uploading...",
        description: "Please wait while we upload your files.",
        variant: "default",
        duration: Infinity,
      });

      try {
        await startUpload(uploadedMaterials, { lessonId, classId });

        dismiss();
        toast({
          title: "Success",
          description: "PDFs uploaded to lesson successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to upload new PDFs to lesson:", error);
        dismiss();

        toast({
          title: "Error",
          description: "Failed to upload PDFs to lesson. Please try again.",
          variant: "destructive",
        });
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
        });

        toast({
          title: "Success",
          description: "PDFs added to lesson successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to add PDF to lesson:", error);
        toast({
          title: "Error",
          description: "Failed to add PDFs to lesson. Please try again.",
          variant: "destructive",
        });
      }
    },
    [addManyPdfsToLessonMutation]
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
