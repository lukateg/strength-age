import { v } from "convex/values";
import { hasPermission } from "./models/permissionsModel";
import { AuthenticationRequired, createAppError } from "./utils";
import { mutation, query } from "./_generated/server";
import {
  getTestReviewsByTitle,
  validateTestReviewShareToken,
} from "./models/testReviewsModel";
import { nanoid } from "nanoid";

export const validateTestReviewShareLinkQuery = query({
  args: {
    shareToken: v.string(),
  },
  handler: async (ctx, { shareToken }) => {
    const isValid = await validateTestReviewShareToken(ctx, shareToken);

    return isValid;
  },
});

export const deleteTestReviewMutation = mutation({
  args: { testReviewId: v.id("testReviews") },
  handler: async (ctx, { testReviewId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const testReview = await ctx.db.get(testReviewId);
    if (!testReview) {
      throw createAppError({
        message: "Test review you are trying to delete does not exist",
      });
    }
    const canDeleteTestReview = await hasPermission<"testReviews">(
      ctx,
      userId,
      "testReviews",
      "delete",
      {
        testReview,
      }
    );
    if (!canDeleteTestReview) {
      throw createAppError({
        message: "You are not allowed to delete this test review",
      });
    }

    await ctx.db.delete(testReviewId);
    return { success: true };
  },
});

export const createTestReviewMutation = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    classId: v.id("classes"),
    testId: v.id("tests"),
    questions: v.array(
      v.object({
        questionText: v.string(),
        questionType: v.string(),
        availableAnswers: v.optional(v.array(v.string())),
        correctAnswer: v.array(v.string()),
        isCorrect: v.boolean(),
        answer: v.union(v.array(v.string()), v.string()),
        feedback: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });

    let title = args.title;
    const existingTestReview = await getTestReviewsByTitle(ctx, args.title);
    if (existingTestReview.length > 0) {
      title = `${args.title} #${existingTestReview.length + 1}`;
    }

    const testId = await ctx.db.insert("testReviews", {
      title,
      description: args.description,
      questions: args.questions,
      createdBy: userId,
      classId: args.classId,
      testId: args.testId,
    });
    return testId;
  },
});

export const createTestReviewShareLinkMutation = mutation({
  args: {
    testReviewId: v.id("testReviews"),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, { testReviewId, expiresInDays }) => {
    const userId = await AuthenticationRequired({ ctx });

    // Check if user has permission to share this test review
    const testReview = await ctx.db.get(testReviewId);
    if (!testReview) {
      throw createAppError({ message: "Test review not found" });
    }

    const canShareTestReview = await hasPermission<"testReviews">(
      ctx,
      userId,
      "testReviews",
      "share",
      { testReview }
    );
    if (!canShareTestReview) {
      throw createAppError({
        message: "You are not allowed to share this test review",
      });
    }

    const shareToken = nanoid(16);
    const expiresAt = expiresInDays
      ? Date.now() + expiresInDays * 24 * 60 * 60 * 1000
      : undefined;

    // Create share link record
    await ctx.db.insert("testReviewShares", {
      testReviewId,
      createdBy: userId,
      shareToken,
      expiresAt,
      createdAt: Date.now(),
    });

    return shareToken;
  },
});
