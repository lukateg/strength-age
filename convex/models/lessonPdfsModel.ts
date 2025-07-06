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

export async function deleteLessonMaterialsJoinByMaterialId(
  ctx: GenericMutationCtx<DataModel>,
  materialId: string
) {
  const normalizedMaterialId = ctx.db.normalizeId("materials", materialId);

  if (!normalizedMaterialId) {
    throw createAppError({
      message: "Invalid item ID",
      statusCode: "VALIDATION_ERROR",
    });
  }

  const lessonPdfs = await ctx.db
    .query("lessonMaterials")
    .withIndex("by_materialId", (q) => q.eq("materialId", normalizedMaterialId))
    .collect();

  for (const lessonMaterial of lessonPdfs) {
    await ctx.db.delete(lessonMaterial._id);
  }
}

export async function deleteLessonMaterialsJoinByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("lessonMaterials")
    .withIndex("by_classId", (q) => q.eq("classId", classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const lessonMaterial of page) {
    await ctx.db.delete(lessonMaterial._id);
  }

  if (!isDone) {
    await runDeleteClassDataBatch(
      ctx,
      classId,
      "lessonMaterials",
      userId,
      continueCursor
    );
  } else {
    // After deleting all lessonMaterials for this class, safely delete Materials that are no longer referenced
    await runDeleteClassDataBatch(ctx, classId, "materials", userId);
  }
}

export const getLessonMaterialsJoinsByLessonIds = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonIds: Id<"lessons">[]
) => {
  return (
    await Promise.all(
      lessonIds.map((lessonId) =>
        ctx.db
          .query("lessonMaterials")
          .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
          .collect()
      )
    )
  ).flat();
};

export const getLessonMaterialsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  return await ctx.db
    .query("lessonMaterials")
    .withIndex("by_classId", (q) => q.eq("classId", classId))
    .collect();
};
