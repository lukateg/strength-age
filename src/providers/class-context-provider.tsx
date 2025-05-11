"use client";
import { createContext, useContext } from "react";

import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";

import { type Id } from "convex/_generated/dataModel";
import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { type QueryStatus } from "@/hooks/use-authenticated-query";
// TODO:
// 1. Add correct types for mutations
// 2. Add correct loading and error state

interface ClassContextType {
  classId: Id<"classes">;
  userId?: string;
  materials: QueryStatus<typeof api.materials.getPdfsByClassId>; // Replace `any` with your material type
  lessons: QueryStatus<typeof api.lessons.getLessonsByClass>;
  tests: QueryStatus<typeof api.tests.getAllTestsByClassId>;
  testReviews: QueryStatus<typeof api.tests.getTestReviewsByClassId>;
  classData: QueryStatus<typeof api.classes.getClassById>;
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
  const materials = useAuthenticatedQueryWithStatus(
    api.materials.getPdfsByClassId,
    {
      classId,
    }
  );
  // TODO: check if queries by both user and class
  const lessons = useAuthenticatedQueryWithStatus(
    api.lessons.getLessonsByClass,
    {
      classId,
    }
  );
  const tests = useAuthenticatedQueryWithStatus(
    api.tests.getAllTestsByClassId,
    { classId }
  );
  const testReviews = useAuthenticatedQueryWithStatus(
    api.tests.getTestReviewsByClassId,
    {
      classId,
    }
  );
  const classData = useAuthenticatedQueryWithStatus(api.classes.getClassById, {
    id: classId,
  });

  return (
    <ClassContext.Provider
      value={{
        classId,
        userId,
        materials,
        lessons,
        tests,
        testReviews,
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
