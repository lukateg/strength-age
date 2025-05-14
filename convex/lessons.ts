import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils/utils";
import { internal } from "./_generated/api";

import { type Id, type DataModel } from "./_generated/dataModel";
import { type GenericMutationCtx } from "convex/server";

export const getLessonsByClass = query({
  args: v.object({
    classId: v.string(),
  }),
  // TODO change to index
  handler: async (ctx, { classId }) => {
    await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    return await ctx.db
      .query("lessons")
      .withIndex("by_class", (q) => q.eq("classId", normalizedId))
      .collect();
  },
});

export const createLesson = mutation({
  args: v.object({
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  }),
  handler: async (ctx, { classId, title, description }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

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
      classId: normalizedId,
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
    classId: v.string(),
  }),
  handler: async (ctx, { lessonId, pdfId, classId }) => {
    await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

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
        classId: normalizedId,
      });
    }
  },
});

export const addManyPdfsToLesson = mutation({
  args: v.object({
    lessonId: v.id("lessons"),
    pdfIds: v.array(v.id("pdfs")),
    classId: v.string(),
  }),
  handler: async (ctx, { lessonId, pdfIds, classId }) => {
    await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

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
          classId: normalizedId,
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

export async function deleteLessonPdfsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_classId", (q) => q.eq("classId", classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const lessonPdf of page) {
    await ctx.db.delete(lessonPdf._id);
  }

  if (!isDone) {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "lessonPdfs",
      cursor: continueCursor,
    });
  } else {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "lessons",
      cursor: undefined,
    });
  }
}

export async function deleteLessonsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("lessons")
    .withIndex("by_class", (q) => q.eq("classId", classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const lesson of page) {
    await ctx.db.delete(lesson._id);
  }

  if (!isDone) {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "lessons",
      cursor: continueCursor,
    });
  } else {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "pdfs",
      cursor: undefined,
    });
  }
}

export async function deleteLessonPdfsByLessonIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const lessonPdf of page) {
    await ctx.db.delete(lessonPdf._id);
  }

  if (!isDone) {
    await ctx.scheduler.runAfter(0, internal.lessons.batchDeleteLessonData, {
      lessonId,
      userId,
      phase: "lessonPdfs",
      cursor: continueCursor,
    });
  } else {
    await ctx.scheduler.runAfter(0, internal.lessons.batchDeleteLessonData, {
      lessonId,
      userId,
      phase: "pdfs",
      cursor: undefined,
    });
  }
}

export const deleteLesson = mutation({
  args: { lessonId: v.string() },
  handler: async (ctx, { lessonId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const existingLesson = await ctx.db.get(normalizedId);
    if (!existingLesson) {
      throw new Error("Lesson not found");
    }

    if (existingLesson.userId !== userId) {
      throw new Error("Not authorized to delete this lesson");
    }

    // Start the batch deletion process in the background
    await ctx.scheduler.runAfter(0, internal.lessons.batchDeleteLessonData, {
      lessonId: normalizedId,
      userId,
      phase: "pdfs",
      cursor: undefined,
    });

    // Delete the class immediately to give instant feedback to the user
    await ctx.db.delete(normalizedId);

    return { success: true };
  },
});

export const batchDeleteLessonData = internalMutation({
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
        await ctx.scheduler.runAfter(
          0,
          internal.lessons.batchDeleteLessonData,
          {
            lessonId,
            userId,
            phase: "pdfs",
            cursor: lessonPdfsBatch.continueCursor,
          }
        );
      }
    } catch (error) {
      console.error(`Error during ${phase} deletion:`, error);
    }
  },
});
