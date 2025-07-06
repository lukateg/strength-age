import { v } from "convex/values";
import { AuthenticationRequired, createAppError } from "./utils";
import { internalMutation, mutation, query } from "./_generated/server";

import { deleteLessonMaterialsJoinByClassIdBatch } from "./models/lessonPdfsModel";

import { deleteMaterialsByClassIdBatch } from "./models/materialsModel";
import { hasPermission } from "./models/permissionsModel";
import {
  createClass,
  deleteClass,
  findClassByTitle,
  getClassById,
  runDeleteClassDataBatch,
  updateClass,
} from "./models/classesModel";
import { type DataModel } from "./_generated/dataModel";
import { type GenericMutationCtx } from "convex/server";
import { type Id } from "./_generated/dataModel";
import { deleteLessonsByClassIdBatch } from "./models/lessonsModel";
import { deleteTestReviewsByClassIdBatch } from "./models/testReviewsModel";
import { deleteTestsByClassIdBatch } from "./models/testsModel";

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
        statusCode: "PERMISSION_DENIED",
      });
    }

    const existingClassName = await findClassByTitle(ctx, userId, title);
    if (existingClassName) {
      throw createAppError({
        message: "Class with same title already exists.",
        statusCode: "VALIDATION_ERROR",
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
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const classItem = await getClassById(ctx, normalizedId);
    if (!classItem) {
      throw createAppError({
        message: "Class you are trying to update does not exist",
        statusCode: "NOT_FOUND",
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
        statusCode: "PERMISSION_DENIED",
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
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const classItem = await getClassById(ctx, normalizedId);
    if (!classItem) {
      throw createAppError({
        message: "Class you are trying to delete does not exist",
        statusCode: "NOT_FOUND",
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
        statusCode: "PERMISSION_DENIED",
      });
    }

    await runDeleteClassDataBatch(ctx, normalizedId, "lessonMaterials", userId);
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
      v.literal("materials"),
      v.literal("lessonMaterials"),
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
      phase:
        | "lessons"
        | "materials"
        | "lessonMaterials"
        | "tests"
        | "testReviews";
      cursor?: string;
    }
  ) => {
    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    if (!normalizedClassId) {
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    try {
      switch (phase) {
        case "lessonMaterials":
          await deleteLessonMaterialsJoinByClassIdBatch(
            ctx,
            normalizedClassId,
            userId,
            cursor
          );
          break;
        case "lessons":
          await deleteLessonsByClassIdBatch(
            ctx,
            normalizedClassId,
            userId,
            cursor
          );
          break;
        case "materials":
          await deleteMaterialsByClassIdBatch(
            ctx,
            normalizedClassId,
            userId,
            cursor
          );
          break;
        case "tests":
          await deleteTestsByClassIdBatch(
            ctx,
            normalizedClassId,
            userId,
            cursor
          );
          break;
        case "testReviews":
          await deleteTestReviewsByClassIdBatch(
            ctx,
            normalizedClassId,
            userId,
            cursor
          );
          break;
      }
    } catch (error) {
      console.error(`Error during ${phase} deletion:`, error);
    }
  },
});
