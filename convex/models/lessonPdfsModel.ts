import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type Id, type DataModel } from "../_generated/dataModel";
import { runDeleteClassDataBatch } from "./classesModel";

export const getLessonPdfsByLessonId = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  return await ctx.db
    .query("lessonPdfs")
    .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
    .collect();
};

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
    await runDeleteClassDataBatch(ctx, classId, "pdfs", userId);
  }
}
