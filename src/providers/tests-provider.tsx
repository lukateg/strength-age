"use client";
import { createContext, useContext } from "react";

import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

import { type Doc } from "convex/_generated/dataModel";
// TODO:
// 1. Add correct types for mutations
// 2. Add correct loading and error state

interface TestsContextType {
  userId?: string;
  testsByUser: Doc<"tests">[] | undefined;
  testReviewsByUser: Doc<"testReviews">[] | undefined;
  weeklyTestReviews: Doc<"testReviews">[] | undefined;
}

const TestsContext = createContext<TestsContextType | null>(null);

export function TestsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  const testsByUser = useQuery(api.tests.getAllTestsByUser, { userId });
  const testReviewsByUser = useQuery(api.tests.getAllTestReviewsByUser, {
    userId,
  });
  const weeklyTestReviews = useQuery(api.tests.getWeeklyTestReviews);

  return (
    <TestsContext.Provider
      value={{
        userId,
        testsByUser,
        testReviewsByUser,
        weeklyTestReviews,
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
