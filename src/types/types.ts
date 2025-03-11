import { type Id } from "convex/_generated/dataModel";
import { type ReactMutation } from "convex/react";
import { type FunctionReference } from "convex/server";

// TODO: Add correct types
export type PDFType = {
  _id: string;
  _creationTime: number;
  classId: string;
  fileUrl: string;
  uploadedAt: number;
  userId: string;
};

export type LessonsType = {
  _id: Id<"lessons">;
  _creationTime: number;
  description?: string | undefined;
  classId: string;
  userId: string;
  title: string;
  createdAt: number;
};

export type UploadPDFMutation = ReactMutation<
  FunctionReference<
    "mutation",
    "public",
    {
      classId: string;
      fileUrl: string;
      userId: string;
    },
    null,
    string | undefined
  >
>;

export type CreateClassMutation = ReactMutation<
  FunctionReference<
    "mutation",
    "public",
    {
      title: string;
      description: string;
    },
    null,
    string | undefined
  >
>;

export type CreateLessonMutation = (args: {
  userId: string;
  classId: string;
  // classId: Id<"classes">;
  title: string;
  description?: string;
  // materialIds?: Id<"pdfs">[];
  fileUrl: string;
  pdfId?: string;
}) => Promise<string & { __tableName: "lessons" }>;
