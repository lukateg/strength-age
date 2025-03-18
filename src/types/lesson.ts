import { type Id } from "convex/_generated/dataModel";
// import { type ClientUploadedFileData } from "uploadthing/types";

export interface LessonFormData {
  lessonTitle: string;
  lessonDescription: string;
  uploadedMaterials: File[];
  selectedMaterials: Id<"pdfs">[];
}

export interface CreateBasicLessonParams {
  userId: string;
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
  }[];
}

export interface AddPDFToLessonParams {
  pdfIds: Id<"pdfs">[];
  lessonId: string;
}
