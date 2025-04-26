import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired } from "./utils/utils";

export const createTest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    userId: v.string(),
    classId: v.string(),
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
    await AuthenticationRequired({ ctx });
    let title = args.title;
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("title"), args.title))
      .collect();

    if (existingTest.length > 0) {
      title = `${args.title} ${existingTest.length + 1}`;
    }
    const testId = await ctx.db.insert("tests", {
      title,
      description: args.description,
      questions: args.questions,
      userId: args.userId,
      classId: args.classId,
    });
    return testId;
  },
});

export const createTestReview = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    userId: v.string(),
    classId: v.string(),
    testId: v.string(),
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
    const testId = await ctx.db.insert("testReviews", {
      title: args.title,
      description: args.description,
      questions: args.questions,
      userId: args.userId,
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
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    return tests;
  },
});

export const getAllTestsByClassId = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    await AuthenticationRequired({ ctx });
    const tests = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("classId"), args.classId))
      .collect();
    return tests;
  },
});

export const getTestById = query({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    await AuthenticationRequired({ ctx });
    const test = await ctx.db.get(args.testId);
    return test;
  },
});

export const getTestReviewById = query({
  args: {
    testReviewId: v.id("testReviews"),
  },
  handler: async (ctx, args) => {
    await AuthenticationRequired({ ctx });
    const testReview = await ctx.db.get(args.testReviewId);
    return testReview;
  },
});

export const getAllTestReviewsByUser = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const testReviews = await ctx.db
      .query("testReviews")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    return testReviews;
  },
});

export const getTestReviewsByClassId = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    await AuthenticationRequired({ ctx });
    const testReviews = await ctx.db
      .query("testReviews")
      .filter((q) => q.eq(q.field("classId"), args.classId))
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
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("_creationTime"), sevenDaysAgo.getTime()))
      .collect();

    return recentTests;
  },
});
