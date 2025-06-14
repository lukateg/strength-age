import { type Id, type Doc } from "convex/_generated/dataModel";
import { type ReactMutation } from "convex/react";
import { type FunctionReference } from "convex/server";

// TODO: remove and ad Doc<"lessons">
export type LessonsType = Doc<"lessons">;

export type UploadPDFMutation = ReactMutation<
  FunctionReference<
    "mutation",
    "public",
    {
      classId: string;
      userId: string;
      lessonIds: string[];
      pdfFiles: {
        fileUrl: string;
        name: string;
        size: number;
      }[];
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

export type CreateLessonWithExistingMaterialsMutation = ReactMutation<
  FunctionReference<
    "mutation",
    "public",
    {
      description?: string | undefined;
      classId: string;
      title: string;
      userId: string;
      pdfIds: Id<"pdfs">[];
    },
    string & {
      __tableName: "lessons";
    },
    string | undefined
  >
>;

export type CreateLessonWithNewMaterialsMutation = (args: {
  userId: string;
  classId: string;
  // classId: Id<"classes">;
  title: string;
  description?: string;
  // materialIds?: Id<"pdfs">[];
  pdfFiles: {
    fileUrl: string;
    name: string;
  }[];
}) => Promise<string & { __tableName: "lessons" }>;

export type CreateLessonMutation = ReactMutation<
  FunctionReference<
    "mutation",
    "public",
    {
      description?: string | undefined;
      title: string;
      userId: string;
      classId: string;
    },
    string & {
      __tableName: "lessons";
    },
    string | undefined
  >
>;

// export type AddPDFToLessonMutation = ReactMutation<
//   FunctionReference<
//     "mutation",
//     "public",
//     {
//       lessonId: string;
//       pdfIds: Id<"pdfs">[];
//     },
//     null,
//     string | undefined
//   >
// >;
