import { internal } from "convex/_generated/api";
import { type Doc, type DataModel } from "convex/_generated/dataModel";

import { type Id } from "convex/_generated/dataModel";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { runDeleteClassDataBatch } from "./classesModel";

export const getPdfsByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"pdfs">[]> => {
  return await ctx.db
    .query("pdfs")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
};

export const createPdf = async (
  ctx: GenericMutationCtx<DataModel>,
  pdf: Omit<Doc<"pdfs">, "_creationTime" | "_id" | "createdBy" | "classId">,
  createdBy: string,
  classId: Id<"classes">
) => {
  return await ctx.db.insert("pdfs", {
    ...pdf,
    createdBy,
    classId,
  });
};

export const createManyPdfs = async (
  ctx: GenericMutationCtx<DataModel>,
  pdfs: Omit<Doc<"pdfs">, "_creationTime" | "_id" | "createdBy" | "classId">[],
  createdBy: string,
  classId: Id<"classes">
) => {
  for (const pdf of pdfs) {
    await createPdf(ctx, pdf, createdBy, classId);
  }
};

export const getPdfsByClass = async (
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

export const getPdfsByIds = async (
  ctx: GenericQueryCtx<DataModel>,
  pdfIds: Id<"pdfs">[]
) => {
  const pdfs = (
    await Promise.all(
      pdfIds.map((pdfId) =>
        ctx.db
          .query("pdfs")
          .filter((q) => q.eq(q.field("_id"), pdfId))
          .collect()
      )
    )
  ).flat();
  return pdfs;
};

export async function getTotalStorageUsage(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
) {
  const existingPdfs = await ctx.db
    .query("pdfs")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();

  return existingPdfs.reduce((acc, pdf) => acc + pdf.size, 0);
}

export async function deletePdfsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;

  const { page, isDone, continueCursor } = await ctx.db
    .query("pdfs")
    .withIndex("by_class_user", (q) => q.eq("classId", classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const pdf of page) {
    await runDeletePdfFromUploadThing(ctx, pdf);

    await ctx.db.delete(pdf._id);
  }

  if (!isDone) {
    await runDeleteClassDataBatch(ctx, classId, "pdfs", userId, continueCursor);
  } else {
    await runDeleteClassDataBatch(ctx, classId, "tests", userId);
  }
}

export const runDeletePdfFromUploadThing = async (
  ctx: GenericMutationCtx<DataModel>,
  pdf: Doc<"pdfs">
) => {
  await ctx.scheduler.runAfter(
    0,
    internal.uploadThing.deleteFileFromUploadThing,
    {
      pdf,
    }
  );
};

export const sortPdfsByLessonJoins = (
  pdfs: Doc<"pdfs">[],
  lessonPdfJoins: Doc<"lessonPdfs">[],
  lessonIds: Id<"lessons">[]
) => {
  return lessonIds.map((lessonId) => {
    const lessonPdfIds = lessonPdfJoins
      .filter((lp) => lp.lessonId === lessonId)
      .map((lp) => lp.pdfId);
    return pdfs.filter((pdf) => lessonPdfIds.includes(pdf._id));
  });
};
