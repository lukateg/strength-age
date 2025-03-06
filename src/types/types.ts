import { type Id } from "convex/_generated/dataModel";

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
