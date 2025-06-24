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

    // --- New Calculations ---
    const correctAnswers = testReview.questions.filter(
      (q) => q.isCorrect
    ).length;
    const totalQuestions = testReview.questions.length;
    const successRate =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    const perQuestionTypeAccuracy = testReview.questions.reduce(
      (acc, question) => {
        const type = question.questionType;
        acc[type] ??= { correct: 0, total: 0 };
        acc[type].total++;
        if (question.isCorrect) {
          acc[type].correct++;
        }
        return acc;
      },
      {} as Record<string, { correct: number; total: number }>
    );

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
      successRate,
      perQuestionTypeAccuracy,
      permissions: {
        canTakeTest,
        canDeleteTestReview,
        isViewedByOwner: canDeleteTestReview,
      },
    };
  },
});
