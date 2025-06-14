import { v } from "convex/values";
import { AuthenticationRequired, createAppError } from "./utils";
import { internalMutation, mutation, query } from "./_generated/server";

import { deleteLessonPdfsJoinByClassIdBatch } from "./models/lessonPdfsModel";
import {
  deleteTestReviewsByClassIdBatch,
  deleteTestsByClassIdBatch,
} from "./tests";
import { deletePdfsByClassIdBatch } from "./materials";
import { hasPermission } from "./permissions";
import {
  createClass,
  deleteClass,
  findClassByTitle,
  getClassById,
  getClassesByUser,
  runDeleteClassDataBatch,
  updateClass,
} from "./models/classesModel";
import { type DataModel } from "./_generated/dataModel";
import { type GenericMutationCtx } from "convex/server";
import { type Id } from "./_generated/dataModel";
import { deleteLessonsByClassIdBatch } from "./models/lessonsModel";

export const getClassesPageData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const classes = await getClassesByUser(ctx, userId);

    const canCreateClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "create"
    );

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

export const createClassMutation = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async (ctx, { title, description }) => {
    const userId = await AuthenticationRequired({ ctx });

    const canCreateClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "create"
    );
    if (!canCreateClass) {
      throw createAppError({
        message: "You are not authorized to create a class",
      });
    }

    const existingClassName = await findClassByTitle(ctx, userId, title);
    if (existingClassName) {
      throw createAppError({
        message: "Class with same title already exists.",
      });
    }

    return await createClass(ctx, userId, title, description);
  },
});

export const updateClassMutation = mutation({
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

    const classItem = await getClassById(ctx, normalizedId);
    if (!classItem) {
      throw createAppError({
        message: "Class you are trying to update does not exist",
      });
    }

    const canUpdateClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "update",
      classItem
    );
    if (!canUpdateClass) {
      throw createAppError({
        message: "You are not authorized to update this class",
      });
    }

    return await updateClass(ctx, normalizedId, title, description);
  },
});

export const deleteClassMutation = mutation({
  args: { classId: v.string() },
  handler: async (ctx, { classId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("classes", classId);
    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const classItem = await getClassById(ctx, normalizedId);
    if (!classItem) {
      throw createAppError({
        message: "Class you are trying to delete does not exist",
      });
    }

    const canDeleteClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "delete",
      classItem
    );
    if (!canDeleteClass) {
      throw createAppError({
        message: "You are not authorized to delete this class",
      });
    }

    await runDeleteClassDataBatch(ctx, normalizedId, "lessonPdfs", userId);
    await deleteClass(ctx, normalizedId);

    return { success: true };
  },
});

export const deleteClassDataInternalMutation = internalMutation({
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
  handler: async (
    ctx: GenericMutationCtx<DataModel>,
    {
      classId,
      userId,
      phase,
      cursor,
    }: {
      classId: Id<"classes">;
      userId: string;
      phase: "lessons" | "pdfs" | "lessonPdfs" | "tests" | "testReviews";
      cursor?: string;
    }
  ) => {
    try {
      switch (phase) {
        case "lessonPdfs":
          await deleteLessonPdfsJoinByClassIdBatch(
            ctx,
            classId,
            userId,
            cursor
          );
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
