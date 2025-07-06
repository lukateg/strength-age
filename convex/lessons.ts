import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils";

import { getClassById } from "./models/classesModel";
import { hasPermission } from "./models/permissionsModel";
import {
  getLessonByTitle,
  createLesson,
  addMaterialToLesson,
  getLessonById,
  updateLesson,
  runDeleteLessonDataBatch,
  deleteLesson,
} from "./models/lessonsModel";
import {
  getMaterialByLessonId,
  isMaterialReferencedByLessons,
  runDeleteMaterialFromUploadThing,
} from "./models/materialsModel";

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
      throw createAppError({
        message: "Invalid class ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const class_ = await getClassById(ctx, normalizedId);
    if (!class_) {
      throw createAppError({
        message: "Class not found",
        statusCode: "NOT_FOUND",
      });
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
      throw createAppError({
        message: "Not authorized to create a lesson",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const existingLesson = await getLessonByTitle(ctx, userId, title);
    if (existingLesson) {
      throw createAppError({
        message: "Lesson with same title already exists.",
        statusCode: "VALIDATION_ERROR",
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
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const lesson = await getLessonById(ctx, normalizedId);
    if (!lesson) {
      throw createAppError({
        message: "Lesson not found",
        statusCode: "NOT_FOUND",
      });
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
      throw createAppError({
        message: "Not authorized to update this lesson",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const existingLesson = await getLessonByTitle(ctx, userId, title);
    if (existingLesson) {
      throw createAppError({
        message: "Lesson with same title already exists.",
        statusCode: "VALIDATION_ERROR",
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
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const existingLesson = await getLessonById(ctx, normalizedId);
    if (!existingLesson) {
      throw createAppError({
        message: "Lesson not found",
        statusCode: "NOT_FOUND",
      });
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
      throw createAppError({
        message: "Not authorized to delete this lesson",
        statusCode: "PERMISSION_DENIED",
      });
    }

    await runDeleteLessonDataBatch(ctx, normalizedId, userId, "materials");
    await deleteLesson(ctx, normalizedId);

    return true;
  },
});

export const addMaterialToLessonMutation = mutation({
  args: v.object({
    lessonId: v.string(),
    materialId: v.id("materials"),
    classId: v.string(),
  }),
  handler: async (ctx, { lessonId, materialId, classId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    if (!normalizedClassId) {
      throw createAppError({
        message: "Invalid class ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const normalizedLessonId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedLessonId) {
      throw createAppError({
        message: "Invalid lesson ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const lesson = await ctx.db.get(normalizedLessonId);
    if (!lesson) {
      throw createAppError({
        message: "Lesson not found",
        statusCode: "NOT_FOUND",
      });
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
        statusCode: "PERMISSION_DENIED",
      });
    }

    const isInLesson = await getMaterialByLessonId(
      ctx,
      normalizedLessonId,
      materialId
    );
    if (isInLesson) {
      throw createAppError({
        message: "PDF already added to this lesson",
        statusCode: "VALIDATION_ERROR",
      });
    }

    await addMaterialToLesson(ctx, {
      lessonId: normalizedLessonId,
      materialId,
      classId: normalizedClassId,
    });
  },
});

export const addManyMaterialsToLessonMutation = mutation({
  args: v.object({
    lessonId: v.string(),
    materialIds: v.array(v.id("materials")),
    classId: v.string(),
  }),
  handler: async (ctx, { lessonId, materialIds, classId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    if (!normalizedClassId) {
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const classResponse = await ctx.db.get(normalizedClassId);
    if (!classResponse) {
      throw createAppError({
        message: "Class not found",
        statusCode: "NOT_FOUND",
      });
    }
    const normalizedLessonId = ctx.db.normalizeId("lessons", lessonId);
    if (!normalizedLessonId) {
      throw createAppError({
        message: "Lesson not found",
        statusCode: "NOT_FOUND",
      });
    }

    const lesson = await getLessonById(ctx, normalizedLessonId);
    if (!lesson) {
      throw createAppError({
        message: "Lesson not found",
        statusCode: "NOT_FOUND",
      });
    }

    const canAddMaterialsToLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "update",
      { lesson }
    );
    if (!canAddMaterialsToLesson) {
      throw createAppError({
        message: "Not authorized to add materials to this lesson",
        statusCode: "PERMISSION_DENIED",
      });
    }

    for (const materialId of materialIds) {
      const isInLesson = await getMaterialByLessonId(
        ctx,
        normalizedLessonId,
        materialId
      );

      if (!isInLesson) {
        await addMaterialToLesson(ctx, {
          lessonId: normalizedLessonId,
          materialId,
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
    phase: v.union(v.literal("lessonMaterials"), v.literal("materials")),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { lessonId, userId, phase, cursor }) => {
    try {
      const BATCH_SIZE = 100;

      // Get a batch of lessonMaterials instead of all at once
      const lessonMaterialsBatch = await ctx.db
        .query("lessonMaterials")
        .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
        .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

      // Delete each lessonMaterial entry and check if material should be deleted
      for (const lessonMaterial of lessonMaterialsBatch.page) {
        // Delete the lessonMaterial entry first
        await ctx.db.delete(lessonMaterial._id);

        // Check if this PDF is still referenced by any other lessons before deleting
        const isReferenced = await isMaterialReferencedByLessons(
          ctx,
          lessonMaterial.materialId
        );

        // Only delete the PDF if it's not referenced by any other lessons
        if (!isReferenced) {
          const material = await ctx.db.get(lessonMaterial.materialId);
          if (material) {
            await runDeleteMaterialFromUploadThing(ctx, material);
            await ctx.db.delete(lessonMaterial.materialId);
          }
        }
      }

      // Continue with next batch if needed
      if (!lessonMaterialsBatch.isDone) {
        await runDeleteLessonDataBatch(
          ctx,
          lessonId,
          userId,
          "materials",
          lessonMaterialsBatch.continueCursor
        );
      }
    } catch (error) {
      console.error(`Error during ${phase} deletion:`, error);
    }
  },
});
