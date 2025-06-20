import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type Id, type DataModel } from "../_generated/dataModel";
import { runDeleteClassDataBatch } from "./classesModel";
import { createAppError } from "convex/utils";

// export const getLessonPdfsByLessonId = async (
//   ctx: GenericQueryCtx<DataModel>,
//   lessonId: Id<"lessons">
// ) => {
//   return await ctx.db
//     .query("lessonPdfs")
//     .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
//     .collect();
// };

export async function deleteLessonPdfsJoinByPdfId(
  ctx: GenericMutationCtx<DataModel>,
  pdfId: string
) {
  const normalizedPdfId = ctx.db.normalizeId("pdfs", pdfId);

  if (!normalizedPdfId) {
    throw createAppError({
      message: "Invalid item ID",
      statusCode: "VALIDATION_ERROR",
    });
  }

  const lessonPdfs = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_pdfId", (q) => q.eq("pdfId", normalizedPdfId))
    .collect();

  for (const lessonPdf of lessonPdfs) {
    await ctx.db.delete(lessonPdf._id);
  }
}

export async function deleteLessonPdfsJoinByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_classId", (q) => q.eq("classId", classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const lessonPdf of page) {
    await ctx.db.delete(lessonPdf._id);
  }

  if (!isDone) {
    await runDeleteClassDataBatch(
      ctx,
      classId,
      "lessonPdfs",
      userId,
      continueCursor
    );
  } else {
    // After deleting all lessonPdfs for this class, safely delete PDFs that are no longer referenced
    await runDeleteClassDataBatch(ctx, classId, "pdfs", userId);
  }
}

export const getLessonPdfJoinsByLessonIds = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonIds: Id<"lessons">[]
) => {
  return (
    await Promise.all(
      lessonIds.map((lessonId) =>
        ctx.db
          .query("lessonPdfs")
          .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
          .collect()
      )
    )
  ).flat();
};

export const getLessonPdfsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  return await ctx.db
    .query("lessonPdfs")
    .withIndex("by_classId", (q) => q.eq("classId", classId))
    .collect();
};
