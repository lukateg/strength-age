"use client";

import { createContext, useContext, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

import { type CreateClassMutation } from "@/types/types";
import { type Id } from "convex/_generated/dataModel";

interface ClassesContextType {
  classes:
    | {
        _id: Id<"classes">;
        _creationTime: number;
        description?: string | undefined;
        title: string;
      }[]
    | undefined;
  // setClasses: (classes: string[]) => void;
  createClassMutation: CreateClassMutation;
}

const ClassContext = createContext<ClassesContextType | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  // const [classes, setClasses] = useState<string[]>([]);
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  const classes = useQuery(api.classes.getAllClasses);

  const createClassMutation = useMutation(api.classes.createClass);

  return (
    <ClassContext.Provider value={{ classes, createClassMutation }}>
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
