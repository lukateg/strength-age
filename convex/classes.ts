import { v } from "convex/values";
import { AuthenticationRequired, createAppError } from "./utils";
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
import { hasPermission } from "./permissions";

export const getClassesPageDataByUserId = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const canCreateClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "create"
    );

    const classes = await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();

    const classesWithPermissions = await Promise.all(
      classes.map(async (classItem) => {
        const canDeleteClass = await hasPermission(
          ctx,
          userId,
          "classes",
          "delete",
          classItem
        );
        const canUpdateClass = await hasPermission(
          ctx,
          userId,
          "classes",
          "update",
          classItem
        );
        const canGenerateTest = await hasPermission(
          ctx,
          userId,
          "tests",
          "create"
        );
        return {
          ...classItem,
          canDeleteClass,
          canUpdateClass,
          canGenerateTest,
        };
      })
    );

    return { classesWithPermissions, permissions: { canCreateClass } };
  },
});

// TODO: remove this query
export const getAllClassesByUserId = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const classes = await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();

    return classes;
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

    const classItem = await ctx.db.get(normalizedId);

    if (!classItem) {
      return null;
    }

    const canViewClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "view",
      classItem
    );

    if (!canViewClass) {
      throw createAppError({
        message: "You are not authorized to view this class",
      });
    }

    return {
      class: classItem,
    };
  },
});

export const createClass = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async (ctx, { title, description }) => {
    const userId = await AuthenticationRequired({ ctx });

    const existingClasses = await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();

    // await checkPermission(ctx, userId, "classes", "create", {
    //   existingClassesLength: existingClasses.length,
    // });

    const existingClass = await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .filter((q) => q.eq(q.field("title"), title))
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

    const classItem = await ctx.db.get(normalizedId);

    if (!classItem) {
      throw createAppError({ message: "Class not found" });
    }

    // await checkPermission(ctx, userId, "classes", "update", {
    //   class: classItem,
    // });

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

    const classItem = await ctx.db.get(normalizedId);

    if (!classItem) {
      throw createAppError({ message: "Class not found" });
    }

    //  await checkPermission(ctx, userId, "classes", "delete", {
    //   class: classItem,
    // });

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
