"use client";

import { createContext, useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { type Id, type Doc } from "convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

interface ClassesContextType {
  classes?: Doc<"classes">[] | null;
  userId: string | undefined;
  testsByUser?: Doc<"tests">[] | null;
}

const ClassContext = createContext<ClassesContextType | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  const classes = useQuery(api.classes.getAllClassesByUserId, { userId });
  const testsByUser = useQuery(api.tests.getAllTestsByUser, { userId });

  return (
    <ClassContext.Provider value={{ classes, userId, testsByUser }}>
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
