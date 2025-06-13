import { type createLessonSchema } from "@/lib/schemas";
import { type Id } from "convex/_generated/dataModel";
// import { type ClientUploadedFileData } from "uploadthing/types";
import { type z } from "zod";

// TODO
// - remove all this types and infer the convex schema

export type LessonFormData = z.infer<typeof createLessonSchema>;
export type EditLessonFormData = Omit<
  LessonFormData,
  "materialsToUpload" | "materialsToAdd" | "showExistingMaterials"
>;
export interface CreateBasicLessonParams {
  classId: string;
  title: string;
  description?: string;
}

export interface CreateLessonWithMaterialsParams {
  userId: string;
  classId: string;
  title: string;
  description?: string;
  pdfIds: Id<"pdfs">[];
}

export interface CreateLessonWithNewMaterialsParams {
  userId: string;
  classId: string;
  title: string;
  description?: string;
  pdfFiles: {
    fileUrl: string;
    name: string;
    size: number;
  }[];
}

export interface AddPDFToLessonParams {
  pdfIds: Id<"pdfs">[];
  lessonId: string;
}
