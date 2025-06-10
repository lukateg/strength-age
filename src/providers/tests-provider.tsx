"use client";
import { createContext, useContext } from "react";

import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";

import {
  useAuthenticatedQueryWithStatus,
  type QueryStatus,
} from "@/hooks/use-authenticated-query";
// TODO:
// 1. Add correct types for mutations
// 2. Add correct loading and error state

interface TestsContextType {
  userId?: string;
  testsByUser: QueryStatus<typeof api.tests.getAllTestsByUser>;
  testReviewsByUser?: QueryStatus<typeof api.tests.getAllTestReviewsByUser>;
  weeklyTestReviews?: QueryStatus<
    typeof api.tests.getWeeklyTestReviewsByUserId
  >;
  weeklyTests?: QueryStatus<typeof api.tests.getWeeklyTestsByUserId>;
}

const TestsContext = createContext<TestsContextType | null>(null);

export function TestsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  const testsByUser: QueryStatus<typeof api.tests.getAllTestsByUser> =
    useAuthenticatedQueryWithStatus(api.tests.getAllTestsByUser);

  const testReviewsByUser: QueryStatus<
    typeof api.tests.getAllTestReviewsByUser
  > = useAuthenticatedQueryWithStatus(api.tests.getAllTestReviewsByUser);
  const weeklyTestReviews: QueryStatus<
    typeof api.tests.getWeeklyTestReviewsByUserId
  > = useAuthenticatedQueryWithStatus(api.tests.getWeeklyTestReviewsByUserId);
  const weeklyTests: QueryStatus<typeof api.tests.getWeeklyTestsByUserId> =
    useAuthenticatedQueryWithStatus(api.tests.getWeeklyTestsByUserId);

  return (
    <TestsContext.Provider
      value={{
        userId,
        testsByUser,
        testReviewsByUser,
        weeklyTestReviews,
        weeklyTests,
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
