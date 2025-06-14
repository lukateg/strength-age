import { type DataModel } from "convex/_generated/dataModel";
import { type Id } from "convex/_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";

export const getLessonById = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lesson = await ctx.db.get(lessonId);

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
