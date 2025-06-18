import { AuthenticationRequired } from "convex/utils";
import { validateTestReviewShareToken } from "convex/models/testReviewsModel";
import { hasPermission } from "convex/models/permissionsModel";
import { createAppError } from "convex/utils";
import { v } from "convex/values";
import { query } from "convex/_generated/server";

export const getTestReviewByIdQuery = query({
  args: {
    testReviewId: v.id("testReviews"),
    shareToken: v.optional(v.string()),
  },
  handler: async (ctx, { testReviewId, shareToken }) => {
    const userId = await AuthenticationRequired({ ctx });

    const testReview = await ctx.db.get(testReviewId);
    if (!testReview) {
      return null;
    }

    if (shareToken) {
      const isValid = await validateTestReviewShareToken(ctx, shareToken);
      if (!isValid) {
        throw createAppError({
          message: "Invalid share token",
          statusCode: "VALIDATION_ERROR",
        });
      }
    }

    const canViewTestReview = await hasPermission<"testReviews">(
      ctx,
      userId,
      "testReviews",
      "view",
      {
        testReview,
        shareToken,
      }
    );
    if (!canViewTestReview) {
      throw createAppError({
        message: "You are not allowed to view this test review",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const test = await ctx.db.get(testReview.testId);

    const canTakeTest = await hasPermission<"tests">(
      ctx,
      userId,
      "tests",
      "view",
      test
    );

    const canDeleteTestReview = await hasPermission<"testReviews">(
      ctx,
      userId,
      "testReviews",
      "delete",
      { testReview }
    );
    return {
      testReview,
      permissions: {
        canTakeTest,
        canDeleteTestReview,
        isViewedByOwner: canDeleteTestReview,
      },
    };
  },
});
