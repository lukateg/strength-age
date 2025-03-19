"use client";

import { createContext, useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { type Id } from "convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

interface ClassesContextType {
  classes:
    | {
        _id: Id<"classes">;
        _creationTime: number;
        description?: string | undefined;
        title: string;
      }[]
    | undefined;
  userId: string | undefined;
}

const ClassContext = createContext<ClassesContextType | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const classes = useQuery(api.classes.getAllClasses);
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  return (
    <ClassContext.Provider value={{ classes, userId }}>
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
