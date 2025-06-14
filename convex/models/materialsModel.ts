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

export const getPdfsByLessonPdfsJoin = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonPdfs: Doc<"lessonPdfs">[]
): Promise<Doc<"pdfs">[]> => {
  if (!lessonPdfs.length) return [];

  return ctx.db
    .query("pdfs")
    .filter((q) =>
      q.or(
        ...lessonPdfs.map((lessonPdf) => q.eq(q.field("_id"), lessonPdf.pdfId))
      )
    )
    .collect();
};

export const getPdfsByLesson = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lessonPdfs = await getLessonPdfsJoin(ctx, lessonId);

  return getPdfsByLessonPdfsJoin(ctx, lessonPdfs);
};

export const getLessonPdfsJoin = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lessonPdfs = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
    .collect();

  return lessonPdfs;
};

export const getPdfByLessonId = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">,
  pdfId: Id<"pdfs">
) => {
  return await ctx.db
    .query("lessonPdfs")
    .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
    .filter((q) => q.eq(q.field("pdfId"), pdfId))
    .unique();
};
