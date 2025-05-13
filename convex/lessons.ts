import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils/utils";

export const getLessonsByClass = query({
  args: v.object({
    classId: v.id("classes"),
  }),
  // TODO change to index
  handler: async (ctx, { classId }) => {
    await AuthenticationRequired({ ctx });
    return await ctx.db
      .query("lessons")
      .withIndex("by_class", (q) => q.eq("classId", classId))
      .collect();
  },
});

export const createLesson = mutation({
  args: v.object({
    classId: v.id("classes"),
    title: v.string(),
    description: v.optional(v.string()),
  }),
  handler: async (ctx, { classId, title, description }) => {
    const userId = await AuthenticationRequired({ ctx });

    // TODO use index insead of filter
    const existingLesson = await ctx.db
      .query("lessons")
      .filter((q) => q.eq(q.field("title"), title))
      .first();

    if (existingLesson) {
      createAppError({
        message: "Lesson with same title already exists.",
      });
    }

    const lessonId = await ctx.db.insert("lessons", {
      userId,
      classId,
      title,
      description,
    });

    return lessonId;
  },
});

export const getPDFsByLessonId = query({
  args: v.object({
    lessonId: v.id("lessons"),
  }),
  handler: async (ctx, { lessonId }) => {
    await AuthenticationRequired({ ctx });
    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
      .collect();

    const pdfs = await Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
    );

    // Filter out any null PDFs and ensure we have valid PDFs
    return pdfs.filter((pdf): pdf is NonNullable<typeof pdf> => pdf !== null);
  },
});

export const getLessonById = query({
  args: v.object({
    lessonId: v.string(),
  }),
  handler: async (ctx, { lessonId }) => {
    await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    return await ctx.db.get(normalizedId);
  },
});

export const getLessonData = query({
  args: v.object({
    lessonId: v.id("lessons"),
  }),
  handler: async (ctx, { lessonId }) => {
    await AuthenticationRequired({ ctx });
    const lesson = await ctx.db.get(lessonId);

    // TODO: - since we initially load all pdfs already, we can move this logic to context and avoid fetching all pdfs and duplicating logic
    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
      .collect();

    const lessonPDFs = await Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
    );

    return { lesson, lessonPDFs };
  },
});

export const addPdfToLesson = mutation({
  args: v.object({
    lessonId: v.id("lessons"),
    pdfId: v.id("pdfs"),
    classId: v.id("classes"),
  }),
  handler: async (ctx, { lessonId, pdfId, classId }) => {
    await AuthenticationRequired({ ctx });

    // Check if relationship already exists
    const existing = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
      .filter((q) => q.eq(q.field("pdfId"), pdfId))
      .unique();

    if (!existing) {
      await ctx.db.insert("lessonPdfs", {
        lessonId,
        pdfId,
        classId,
      });
    }
  },
});

export const addManyPdfsToLesson = mutation({
  args: v.object({
    lessonId: v.id("lessons"),
    pdfIds: v.array(v.id("pdfs")),
    classId: v.id("classes"),
  }),
  handler: async (ctx, { lessonId, pdfIds, classId }) => {
    await AuthenticationRequired({ ctx });

    for (const pdfId of pdfIds) {
      // Check if relationship already exists
      const existing = await ctx.db
        .query("lessonPdfs")
        .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
        .filter((q) => q.eq(q.field("pdfId"), pdfId))
        .unique();

      if (!existing) {
        await ctx.db.insert("lessonPdfs", {
          lessonId,
          pdfId,
          classId,
        });
      }
    }
  },
});

export const getLessonsForPdf = query({
  args: { pdfId: v.id("pdfs") },
  handler: async (ctx, args) => {
    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_pdfId", (q) => q.eq("pdfId", args.pdfId))
      .collect();

    return Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.lessonId))
    );
  },
});

export const updateLesson = mutation({
  args: v.object({
    lessonId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  }),
  handler: async (ctx, { lessonId, title, description }) => {
    await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    // Check if another lesson with the same title exists
    const existingLesson = await ctx.db
      .query("lessons")
      .filter((q) =>
        q.and(q.eq(q.field("title"), title), q.neq(q.field("_id"), lessonId))
      )
      .first();

    if (existingLesson) {
      createAppError({
        message: "Lesson with same title already exists.",
      });
    }

    const updatedLessonId = await ctx.db.patch(normalizedId, {
      title,
      description,
    });

    return updatedLessonId;
  },
});
