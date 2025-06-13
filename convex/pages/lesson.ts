import { v } from "convex/values";
import { query } from "../_generated/server";
import { AuthenticationRequired, createAppError } from "convex/utils";
import { type GenericQueryCtx } from "convex/server";
import { type DataModel } from "../_generated/dataModel";
import { type Id } from "../_generated/dataModel";
import { hasPermission } from "convex/permissions";

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
    const lesson = await getLesson(ctx, normalizedId);

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

export const getMaterialsByLesson = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lessonPdfs = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
    .collect();

  const pdfs = await Promise.all(
    lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
  );

  return pdfs.filter((pdf): pdf is NonNullable<typeof pdf> => pdf !== null);
};

export const getLesson = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lesson = await ctx.db.get(lessonId);

  if (!lesson) {
    throw createAppError({ message: "Lesson not found" });
  }

  return lesson;
};
