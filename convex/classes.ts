import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils/utils";
import { internal } from "./_generated/api";
import { type GenericMutationCtx } from "convex/server";
import { type Id, type DataModel } from "./_generated/dataModel";

export const getAllClassesByUserId = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    return await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getClassById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("classes", id);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }
    return await ctx.db.get(normalizedId);
  },
});

export const createClass = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async (ctx, { title, description }) => {
    const userId = await AuthenticationRequired({ ctx });

    return await ctx.db.insert("classes", {
      title,
      description,
      userId,
    });
  },
});

export const updateClass = mutation({
  args: {
    classId: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { classId, title, description }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("classes", classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const existingClass = await ctx.db.get(normalizedId);
    if (!existingClass) {
      throw createAppError({ message: "Class not found" });
    }

    if (existingClass.userId !== userId) {
      throw createAppError({ message: "Not authorized to update this class" });
    }

    return await ctx.db.patch(normalizedId, {
      title,
      description,
    });
  },
});

// Main deletion function that initiates the process
export const deleteClass = mutation({
  args: { id: v.id("classes") },
  handler: async (ctx, { id }) => {
    const userId = await AuthenticationRequired({ ctx });

    const existingClass = await ctx.db.get(id);
    if (!existingClass) {
      throw new Error("Class not found");
    }

    if (existingClass.userId !== userId) {
      throw new Error("Not authorized to delete this class");
    }

    // Start the batch deletion process in the background
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId: id,
      userId,
      phase: "lessonPdfs",
      cursor: undefined,
    });

    // Delete the class immediately to give instant feedback to the user
    await ctx.db.delete(id);

    return { success: true };
  },
});

// Helper functions for batch deletion
async function deleteLessonPdfsBatch(
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

async function deleteLessonsBatch(
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

async function deletePdfsBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("pdfs")
    .withIndex("by_class_user", (q) => q.eq("classId", classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const pdf of page) {
    const fileKey = pdf.fileUrl.split("/").pop();
    if (!fileKey) continue;

    await ctx.scheduler.runAfter(
      0,
      internal.uploadThingActions.deleteFileFromUploadThing,
      {
        fileKey,
      }
    );

    await ctx.db.delete(pdf._id);
  }

  if (!isDone) {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "pdfs",
      cursor: continueCursor,
    });
  } else {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "tests",
      cursor: undefined,
    });
  }
}

async function deleteTestsBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("userId", userId))
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

async function deleteTestReviewsBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("userId", userId))
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

// Main batch deletion handler
export const batchDeleteClassData = internalMutation({
  args: {
    classId: v.id("classes"),
    userId: v.string(),
    phase: v.union(
      v.literal("lessons"),
      v.literal("pdfs"),
      v.literal("lessonPdfs"),
      v.literal("tests"),
      v.literal("testReviews")
    ),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { classId, userId, phase, cursor }) => {
    try {
      switch (phase) {
        case "lessonPdfs":
          await deleteLessonPdfsBatch(ctx, classId, userId, cursor);
          break;
        case "lessons":
          await deleteLessonsBatch(ctx, classId, userId, cursor);
          break;
        case "pdfs":
          await deletePdfsBatch(ctx, classId, userId, cursor);
          break;
        case "tests":
          await deleteTestsBatch(ctx, classId, userId, cursor);
          break;
        case "testReviews":
          await deleteTestReviewsBatch(ctx, classId, userId, cursor);
          break;
      }
    } catch (error) {
      console.error(`Error during ${phase} deletion:`, error);
    }
  },
});
