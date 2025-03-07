"use client";
import { createContext, useContext, useState } from "react";

import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { type FunctionReference } from "convex/server";
import { type ReactMutation, useMutation, useQuery } from "convex/react";
import { type LessonsType, type PDFType } from "@/types/types";
// import { type Id } from "convex/_generated/dataModel";

// TODO:
// 1. Add correct types for mutations
// 2. Add correct loading and error state

interface ClassContextType {
  classId: string;
  materials: PDFType[]; // Replace `any` with your material type
  lessons: LessonsType[] | undefined;
  uploadPDFMutation: ReactMutation<
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
  createLessonMutation: (args: {
    userId: string;
    classId: string;
    // classId: Id<"classes">;
    title: string;
    description?: string;
    // materialIds?: Id<"pdfs">[];
    fileUrl: string;
    pdfId?: string;
  }) => Promise<string & { __tableName: "lessons" }>;
  isLoading: boolean;
  error: string | null;
}

const ClassContext = createContext<ClassContextType | null>(null);

export function ClassProvider({
  classId,
  children,
}: {
  classId: string;
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  // TODO: Maybe remove queries from the context so they dont run initially, and instead when the component mounts
  // Fetch materials for the class
  const materials = useQuery(api.materials.getAllPDFs, { classId, userId });
  // TODO: check if queries by both user and class
  const lessons = useQuery(api.lessons.getLessonsByClass, { classId });

  // Mutations
  const uploadPDFMutation = useMutation(api.materials.uploadPdf);
  const createLessonMutation = useMutation(
    api.lessons.createLessonWithMaterials
  );

  return (
    <ClassContext.Provider
      value={{
        classId,
        materials: materials as PDFType[] | [],
        lessons: lessons as LessonsType[] | undefined,
        uploadPDFMutation,
        createLessonMutation,
        isLoading,
        error,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}

export function useClass() {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClass must be used within a ClassProvider");
  }
  return context;
}
