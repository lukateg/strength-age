import { v } from "convex/values";
import { query } from "../_generated/server";
import { AuthenticationRequired, createAppError } from "convex/utils";
import { hasPermission } from "convex/models/permissionsModel";
import { getLessonById } from "../models/lessonsModel";
import { getMaterialsByLesson } from "../models/materialsModel";

export const getLessonPageData = query({
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

    const materials = await getMaterialsByLesson(ctx, normalizedId);
    const lesson = await getLessonById(ctx, normalizedId);

    if (!lesson) {
      throw createAppError({
        message: "Lesson not found",
        statusCode: "NOT_FOUND",
      });
    }

    const canEditLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "update",
      {
        lesson: lesson,
      }
    );
    if (!canEditLesson) {
      throw createAppError({
        message: "You are not authorized to edit this lesson",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const canDeleteLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "delete",
      {
        lesson: lesson,
      }
    );

    return {
      ...lesson,
      materials,
      canEditLesson,
      classId: lesson.classId,
      lessonId: lesson._id,
      permissions: {
        canEditLesson,
        canDeleteLesson,
      },
    };
  },
});
