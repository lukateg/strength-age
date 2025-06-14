import { v } from "convex/values";
import { query } from "../_generated/server";
import { AuthenticationRequired, createAppError } from "convex/utils";
import { hasPermission } from "convex/permissions";
import { getLessonById } from "../models/lessonsModel";
import { getMaterialsByLesson } from "../models/materialsModel";

export const getLessonData = query({
  args: { lessonId: v.string() },
  handler: async (ctx, { lessonId }) => {
    const userId = await AuthenticationRequired({ ctx });

    if (!userId) {
      throw createAppError({ message: "Unauthorized" });
    }

    const normalizedId = ctx.db.normalizeId("lessons", lessonId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const materials = await getMaterialsByLesson(ctx, normalizedId);
    const lesson = await getLessonById(ctx, normalizedId);

    if (!lesson) {
      throw createAppError({ message: "Lesson not found" });
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
