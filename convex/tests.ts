import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    const testId = await ctx.db.insert("tests", {
      title: args.title,
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
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO find out why this is not working
    if (!args.userId) {
      return null;
    }
    const tests = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return tests;
  },
});

export const getAllTestsByClassId = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
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
    const test = await ctx.db.get(args.testId);
    return test;
  },
});

export const getTestReviewById = query({
  args: {
    testReviewId: v.id("testReviews"),
  },
  handler: async (ctx, args) => {
    const testReview = await ctx.db.get(args.testReviewId);
    return testReview;
  },
});

export const getAllTestReviewsByUser = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return null;
    }
    const testReviews = await ctx.db
      .query("testReviews")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return testReviews;
  },
});

export const getTestReviewsByClassId = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    const testReviews = await ctx.db
      .query("testReviews")
      .filter((q) => q.eq(q.field("classId"), args.classId))
      .collect();
    return testReviews;
  },
});
export const getWeeklyTestReviewsByUserId = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      return null;
    }
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
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      return null;
    }
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
