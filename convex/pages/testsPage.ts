import { AuthenticationRequired } from "convex/utils";
import { query } from "../_generated/server";
import { hasPermission } from "convex/models/permissionsModel";

import { getTestsWithPermissions } from "convex/models/testsModel";
import { getTestReviewsWithPermissions } from "convex/models/testReviewsModel";
import { type Doc, type Id } from "convex/_generated/dataModel";
import { getMonthlyUsageRecord } from "convex/models/tokensModel";
import { stripeCustomerByUserId } from "convex/models/stripeModel";

export interface TestWithPermissions extends Doc<"tests"> {
  canDelete: boolean;
  canShare: boolean;
}

export interface TestReviewWithPermissions extends Doc<"testReviews"> {
  canDelete: boolean;
  canShare: boolean;
  canRetake: boolean;
}

export interface TestsPageData {
  tests: TestWithPermissions[];
  testReviews: TestReviewWithPermissions[];
  permissions: {
    canGenerateTest: boolean;
  };
}

export interface WeeklySuccess {
  rate: number;
  trend: "higher" | "lower" | "same";
  percentageChange: number;
}

export interface NewTestsPageData {
  totalTests: number;
  totalAttempts: number;
  // mostActiveTest: string | null;
  weeklySuccess: WeeklySuccess;
  tests: TestWithPermissions[];
  testReviews: TestReviewWithPermissions[];
  permissions: {
    canGenerateTest: boolean;
  };
  tokensUsedThisMonth: number;
  stripeCustomer: Doc<"stripeCustomers"> | null;
}

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const calculateSuccessRate = (reviews: Doc<"testReviews">[]): number => {
  if (reviews.length === 0) return 0;
  const totalRate = reviews.reduce((acc, review) => {
    const rate =
      review.questions.length > 0
        ? review.questions.filter((q) => q.isCorrect).length /
          review.questions.length
        : 0;
    return acc + rate;
  }, 0);
  return (totalRate / reviews.length) * 100;
};

export const getNewTestsPageData = query({
  handler: async (ctx): Promise<NewTestsPageData> => {
    const userId = await AuthenticationRequired({ ctx });

    const [tests, monthlyRecord, testReviews, canGenerateTest, stripeCustomer] =
      await Promise.all([
        getTestsWithPermissions(ctx, userId),
        getMonthlyUsageRecord(ctx, userId),
        getTestReviewsWithPermissions(ctx, userId),
        hasPermission<"tests">(ctx, userId, "tests", "create"),
        stripeCustomerByUserId(ctx, userId),
      ]);

    // Most Active Test
    // let mostActiveTest = null;
    // if (testReviews.length > 0) {
    //   const testCounts = testReviews.reduce(
    //     (acc, review) => {
    //       const testIdStr = review.testId.toString();
    //       acc[testIdStr] = (acc[testIdStr] ?? 0) + 1;
    //       return acc;
    //     },
    //     {} as Record<string, number>
    //   );

    //   const mostActiveId = Object.keys(testCounts).reduce((a, b) =>
    //     testCounts[a]! > testCounts[b]! ? a : b
    //   );

    //   const activeTest = tests.find((t) => t._id === mostActiveId);
    //   if (activeTest) {
    //     mostActiveTest = activeTest.title;
    //   }
    // }

    // Weekly Success Rate
    const now = new Date();
    const startOfThisWeek = getStartOfWeek(now);
    const startOfLastWeek = new Date(
      startOfThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const thisWeekReviews = testReviews.filter(
      (r) => r._creationTime >= startOfThisWeek.getTime()
    );
    const lastWeekReviews = testReviews.filter(
      (r) =>
        r._creationTime >= startOfLastWeek.getTime() &&
        r._creationTime < startOfThisWeek.getTime()
    );

    const thisWeekRate = calculateSuccessRate(thisWeekReviews);
    const lastWeekRate = calculateSuccessRate(lastWeekReviews);

    const trend =
      thisWeekRate > lastWeekRate
        ? "higher"
        : thisWeekRate < lastWeekRate
          ? "lower"
          : "same";

    const percentageChange =
      lastWeekRate > 0
        ? ((thisWeekRate - lastWeekRate) / lastWeekRate) * 100
        : thisWeekRate > 0
          ? 100
          : 0;
    return {
      totalTests: tests.length,
      tokensUsedThisMonth: monthlyRecord?.monthlyTokensUsed ?? 0,
      totalAttempts: testReviews.length,
      // mostActiveTest,
      weeklySuccess: {
        rate: thisWeekRate,
        trend,
        percentageChange,
      },
      tests,
      testReviews,
      permissions: {
        canGenerateTest,
      },
      stripeCustomer,
    };
  },
});

// TODO: Remove this query
export const getTestsPageDataQuery = query({
  handler: async (ctx): Promise<TestsPageData> => {
    const userId = await AuthenticationRequired({ ctx });

    const [tests, testReviews, canGenerateTest] = await Promise.all([
      getTestsWithPermissions(ctx, userId),
      getTestReviewsWithPermissions(ctx, userId),
      hasPermission<"tests">(ctx, userId, "tests", "create"),
    ]);

    return {
      tests,
      testReviews,
      permissions: {
        canGenerateTest,
      },
    };
  },
});
