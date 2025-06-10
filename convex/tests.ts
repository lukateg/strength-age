import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  AuthenticationRequired,
  checkPermission,
  createAppError,
} from "./utils";
import { internal } from "./_generated/api";

import { type DataModel, type Id } from "./_generated/dataModel";
import { type GenericMutationCtx } from "convex/server";

export const uploadTest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    classId: v.id("classes"),
    difficulty: v.number(),
    questionTypes: v.array(
      v.union(
        v.literal("multiple_choice"),
        v.literal("true_false"),
        v.literal("short_answer")
      )
    ),
    questionAmount: v.number(),
    lessons: v.array(
      v.object({
        lessonId: v.id("lessons"),
        lessonTitle: v.string(),
      })
    ),
    additionalInstructions: v.optional(v.string()),
    questions: v.array(
      v.object({
        questionText: v.string(),
        questionType: v.string(),
        availableAnswers: v.optional(v.array(v.string())),
        correctAnswer: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });

    const existingTests = await ctx.db
      .query("tests")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();

    await checkPermission(ctx, userId, "tests", "create", {
      existingTestsLength: existingTests.length,
    });

    let title = args.title;
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("title"), args.title))
      .collect();

    if (existingTest.length > 0) {
      title = `${args.title} #${existingTest.length + 1}`;
    }
    const testId = await ctx.db.insert("tests", {
      title,
      description: args.description,
      questions: args.questions,
      createdBy: userId,
      classId: args.classId,
      difficulty: args.difficulty,
      questionTypes: args.questionTypes,
      questionAmount: args.questionAmount,
      lessons: args.lessons,
      additionalInstructions: args.additionalInstructions,
    });
    return testId;
  },
});

export const createTestReview = mutation({
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
    const existingTestReview = await ctx.db
      .query("testReviews")
      .filter((q) => q.eq(q.field("title"), args.title))
      .collect();

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

export const getAllTestsByUser = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const tests = await ctx.db
      .query("tests")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();
    return tests;
  },
});

export const getAllTestsByClassId = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", args.classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }
    const classResponse = await ctx.db.get(normalizedId);

    if (!classResponse) {
      return null;
    }

    await checkPermission(ctx, userId, "classes", "view", {
      class: classResponse,
    });

    const tests = await ctx.db
      .query("tests")
      .withIndex("by_class", (q) => q.eq("classId", normalizedId))
      .collect();
    return tests;
  },
});

export const getTestById = query({
  args: {
    testId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("tests", args.testId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const test = await ctx.db.get(normalizedId);
    if (!test) {
      return null;
    }

    await checkPermission(ctx, userId, "tests", "view", {
      test,
    });

    return test;
  },
});

export const getTestReviewById = query({
  args: {
    testReviewId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("testReviews", args.testReviewId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const testReview = await ctx.db.get(normalizedId);
    if (!testReview) {
      return null;
    }

    await checkPermission(ctx, userId, "testReviews", "view", {
      testResult: testReview,
    });

    return testReview;
  },
});

export const getAllTestReviewsByUser = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const testReviews = await ctx.db
      .query("testReviews")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();
    return testReviews;
  },
});

export const getTestReviewsByClassId = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", args.classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const classResponse = await ctx.db.get(normalizedId);

    if (!classResponse) {
      return null;
    }

    await checkPermission(ctx, userId, "classes", "view", {
      class: classResponse,
    });

    const testReviews = await ctx.db
      .query("testReviews")
      .withIndex("by_class", (q) => q.eq("classId", normalizedId))
      .collect();
    return testReviews;
  },
});

export const getTestReviewsByTestId = query({
  args: {
    testId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("tests", args.testId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid test ID" });
    }

    const test = await ctx.db.get(normalizedId);
    if (!test) {
      return null;
    }

    await checkPermission(ctx, userId, "tests", "view", {
      test,
    });

    const testReviews = await ctx.db
      .query("testReviews")
      .withIndex("by_test", (q) => q.eq("testId", normalizedId))
      .collect();
    return testReviews;
  },
});

export const getWeeklyTestReviewsByUserId = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReviews = await ctx.db
      .query("testReviews")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .filter((q) => q.gte(q.field("_creationTime"), sevenDaysAgo.getTime()))
      .collect();

    return recentReviews;
  },
});

export const getWeeklyTestsByUserId = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTests = await ctx.db
      .query("tests")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .filter((q) => q.gte(q.field("_creationTime"), sevenDaysAgo.getTime()))
      .collect();

    return recentTests;
  },
});

export async function deleteTestsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.eq(q.field("classId"), classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const test of page) {
    await ctx.db.delete(test._id);
  }

  if (!isDone) {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "tests",
      cursor: continueCursor,
    });
  } else {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "testReviews",
      cursor: undefined,
    });
  }
}

export async function deleteTestReviewsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.eq(q.field("classId"), classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const review of page) {
    await ctx.db.delete(review._id);
  }

  if (!isDone) {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "testReviews",
      cursor: continueCursor,
    });
  }
}

export const deleteTestReview = mutation({
  args: { testReviewId: v.id("testReviews") },
  handler: async (ctx, { testReviewId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const testReview = await ctx.db.get(testReviewId);
    if (!testReview) {
      throw createAppError({
        message: "Test review not found",
      });
    }

    await checkPermission(ctx, userId, "testReviews", "delete", {
      testResult: testReview,
    });

    await ctx.db.delete(testReviewId);

    return { success: true };
  },
});

export const deleteTest = mutation({
  args: { testId: v.id("tests") },
  handler: async (ctx, { testId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const test = await ctx.db.get(testId);
    if (!test) {
      throw createAppError({
        message: "Test not found",
      });
    }

    await checkPermission(ctx, userId, "tests", "delete", {
      test,
    });

    await ctx.db.delete(testId);

    return { success: true };
  },
});
