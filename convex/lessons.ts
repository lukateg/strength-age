import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils";

import { getClassById } from "./models/classesModel";
import { hasPermission } from "./permissions";
import {
  getLessonByTitle,
  createLesson,
  addPdfToLesson,
  getLessonById,
  updateLesson,
  runDeleteLessonDataBatch,
  deleteLesson,
} from "./models/lessonsModel";
import { getPdfByLessonId } from "./models/materialsModel";

export const createLessonMutation = mutation({
  args: v.object({
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  }),
  handler: async (ctx, { classId, title, description }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("classes", classId);
    if (!normalizedId) {
      throw createAppError({ message: "Invalid class ID" });
    }

    const class_ = await getClassById(ctx, normalizedId);
    if (!class_) {
      throw createAppError({ message: "Class not found" });
    }

    const canCreateLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "create",
      {
        class: class_,
      }
    );
    if (!canCreateLesson) {
      throw createAppError({ message: "Not authorized to create a lesson" });
    }

    const existingLesson = await getLessonByTitle(ctx, userId, title);
    if (existingLesson) {
      throw createAppError({
        message: "Lesson with same title already exists.",
      });
    }

    const lessonId = await createLesson(
      ctx,
      userId,
      normalizedId,
      title,
      description
    );
    return lessonId;
  },
});

export const updateLessonMutation = mutation({
  args: v.object({
    lessonId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  }),
  handler: async (ctx, { lessonId, title, description }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const lesson = await getLessonById(ctx, normalizedId);
    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    const canUpdateLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "update",
      {
        lesson,
      }
    );
    if (!canUpdateLesson) {
      throw createAppError({ message: "Not authorized to update this lesson" });
    }

    const existingLesson = await getLessonByTitle(ctx, userId, title);
    if (existingLesson) {
      throw createAppError({
        message: "Lesson with same title already exists.",
      });
    }

    const updatedLessonId = await updateLesson(ctx, normalizedId, {
      title,
      description,
    });
    return updatedLessonId;
  },
});

export const deleteLessonMutation = mutation({
  args: { lessonId: v.string() },
  handler: async (ctx, { lessonId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const existingLesson = await getLessonById(ctx, normalizedId);
    if (!existingLesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    const canDeleteLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "delete",
      {
        lesson: existingLesson,
      }
    );
    if (!canDeleteLesson) {
      throw createAppError({ message: "Not authorized to delete this lesson" });
    }

    await runDeleteLessonDataBatch(ctx, normalizedId, userId, "pdfs");
    await deleteLesson(ctx, normalizedId);

    return true;
  },
});

export const addPdfToLessonMutation = mutation({
  args: v.object({
    lessonId: v.string(),
    pdfId: v.id("pdfs"),
    classId: v.string(),
  }),
  handler: async (ctx, { lessonId, pdfId, classId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    if (!normalizedClassId) {
      throw createAppError({ message: "Invalid class ID" });
    }

    const normalizedLessonId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedLessonId) {
      throw createAppError({ message: "Invalid lesson ID" });
    }

    const lesson = await ctx.db.get(normalizedLessonId);
    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    const canAddPdfToLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "update",
      { lesson }
    );
    if (!canAddPdfToLesson) {
      throw createAppError({
        message: "Not authorized to add PDF to this lesson",
      });
    }

    const isInLesson = await getPdfByLessonId(ctx, normalizedLessonId, pdfId);
    if (isInLesson) {
      throw createAppError({ message: "PDF already added to this lesson" });
    }

    await addPdfToLesson(ctx, {
      lessonId: normalizedLessonId,
      pdfId,
      classId: normalizedClassId,
    });
  },
});

export const addManyPdfsToLessonMutation = mutation({
  args: v.object({
    lessonId: v.string(),
    pdfIds: v.array(v.id("pdfs")),
    classId: v.string(),
  }),
  handler: async (ctx, { lessonId, pdfIds, classId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    if (!normalizedClassId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const classResponse = await ctx.db.get(normalizedClassId);
    if (!classResponse) {
      throw createAppError({ message: "Class not found" });
    }
    const normalizedLessonId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedLessonId) {
      throw createAppError({ message: "Lesson not found" });
    }

    const lesson = await getLessonById(ctx, normalizedLessonId);
    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    const canAddPdfsToLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "update",
      { lesson }
    );
    if (!canAddPdfsToLesson) {
      throw createAppError({
        message: "Not authorized to add PDFs to this lesson",
      });
    }

    for (const pdfId of pdfIds) {
      const isInLesson = await getPdfByLessonId(ctx, normalizedLessonId, pdfId);

      if (!isInLesson) {
        await addPdfToLesson(ctx, {
          lessonId: normalizedLessonId,
          pdfId,
          classId: normalizedClassId,
        });
      }
    }
  },
});

export const deleteLessonDataInternalMutation = internalMutation({
  args: {
    lessonId: v.id("lessons"),
    userId: v.string(),
    phase: v.union(v.literal("lessonPdfs"), v.literal("pdfs")),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { lessonId, userId, phase, cursor }) => {
    try {
      const BATCH_SIZE = 100;

      // Get a batch of lessonPdfs instead of all at once
      const lessonPdfsBatch = await ctx.db
        .query("lessonPdfs")
        .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
        .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

      // Delete each PDF referenced in this batch
      for (const lessonPdf of lessonPdfsBatch.page) {
        await ctx.db.delete(lessonPdf.pdfId);
        // Also delete the lessonPdf entry
        await ctx.db.delete(lessonPdf._id);
      }

      // Continue with next batch if needed
      if (!lessonPdfsBatch.isDone) {
        await runDeleteLessonDataBatch(
          ctx,
          lessonId,
          userId,
          "pdfs",
          lessonPdfsBatch.continueCursor
        );
      }
    } catch (error) {
      console.error(`Error during ${phase} deletion:`, error);
    }
  },
});
