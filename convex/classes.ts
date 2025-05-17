import { v } from "convex/values";
import { AuthenticationRequired, createAppError } from "./utils/utils";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

import {
  deleteLessonPdfsByClassIdBatch,
  deleteLessonsByClassIdBatch,
} from "./lessons";
import {
  deleteTestReviewsByClassIdBatch,
  deleteTestsByClassIdBatch,
} from "./tests";
import { deletePdfsByClassIdBatch } from "./materials";

export const getAllClassesByUserId = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    return await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();
  },
});

export const getClassById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("classes", id);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }
    const classResponse = await ctx.db.get(normalizedId);

    if (classResponse?.createdBy !== userId) {
      throw createAppError({ message: "Not authorized to access this class" });
    }

    return classResponse;
  },
});

export const createClass = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async (ctx, { title, description }) => {
    const userId = await AuthenticationRequired({ ctx });

    const existingClass = await ctx.db
      .query("classes")
      .withIndex("by_class_name", (q) => q.eq("title", title))
      .first();

    if (existingClass) {
      throw createAppError({
        message: "Class with same title already exists.",
      });
    }

    return await ctx.db.insert("classes", {
      title,
      description,
      createdBy: userId,
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

    if (existingClass.createdBy !== userId) {
      throw createAppError({ message: "Not authorized to update this class" });
    }

    return await ctx.db.patch(normalizedId, {
      title,
      description,
    });
  },
});

export const deleteClass = mutation({
  args: { classId: v.string() },
  handler: async (ctx, { classId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("classes", classId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const existingClass = await ctx.db.get(normalizedId);
    if (!existingClass) {
      throw new Error("Class not found");
    }

    if (existingClass.createdBy !== userId) {
      throw new Error("Not authorized to delete this class");
    }

    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId: normalizedId,
      userId,
      phase: "lessonPdfs",
      cursor: undefined,
    });

    await ctx.db.delete(normalizedId);

    return { success: true };
  },
});

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
          await deleteLessonPdfsByClassIdBatch(ctx, classId, userId, cursor);
          break;
        case "lessons":
          await deleteLessonsByClassIdBatch(ctx, classId, userId, cursor);
          break;
        case "pdfs":
          await deletePdfsByClassIdBatch(ctx, classId, userId, cursor);
          break;
        case "tests":
          await deleteTestsByClassIdBatch(ctx, classId, userId, cursor);
          break;
        case "testReviews":
          await deleteTestReviewsByClassIdBatch(ctx, classId, userId, cursor);
          break;
      }
    } catch (error) {
      console.error(`Error during ${phase} deletion:`, error);
    }
  },
});
