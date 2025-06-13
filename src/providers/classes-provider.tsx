"use client";

import { createContext, useContext } from "react";
import { api } from "../../convex/_generated/api";

import { useUser } from "@clerk/nextjs";
import {
  type QueryStatus,
  useAuthenticatedQueryWithStatus,
} from "@/hooks/use-authenticated-query";

interface ClassesContextType {
  classes: QueryStatus<typeof api.classes.getAllClassesByUserId>;
  userId: string | undefined;
  testsByUser: QueryStatus<typeof api.tests.getAllTestsByUser>;
  classesData: QueryStatus<typeof api.classes.getClassesPageDataByUserId>;
}

const ClassContext = createContext<ClassesContextType | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  // TODO: remove this query
  const classes = useAuthenticatedQueryWithStatus(
    api.classes.getAllClassesByUserId
  );
  const testsByUser = useAuthenticatedQueryWithStatus(
    api.tests.getAllTestsByUser
  );
  const classesData = useAuthenticatedQueryWithStatus(
    api.classes.getClassesPageDataByUserId
  );

  return (
    <ClassContext.Provider
      value={{ classes, userId, testsByUser, classesData }}
    >
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
