"use client";
import { createContext, useContext } from "react";

import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

import { type LessonsType, type PDFType } from "@/types/types";
import { type Id } from "convex/_generated/dataModel";
// TODO:
// 1. Add correct types for mutations
// 2. Add correct loading and error state

interface ClassContextType {
  classId: Id<"classes">;
  userId?: string;
  materials: PDFType[] | undefined; // Replace `any` with your material type
  lessons: LessonsType[] | undefined;
}

const ClassContext = createContext<ClassContextType | null>(null);

export function ClassProvider({
  classId,
  children,
}: {
  classId: Id<"classes">;
  children: React.ReactNode;
}) {
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  // TODO: Maybe remove queries from the context so they dont run initially, and instead when the component mounts
  // Fetch materials for the class
  const materials = useQuery(api.materials.getAllPDFs, { classId, userId });
  // TODO: check if queries by both user and class
  const lessons = useQuery(api.lessons.getLessonsByClass, { classId });

  return (
    <ClassContext.Provider
      value={{
        classId,
        userId,
        materials: materials as PDFType[] | undefined,
        lessons: lessons as LessonsType[] | undefined,
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
