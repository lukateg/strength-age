"use client";
import { createContext, useContext } from "react";

import { api } from "../../convex/_generated/api";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { type QueryStatus } from "@/hooks/use-authenticated-query";
// TODO:
// 1. Add correct types for mutations
// 2. Add correct loading and error state

interface ClassContextType {
  classId: string;
  // userId?: string;
  // materialsByClass: QueryStatus<typeof api.materials.getPdfsByClassId>; // Replace `any` with your material type
  // lessonsByClass: QueryStatus<typeof api.lessons.getLessonsByClass>;
  // testsByClass: QueryStatus<typeof api.tests.getAllTestsByClassId>;
  // testReviewsByClass: QueryStatus<typeof api.tests.getTestReviewsByClassId>;
  classData: QueryStatus<typeof api.pages.class.getClassPageData>;
}

const ClassContext = createContext<ClassContextType | null>(null);

export function ClassProvider({
  classId,
  children,
}: {
  classId: string;
  children: React.ReactNode;
}) {
  const classData = useAuthenticatedQueryWithStatus(
    api.pages.class.getClassPageData,
    {
      id: classId,
    }
  );

  return (
    <ClassContext.Provider
      value={{
        classId,
        classData,
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
