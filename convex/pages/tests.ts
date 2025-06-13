import { AuthenticationRequired } from "convex/utils";
import { query } from "../_generated/server";
import { hasPermission } from "convex/permissions";
import {
  getTestsWithPermissions,
  getTestReviewsWithPermissions,
  getWeeklyTestReviews,
  type TestsPageData,
} from "../tests";

export const getTestsPageDataQuery = query({
  handler: async (ctx): Promise<TestsPageData> => {
    const userId = await AuthenticationRequired({ ctx });

    const [tests, testReviews, weeklyTestReviews, canGenerateTest] =
      await Promise.all([
        getTestsWithPermissions(ctx, userId),
        getTestReviewsWithPermissions(ctx, userId),
        getWeeklyTestReviews(ctx, userId),
        hasPermission<"tests">(ctx, userId, "tests", "create"),
      ]);

    return {
      tests,
      testReviews,
      weeklyTestReviews,
      permissions: {
        canGenerateTest,
      },
    };
  },
});
