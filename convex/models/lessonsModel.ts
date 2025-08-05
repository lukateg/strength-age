import { internal } from "convex/_generated/api";
import { type DataModel } from "convex/_generated/dataModel";
import { type Id } from "convex/_generated/dataModel";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { runDeleteClassDataBatch } from "./classesModel";

export const getLessonById = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lesson = await ctx.db.get(lessonId);

  return lesson;
};

export const getLessonByTitle = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string,
  title: string
) => {
  const lesson = await ctx.db
    .query("lessons")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.eq(q.field("title"), title))
    .first();

  return lesson;
};

export const getLessonsByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
) => {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
  return lessons;
};

export const getLessonsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_class", (q) => q.eq("classId", classId))
    .collect();

  return lessons;
};

export const createLesson = async (
  ctx: GenericMutationCtx<DataModel>,
  userId: string,
  classId: Id<"classes">,
  title: string,
  description?: string
) => {
  const lessonId = await ctx.db.insert("lessons", {
    createdBy: userId,
    classId,
    title,
    description,
  });

  return lessonId;
};

export const updateLesson = async (
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">,
  params: {
    title: string;
    description?: string;
  }
) => {
  await ctx.db.patch(lessonId, params);
};

export const deleteLesson = async (
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  await ctx.db.delete(lessonId);
};

export const addMaterialToLesson = async (
  ctx: GenericMutationCtx<DataModel>,
  params: {
    lessonId: Id<"lessons">;
    materialId: Id<"materials">;
    classId: Id<"classes">;
  }
) => {
  await ctx.db.insert("lessonMaterials", {
    ...params,
  });
};

export const runDeleteLessonDataBatch = async (
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">,
  userId: string,
  phase: "materials",
  cursor?: string
) => {
  await ctx.scheduler.runAfter(
    0,
    internal.lessons.deleteLessonDataInternalMutation,
    {
      lessonId,
      userId,
      phase,
      cursor,
    }
  );
};

export async function deleteLessonsByClassIdBatch(
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
    await runDeleteClassDataBatch(
      ctx,
      classId,
      "lessons",
      userId,
      continueCursor
    );
  } else {
    // Move to deleting lessonMaterials join table first, then handle materials safely
    await runDeleteClassDataBatch(ctx, classId, "lessonMaterials", userId);
  }
}
