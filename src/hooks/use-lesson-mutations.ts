import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useClass } from "@/providers/class-context-provider";
import { toast } from "@/hooks/use-toast";

import { type Id } from "convex/_generated/dataModel";
import { type ClientUploadedFileData } from "uploadthing/types";
import {
  type LessonFormData,
  type CreateBasicLessonParams,
  type CreateLessonWithMaterialsParams,
  type CreateLessonWithNewMaterialsParams,
  type AddPDFToLessonParams,
} from "@/types/lesson";

export const useLessonMutations = () => {
  const { userId, classId, materials: allMaterials } = useClass();

  // Mutations
  const createLessonMutation = useMutation(api.lessons.createLesson);
  // const createLessonWithNewMaterialsMutation = useMutation(
  //   api.lessons.createLessonWithNewMaterials
  // );
  // const addPDFToLessonMutation = useMutation(api.lessons.addPdfToLesson);
  const addManyPdfsToLesson = useMutation(api.lessons.addManyPdfsToLesson);
  // const createLessonWithExistingMaterialsMutation = useMutation(
  //   api.lessons.createLessonWithExistingMaterials
  // );

  const createLesson = useCallback(
    async (data: LessonFormData) => {
      try {
        if (!userId) return;

        const params: CreateBasicLessonParams = {
          userId,
          classId,
          title: data.lessonTitle,
          description: data.lessonDescription,
        };

        await createLessonMutation(params);

        toast({
          title: "Success",
          description: "Lesson created successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to create basic lesson:", error);
        toast({
          title: "Error",
          description: "Failed to create lesson. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [userId, classId, createLessonMutation]
  );

  const createLessonWithExistingMaterials = useCallback(
    async (data: LessonFormData, selectedMaterials: Id<"pdfs">[]) => {
      try {
        if (!userId) return;

        const params: CreateLessonWithMaterialsParams = {
          userId,
          classId,
          title: data.lessonTitle,
          description: data.lessonDescription,
          pdfIds: selectedMaterials,
        };

        // await createLessonWithExistingMaterialsMutation(params);

        toast({
          title: "Success",
          description: "Lesson created with existing materials.",
          variant: "default",
        });
      } catch (error) {
        console.error(
          "Failed to create lesson with existing materials:",
          error
        );
        toast({
          title: "Error",
          description:
            "Failed to create lesson with materials. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [userId, classId]
  );

  const createLessonWithNewMaterials = useCallback(
    async (
      data: LessonFormData,
      files: ClientUploadedFileData<{ uploadedBy: string }>[]
    ) => {
      try {
        if (!userId) return;

        const pdfFiles = files.map((pdf) => ({
          fileUrl: pdf.ufsUrl,
          name: pdf.name,
          size: pdf.size,
        }));

        const params: CreateLessonWithNewMaterialsParams = {
          userId,
          classId,
          title: data.lessonTitle,
          description: data.lessonDescription,
          pdfFiles,
        };

        // await createLessonWithNewMaterialsMutation(params);

        toast({
          title: "Success",
          description: "Lesson created with new materials.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to create lesson with new materials:", error);
        toast({
          title: "Error",
          description:
            "Failed to create lesson with materials. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [userId, classId]
  );

  const addPDFToLesson = useCallback(
    async (params: AddPDFToLessonParams) => {
      try {
        await addManyPdfsToLesson({
          lessonId: params.lessonId,
          pdfIds: params.pdfIds,
        });

        toast({
          title: "Success",
          description: "Materials added to lesson successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to add PDF to lesson:", error);
        toast({
          title: "Error",
          description: "Failed to add materials to lesson. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [addManyPdfsToLesson]
  );

  return {
    createLesson,
    createLessonWithExistingMaterials,
    createLessonWithNewMaterials,
    addPDFToLesson,
    classId,
    allMaterials,
  };
};
