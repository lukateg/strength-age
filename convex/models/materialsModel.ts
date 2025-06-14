import { type Doc, type DataModel } from "convex/_generated/dataModel";

import { type Id } from "convex/_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";

// Helper function to get materials
export const getMaterialsByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"pdfs">[]> => {
  return await ctx.db
    .query("pdfs")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
};

export const getMaterialsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  const materials = await ctx.db
    .query("pdfs")
    .withIndex("by_class_user", (q) => q.eq("classId", classId))
    .collect();

  return materials;
};

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
