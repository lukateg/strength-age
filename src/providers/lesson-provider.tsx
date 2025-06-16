"use client";

import { createContext, useContext } from "react";
import { api } from "../../convex/_generated/api";

import {
  type QueryStatus,
  useAuthenticatedQueryWithStatus,
} from "@/hooks/use-authenticated-query";

interface LessonContextType {
  lesson: QueryStatus<typeof api.pages.lessonPage.getLessonPageData>;
}

const LessonContext = createContext<LessonContextType | null>(null);

export function LessonProvider({
  children,
  lessonId,
}: {
  children: React.ReactNode;
  lessonId: string;
}) {
  const lesson = useAuthenticatedQueryWithStatus(
    api.pages.lessonPage.getLessonPageData,
    {
      lessonId,
    }
  );

  return (
    <LessonContext.Provider value={{ lesson }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error("useLesson must be used within a LessonProvider");
  }
  return context;
}
