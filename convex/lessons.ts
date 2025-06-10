import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import {
  AuthenticationRequired,
  checkPermission,
  createAppError,
} from "./utils";
import { internal } from "./_generated/api";

import { type Id, type DataModel } from "./_generated/dataModel";
import { type GenericMutationCtx } from "convex/server";
import { hasPermission } from "./shared/abac";

export const getLessonsByClass = query({
  args: v.object({
    classId: v.string(),
  }),
  handler: async (ctx, { classId }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const classResponse = await ctx.db.get(normalizedId);
    if (!classResponse) {
      throw createAppError({ message: "Class not found" });
    }

    await checkPermission(ctx, userId, "classes", "view", {
      class: classResponse,
    });

    if (classResponse.createdBy !== userId) {
      throw createAppError({ message: "Not authorized to access this class" });
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

    const classResponse = await ctx.db.get(normalizedId);
    if (!classResponse) {
      throw createAppError({ message: "Class not found" });
    }

    const existingLessons = await ctx.db
      .query("lessons")
      .withIndex("by_class", (q) => q.eq("classId", normalizedId))
      .collect();

    await checkPermission(ctx, userId, "lessons", "create", {
      existingLessonsLength: existingLessons.length,
      class: classResponse,
    });

    const existingLesson = await ctx.db
      .query("lessons")
      .withIndex("by_lesson_name", (q) => q.eq("title", title))
      .first();

    if (existingLesson) {
      throw createAppError({
        message: "Lesson with same title already exists.",
      });
    }

    const lessonId = await ctx.db.insert("lessons", {
      createdBy: userId,
      classId: normalizedId,
      title,
      description,
    });

    return lessonId;
  },
});

export const getPDFsByLessonId = query({
  args: v.object({
    lessonId: v.string(),
  }),
  handler: async (ctx, { lessonId }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("lessons", lessonId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const lesson = await ctx.db.get(normalizedId);
    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    await checkPermission(ctx, userId, "lessons", "view", {
      lesson,
    });

    // if (lesson.createdBy !== userId) {
    //   throw createAppError({
    //     message: "Not authorized to access PDFs for this lesson",
    //   });
    // }

    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", normalizedId))
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
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const lesson = await ctx.db.get(normalizedId);
    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    // if (lesson.createdBy !== userId) {
    //   throw createAppError({ message: "Not authorized to access this lesson" });
    // }

    await checkPermission(ctx, userId, "lessons", "view", {
      lesson,
    });

    return lesson;
  },
});

export const getLessonPdfs = query({
  args: v.object({
    lessonId: v.string(),
  }),
  handler: async (ctx, { lessonId }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("lessons", lessonId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const lesson = await ctx.db.get(normalizedId);
    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    await checkPermission(ctx, userId, "lessons", "view", {
      lesson,
    });

    // if (lesson.createdBy !== userId) {
    //   throw createAppError({
    //     message: "Not authorized to access this lesson's PDFs",
    //   });
    // }

    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", normalizedId))
      .collect();

    const pdfsByLesson = await Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
    );

    // Filter out any null PDFs
    return pdfsByLesson.filter(
      (pdf): pdf is NonNullable<typeof pdf> => pdf !== null
    );
  },
});

export const addPdfToLesson = mutation({
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
    await checkPermission(ctx, userId, "lessons", "update", {
      lesson,
    });

    // Check if relationship already exists
    const existing = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", normalizedLessonId))
      .filter((q) => q.eq(q.field("pdfId"), pdfId))
      .unique();

    if (!existing) {
      await ctx.db.insert("lessonPdfs", {
        lessonId: normalizedLessonId,
        pdfId,
        classId: normalizedClassId,
      });
    }
  },
});

export const addManyPdfsToLesson = mutation({
  args: v.object({
    lessonId: v.string(),
    pdfIds: v.array(v.id("pdfs")),
    classId: v.string(),
  }),
  handler: async (ctx, { lessonId, pdfIds, classId }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    const normalizedLessonId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedClassId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const classResponse = await ctx.db.get(normalizedClassId);
    if (!classResponse) {
      throw createAppError({ message: "Class not found" });
    }
    if (!normalizedLessonId) {
      throw createAppError({ message: "Lesson not found" });
    }

    await checkPermission(ctx, userId, "classes", "create", {
      class: classResponse,
    });

    // if (classResponse.createdBy !== userId) {
    //   throw createAppError({
    //     message: "Not authorized to add PDFs to this lesson",
    //   });
    // }

    for (const pdfId of pdfIds) {
      // Check if relationship already exists
      const existing = await ctx.db
        .query("lessonPdfs")
        .withIndex("by_lessonId", (q) => q.eq("lessonId", normalizedLessonId))
        .filter((q) => q.eq(q.field("pdfId"), pdfId))
        .unique();

      if (!existing) {
        await ctx.db.insert("lessonPdfs", {
          lessonId: normalizedLessonId,
          pdfId,
          classId: normalizedClassId,
        });
      }
    }
  },
});

export const getLessonsForPdf = query({
  args: { pdfId: v.id("pdfs") },
  handler: async (ctx, args) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("pdfs", args.pdfId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const pdf = await ctx.db.get(normalizedId);
    if (!pdf) {
      throw createAppError({ message: "PDF not found" });
    }

    await checkPermission(ctx, userId, "materials", "view", {
      pdf,
    });

    // if (pdf.createdBy !== userId) {
    //   throw createAppError({
    //     message: "Not authorized to get PDFs for this lesson",
    //   });
    // }

    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_pdfId", (q) => q.eq("pdfId", normalizedId))
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
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const lesson = await ctx.db.get(normalizedId);
    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
    }

    await checkPermission(ctx, userId, "lessons", "update", {
      lesson,
    });

    // if (lesson.createdBy !== userId) {
    //   throw createAppError({
    //     message: "Not authorized to update this lesson",
    //   });
    // }

    const existingLesson = await ctx.db
      .query("lessons")
      .filter((q) =>
        q.and(q.eq(q.field("title"), title), q.neq(q.field("_id"), lessonId))
      )
      .first();
    if (existingLesson) {
      throw createAppError({
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

    await checkPermission(ctx, userId, "lessons", "delete", {
      lesson: existingLesson,
    });

    // if (existingLesson.createdBy !== userId) {
    //   throw new Error("Not authorized to delete this lesson");
    // }

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
