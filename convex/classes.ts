import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils/utils";
import { internal } from "./_generated/api";

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
    const classItem = await ctx.db.get(normalizedId);

    if (!classItem) {
      throw createAppError({ message: "Item not found" });
    }

    return classItem;
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

// Internal batch deletion handler
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
    const BATCH_SIZE = 100;

    try {
      switch (phase) {
        case "lessonPdfs": {
          // First get all lessons for this class
          const lessons = await ctx.db
            .query("lessons")
            .filter((q) => q.eq(q.field("classId"), classId))
            .collect();

          // If there are no lessons, skip to next phase
          if (lessons.length === 0) {
            console.log();
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "lessons",
                cursor: undefined,
              }
            );
            break;
          }

          // Get all lessonPdfs for these lessons
          const lessonPdfs = await Promise.all(
            lessons.map((lesson) =>
              ctx.db
                .query("lessonPdfs")
                .withIndex("by_lessonId", (q) => q.eq("lessonId", lesson._id))
                .collect()
            )
          );

          // Delete all lessonPdfs
          await Promise.all(
            lessonPdfs.flat().map((lessonPdf) => ctx.db.delete(lessonPdf._id))
          );

          // Move to next phase
          await ctx.scheduler.runAfter(
            0,
            internal.classes.batchDeleteClassData,
            {
              classId,
              userId,
              phase: "lessons",
              cursor: undefined,
            }
          );
          break;
        }

        case "lessons": {
          // Get a batch of lessons for this class
          const { page, isDone, continueCursor } = await ctx.db
            .query("lessons")
            .withIndex("by_class", (q) => q.eq("classId", classId))
            .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

          // Delete each lesson in the batch
          for (const lesson of page) {
            await ctx.db.delete(lesson._id);
          }

          // Continue with lessons or move to next phase
          if (!isDone) {
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "lessons",
                cursor: continueCursor,
              }
            );
          } else {
            // Move to next phase
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "pdfs",
                cursor: undefined,
              }
            );
          }
          break;
        }

        case "pdfs": {
          // Get a batch of PDFs for this class
          const { page, isDone, continueCursor } = await ctx.db
            .query("pdfs")
            .withIndex("by_class_user", (q) => q.eq("classId", classId))
            .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

          // Delete each PDF in the batch
          for (const pdf of page) {
            await ctx.db.delete(pdf._id);
          }

          // Continue with PDFs or move to next phase
          if (!isDone) {
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "pdfs",
                cursor: continueCursor,
              }
            );
          } else {
            // Move to next phase
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "tests",
                cursor: undefined,
              }
            );
          }
          break;
        }

        case "tests": {
          // Get a batch of tests for this class
          const { page, isDone, continueCursor } = await ctx.db
            .query("tests")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("classId"), classId))
            .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

          // Delete each test in the batch
          for (const test of page) {
            await ctx.db.delete(test._id);
          }

          // Continue with tests or move to next phase
          if (!isDone) {
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "tests",
                cursor: continueCursor,
              }
            );
          } else {
            // Move to next phase
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "testReviews",
                cursor: undefined,
              }
            );
          }
          break;
        }

        case "testReviews": {
          // Get a batch of test reviews for this class
          const { page, isDone, continueCursor } = await ctx.db
            .query("testReviews")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("classId"), classId))
            .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

          // Delete each test review in the batch
          for (const review of page) {
            await ctx.db.delete(review._id);
          }

          // Continue with test reviews or finish
          if (!isDone) {
            await ctx.scheduler.runAfter(
              0,
              internal.classes.batchDeleteClassData,
              {
                classId,
                userId,
                phase: "testReviews",
                cursor: continueCursor,
              }
            );
          }
          // No else needed - we're done with all phases
          break;
        }
      }
    } catch (error) {
      console.error(`Error during ${phase} deletion:`, error);
      // You might want to log this error or handle it in some way
    }
  },
});
