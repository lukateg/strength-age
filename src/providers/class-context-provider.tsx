"use client";
import { createContext, useContext } from "react";

import { api } from "../../convex/_generated/api";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { type QueryStatus } from "@/hooks/use-authenticated-query";

interface ClassContextType {
  classId: string;
  classData: QueryStatus<typeof api.pages.classPage.getClassPageData>;
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
    api.pages.classPage.getClassPageData,
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
