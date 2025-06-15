"use client";

import { createContext, useContext } from "react";
import { api } from "../../convex/_generated/api";

import {
  useAuthenticatedQueryWithStatus,
  type QueryStatus,
} from "@/hooks/use-authenticated-query";

interface TestsContextType {
  testsPageData: QueryStatus<typeof api.pages.tests.getTestsPageDataQuery>;
}

const TestsContext = createContext<TestsContextType | null>(null);

export function TestsProvider({ children }: { children: React.ReactNode }) {
  const testsPageData = useAuthenticatedQueryWithStatus(
    api.pages.tests.getTestsPageDataQuery
  );

  return (
    <TestsContext.Provider
      value={{
        testsPageData,
      }}
    >
      {children}
    </TestsContext.Provider>
  );
}

export function useTests() {
  const context = useContext(TestsContext);
  if (!context) {
    throw new Error("useTests must be used within a TestsProvider");
  }
  return context;
}
