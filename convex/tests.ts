import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils";
import { internal } from "./_generated/api";
import { nanoid } from "nanoid";

import { type DataModel, type Id, type Doc } from "./_generated/dataModel";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { hasPermission } from "./permissions";
import { type Permissions } from "./permissions";

interface TestWithPermissions extends Doc<"tests"> {
  canDelete: boolean;
  canShare: boolean;
}

interface TestReviewWithPermissions extends Doc<"testReviews"> {
  canDelete: boolean;
  canShare: boolean;
  canRetake: boolean;
}

export interface TestsPageData {
  tests: TestWithPermissions[];
  testReviews: TestReviewWithPermissions[];
  weeklyTestReviews: Doc<"testReviews">[];
  permissions: {
    canGenerateTest: boolean;
  };
}

// Helper function to get tests with permissions
export async function getTestsWithPermissions(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<TestWithPermissions[]> {
  const tests = await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();

  return await Promise.all(
    tests.map(async (test) => {
      const [canDelete, canShare] = await Promise.all([
        hasPermission<"tests">(ctx, userId, "tests", "delete", test),
        hasPermission<"tests">(ctx, userId, "tests", "share", test),
      ]);

      return {
        ...test,
        canDelete,
        canShare,
      };
    })
  );
}

// Helper function to get test reviews with permissions
export async function getTestReviewsWithPermissions(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<TestReviewWithPermissions[]> {
  const testReviews = await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();

  return await Promise.all(
    testReviews.map(async (review) => {
      const [canDelete, canShare, canRetake] = await Promise.all([
        hasPermission<"testReviews">(ctx, userId, "testReviews", "delete", {
          testReview: review,
        }),
        hasPermission<"testReviews">(ctx, userId, "testReviews", "share", {
          testReview: review,
        }),
        hasPermission<"testReviews">(ctx, userId, "testReviews", "retake", {
          testReview: review,
        }),
      ]);

      return {
        ...review,
        canDelete,
        canShare,
        canRetake,
      };
    })
  );
}

// Helper function to get weekly test reviews
export async function getWeeklyTestReviews(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"testReviews">[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.gte(q.field("_creationTime"), sevenDaysAgo.getTime()))
    .collect();
}

// export const getTestsPageDataQuery = query({
//   handler: async (ctx): Promise<TestsPageData> => {
//     const userId = await AuthenticationRequired({ ctx });

//     const [tests, testReviews, weeklyTestReviews, canGenerateTest] =
//       await Promise.all([
//         getTestsWithPermissions(ctx, userId),
//         getTestReviewsWithPermissions(ctx, userId),
//         getWeeklyTestReviews(ctx, userId),
//         hasPermission<"tests">(ctx, userId, "tests", "create"),
//       ]);

//     return {
//       tests,
//       testReviews,
//       weeklyTestReviews,
//       permissions: {
//         canGenerateTest,
//       },
//     };
//   },
// });

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

    // await checkPermission(ctx, userId, "tests", "create", {
    //   existingTestsLength: existingTests.length,
    // });

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

    // await checkPermission(ctx, userId, "classes", "view", {
    //   class: classResponse,
    // });

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

    // await checkPermission(ctx, userId, "tests", "view", {
    //   test,
    // });

    return test;
  },
});

// Helper function to validate share token
async function validateShareToken(
  ctx: GenericQueryCtx<DataModel>,
  shareToken?: string
) {
  if (!shareToken) {
    return false;
  }

  const share = await ctx.db
    .query("testReviewShares")
    .withIndex("by_shareToken", (q) => q.eq("shareToken", shareToken))
    .first();

  return share && (!share.expiresAt || share.expiresAt > Date.now());
}

export const getTestReviewById = query({
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

    const isValid = await validateShareToken(ctx, shareToken);

    if (!isValid) {
      throw createAppError({ message: "Invalid share token" });
    }

    // await checkPermission(ctx, userId, "testReviews", "view", {
    //   testReview,
    //   hasValidShareToken: !!isValid,
    // });

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

    // await checkPermission(ctx, userId, "classes", "view", {
    //   class: classResponse,
    // });

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

    // await checkPermission(ctx, userId, "tests", "view", {
    //   test,
    // });

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
    await ctx.scheduler.runAfter(
      0,
      internal.classes.deleteClassDataInternalMutation,
      {
        classId,
        userId,
        phase: "tests",
        cursor: continueCursor,
      }
    );
  } else {
    await ctx.scheduler.runAfter(
      0,
      internal.classes.deleteClassDataInternalMutation,
      {
        classId,
        userId,
        phase: "testReviews",
        cursor: undefined,
      }
    );
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
    await ctx.scheduler.runAfter(
      0,
      internal.classes.deleteClassDataInternalMutation,
      {
        classId,
        userId,
        phase: "testReviews",
        cursor: continueCursor,
      }
    );
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

    //  await checkPermission(ctx, userId, "testReviews", "delete", {
    //   testReview: testReview,
    // });

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

    // await checkPermission(ctx, userId, "tests", "delete", {
    //   test,
    // });

    await ctx.db.delete(testId);

    return { success: true };
  },
});

export const createTestReviewShareLink = mutation({
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

    // await checkPermission(ctx, userId, "testReviews", "share", {
    //   testReview: testReview,
    // });

    // Generate a unique share token
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

export const validateTestReviewShareLink = query({
  args: {
    shareToken: v.string(),
  },
  handler: async (ctx, { shareToken }) => {
    const share = await ctx.db
      .query("testReviewShares")
      .withIndex("by_shareToken", (q) => q.eq("shareToken", shareToken))
      .first();

    if (!share) {
      return null;
    }

    // Check if share link has expired
    if (share.expiresAt && share.expiresAt < Date.now()) {
      return null;
    }

    return share.testReviewId;
  },
});
