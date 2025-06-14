"use client";

import { createContext, useContext } from "react";
import { api } from "../../convex/_generated/api";

import {
  type QueryStatus,
  useAuthenticatedQueryWithStatus,
} from "@/hooks/use-authenticated-query";

interface ClassesContextType {
  classesPageData: QueryStatus<typeof api.classes.getClassesPageData>;
}

const ClassContext = createContext<ClassesContextType | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const classesPageData = useAuthenticatedQueryWithStatus(
    api.classes.getClassesPageData
  );

  return (
    <ClassContext.Provider value={{ classesPageData }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClass must be used within a ClassProvider");
  }
  return context;
}
