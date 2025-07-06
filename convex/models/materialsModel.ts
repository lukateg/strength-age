import { internal } from "convex/_generated/api";
import { type Doc, type DataModel } from "convex/_generated/dataModel";

import { type Id } from "convex/_generated/dataModel";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { runDeleteClassDataBatch } from "./classesModel";

export const getMaterialsByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"materials">[]> => {
  return await ctx.db
    .query("materials")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
};

export const createMaterial = async (
  ctx: GenericMutationCtx<DataModel>,
  material: Omit<
    Doc<"materials">,
    "_creationTime" | "_id" | "createdBy" | "classId"
  >,
  createdBy: string,
  classId: Id<"classes">
) => {
  return await ctx.db.insert("materials", {
    ...material,
    createdBy,
    classId,
  });
};

export const createManyMaterials = async (
  ctx: GenericMutationCtx<DataModel>,
  materials: Omit<
    Doc<"materials">,
    "_creationTime" | "_id" | "createdBy" | "classId"
  >[],
  createdBy: string,
  classId: Id<"classes">
) => {
  for (const material of materials) {
    await createMaterial(ctx, material, createdBy, classId);
  }
};

export const getMaterialsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  const materials = await ctx.db
    .query("materials")
    .withIndex("by_class_user", (q) => q.eq("classId", classId))
    .collect();

  return materials;
};

export const getMaterialsByLessonMaterialsJoin = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonMaterials: Doc<"lessonMaterials">[]
): Promise<Doc<"materials">[]> => {
  if (!lessonMaterials.length) return [];

  return ctx.db
    .query("materials")
    .filter((q) =>
      q.or(...lessonMaterials.map((lm) => q.eq(q.field("_id"), lm.materialId)))
    )
    .collect();
};

export const getMaterialsByLesson = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lessonMaterials = await getLessonMaterialsJoin(ctx, lessonId);

  return getMaterialsByLessonMaterialsJoin(ctx, lessonMaterials);
};

export const getLessonMaterialsJoin = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) => {
  const lessonMaterials = await ctx.db
    .query("lessonMaterials")
    .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
    .collect();

  return lessonMaterials;
};

export const getMaterialByLessonId = async (
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">,
  materialId: Id<"materials">
) => {
  return await ctx.db
    .query("lessonMaterials")
    .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
    .filter((q) => q.eq(q.field("materialId"), materialId))
    .unique();
};

export const getMaterialsByIds = async (
  ctx: GenericQueryCtx<DataModel>,
  materialIds: Id<"materials">[]
) => {
  const materials = (
    await Promise.all(
      materialIds.map((materialId) =>
        ctx.db
          .query("materials")
          .filter((q) => q.eq(q.field("_id"), materialId))
          .collect()
      )
    )
  ).flat();
  return materials;
};

export async function getTotalStorageUsage(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
) {
  const existingMaterials = await ctx.db
    .query("materials")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();

  return existingMaterials.reduce((acc, m) => acc + m.size, 0);
}

export async function deleteMaterialsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;

  const { page, isDone, continueCursor } = await ctx.db
    .query("materials")
    .withIndex("by_class_user", (q) => q.eq("classId", classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const material of page) {
    // Only delete the material if it's not referenced by any lessons
    const isReferenced = await isMaterialReferencedByLessons(ctx, material._id);
    if (!isReferenced) {
      await runDeleteMaterialFromUploadThing(ctx, material);
      await ctx.db.delete(material._id);
    }
  }

  if (!isDone) {
    await runDeleteClassDataBatch(
      ctx,
      classId,
      "materials",
      userId,
      continueCursor
    );
  } else {
    await runDeleteClassDataBatch(ctx, classId, "tests", userId);
  }
}

export const isMaterialReferencedByLessons = async (
  ctx: GenericQueryCtx<DataModel>,
  materialId: Id<"materials">
): Promise<boolean> => {
  const references = await ctx.db
    .query("lessonMaterials")
    .withIndex("by_materialId", (q) => q.eq("materialId", materialId))
    .collect();

  return references.length > 0;
};

export const runDeleteMaterialFromUploadThing = async (
  ctx: GenericMutationCtx<DataModel>,
  material: Doc<"materials">
) => {
  await ctx.scheduler.runAfter(
    0,
    internal.uploadThing.deleteFileFromUploadThing,
    {
      pdf: material,
    }
  );
};

export const sortMaterialsByLessonJoins = (
  materials: Doc<"materials">[],
  lessonMaterialsJoins: Doc<"lessonMaterials">[],
  lessonIds: Id<"lessons">[]
) => {
  return lessonIds.map((lessonId) => {
    const lessonMaterialIds = lessonMaterialsJoins
      .filter((lm) => lm.lessonId === lessonId)
      .map((lm) => lm.materialId);
    return materials.filter((m) => lessonMaterialIds.includes(m._id));
  });
};
