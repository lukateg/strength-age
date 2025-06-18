import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils";

import { hasPermission } from "./models/permissionsModel";
import { getTestsWithSameTitleByUser } from "./models/testsModel";
import { getLessonPdfJoinsByLessonIds } from "./models/lessonPdfsModel";
import { getPdfsByIds, sortPdfsByLessonJoins } from "./models/materialsModel";
import { type Id } from "./_generated/dataModel";

export const getTestByIdQuery = query({
  args: {
    testId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("tests", args.testId);
    if (!normalizedId) {
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const test = await ctx.db.get(normalizedId);
    if (!test) {
      return null;
    }

    const canViewTest = await hasPermission<"tests">(
      ctx,
      userId,
      "tests",
      "view",
      test
    );
    if (!canViewTest) {
      throw createAppError({
        message: "You are not allowed to view this test",
        statusCode: "PERMISSION_DENIED",
      });
    }

    return test;
  },
});

export const uploadTestMutation = mutation({
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

    const canCreateTest = await hasPermission<"tests">(
      ctx,
      userId,
      "tests",
      "create"
    );
    if (!canCreateTest) {
      throw createAppError({
        message: "You are not allowed to create tests",
        statusCode: "PERMISSION_DENIED",
      });
    }

    let title = args.title;
    const existingTest = await getTestsWithSameTitleByUser(
      ctx,
      args.title,
      userId
    );
    if (existingTest.length > 0) {
      title = `${args.title} #${existingTest.length + 1}`;
    }

    const testId = await ctx.db.insert("tests", {
      title,
      createdBy: userId,
      description: args.description,
      questions: args.questions,
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

export const deleteTestMutation = mutation({
  args: { testId: v.id("tests") },
  handler: async (ctx, { testId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const test = await ctx.db.get(testId);
    if (!test) {
      throw createAppError({
        message: "Test not found",
        statusCode: "NOT_FOUND",
      });
    }
    const canDeleteTest = await hasPermission<"tests">(
      ctx,
      userId,
      "tests",
      "delete",
      test
    );
    if (!canDeleteTest) {
      throw createAppError({
        message: "You are not allowed to delete this test",
        statusCode: "PERMISSION_DENIED",
      });
    }

    await ctx.db.delete(testId);
    return { success: true };
  },
});

export const getGenerateTestFromLessonsDataQuery = query({
  args: v.object({
    lessonIds: v.array(v.string()),
  }),
  handler: async (ctx, { lessonIds }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedLessonIds = lessonIds
      .map((id) => ctx.db.normalizeId("lessons", id))
      .filter((id): id is Id<"lessons"> => id !== null);
    if (normalizedLessonIds.length === 0) {
      throw createAppError({
        message: "No valid lesson IDs provided",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const lessons = await Promise.all(
      normalizedLessonIds.map(async (id) => ctx.db.get(id))
    );
    for (const lesson of lessons) {
      if (!lesson) continue;
      const canViewPdfs = await hasPermission(ctx, userId, "lessons", "view", {
        lesson,
      });
      if (!canViewPdfs) {
        throw createAppError({
          message: "Not authorized to access PDFs for one or more lessons",
          statusCode: "PERMISSION_DENIED",
        });
      }
    }
    const lessonPdfJoins = await getLessonPdfJoinsByLessonIds(
      ctx,
      normalizedLessonIds
    );

    const pdfIds = [...new Set(lessonPdfJoins.map((lp) => lp.pdfId))];

    const pdfs = await getPdfsByIds(ctx, pdfIds);

    const pdfsByLesson = sortPdfsByLessonJoins(
      pdfs,
      lessonPdfJoins,
      normalizedLessonIds
    );

    const canGenerateTest = await hasPermission(ctx, userId, "tests", "create");

    return { pdfsByLesson, canGenerateTest };
  },
});
