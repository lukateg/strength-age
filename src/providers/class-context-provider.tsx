"use client";
import { createContext, useContext, useState } from "react";

import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { type FunctionReference } from "convex/server";
import { type ReactMutation, useMutation, useQuery } from "convex/react";
import { type PDFType } from "@/types/types";

// TODO:
// 1. Add correct types for mutations
// 2. Add correct loading and error state

interface ClassContextType {
  classId: string;
  materials: PDFType[]; // Replace `any` with your material type
  uploadPDFMutation: ReactMutation<
    FunctionReference<
      "mutation",
      "public",
      {
        classId: string;
        fileUrl: string;
        userId: string;
      },
      null,
      string | undefined
    >
  >;
  isLoading: boolean;
  error: string | null;
}

const ClassContext = createContext<ClassContextType | null>(null);

export function ClassProvider({
  classId,
  children,
}: {
  classId: string;
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  // Fetch materials for the class
  const materials = useQuery(api.classes.getPDFs, { classId, userId });

  // Mutations
  const uploadPDFMutation = useMutation(api.classes.uploadPdf);
  //   const generateTestMutation = useMutation(api.classes.generateTest);
  //   const editMaterialMutation = useMutation(api.classes.editMaterial);

  return (
    <ClassContext.Provider
      value={{
        classId,
        materials: (materials || []) as PDFType[] | [],
        uploadPDFMutation,
        // generateTest,
        // editMaterial,
        isLoading,
        error,
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
