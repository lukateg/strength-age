import { AuthenticationRequired } from "convex/utils";
import {
  getTestReviewsByTitle,
  validateTestReviewShareToken,
} from "convex/models/testReviewsModel";
import { hasPermission } from "convex/permissions";
import { createAppError } from "convex/utils";
import { v } from "convex/values";
import { mutation, query } from "convex/_generated/server";
import { nanoid } from "nanoid";

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
        throw createAppError({ message: "Invalid share token" });
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
      });
    }

    const canRetakeTest = await hasPermission<"testReviews">(
      ctx,
      userId,
      "testReviews",
      "retake",
      { testReview }
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
        canRetakeTest,
        canDeleteTestReview,
        isViewedByOwner: canDeleteTestReview,
      },
    };
  },
});
