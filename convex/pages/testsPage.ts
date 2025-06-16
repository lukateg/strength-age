import { AuthenticationRequired } from "convex/utils";
import { query } from "../_generated/server";
import { hasPermission } from "convex/models/permissionsModel";

import { getTestsWithPermissions } from "convex/models/testsModel";
import { getTestReviewsWithPermissions } from "convex/models/testReviewsModel";
import { type Doc } from "convex/_generated/dataModel";

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
