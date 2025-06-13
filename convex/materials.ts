import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils";
import { internal } from "./_generated/api";

import { type DataModel, type Id } from "./_generated/dataModel";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";

export async function getTotalStorageUsage(
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>,
  userId: string
) {
  const existingPdfs = await ctx.db
    .query("pdfs")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();

  return existingPdfs.reduce((acc, pdf) => acc + pdf.size, 0);
}

export const addPdf = mutation({
  args: {
    classId: v.string(),
    pdf: v.object({
      fileUrl: v.string(),
      name: v.string(),
      size: v.number(),
    }),
  },
  handler: async (ctx, { classId, pdf }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);

    if (!normalizedClassId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const totalSize = await getTotalStorageUsage(ctx, userId);

    // await checkPermission(ctx, userId, "materials", "create", {
    //   uploadedFilesSize: totalSize + pdf.size,
    // });

    const pdfId = await ctx.db.insert("pdfs", {
      createdBy: userId,
      classId: normalizedClassId,
      fileUrl: pdf.fileUrl,
      name: pdf.name,
      size: pdf.size,
    });

    return pdfId;
  },
});

export const addManyPdfs = mutation({
  args: {
    classId: v.string(),
    pdfFiles: v.array(
      v.object({
        fileUrl: v.string(),
        name: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, { classId, pdfFiles }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);

    if (!normalizedClassId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const totalSize = await getTotalStorageUsage(ctx, userId);
    const newFilesTotalSize = pdfFiles.reduce((acc, pdf) => acc + pdf.size, 0);

    //    await checkPermission(ctx, userId, "materials", "create", {
    //   uploadedFilesSize: totalSize + newFilesTotalSize,
    // });

    for (const pdf of pdfFiles) {
      await ctx.db.insert("pdfs", {
        createdBy: userId,
        classId: normalizedClassId,
        fileUrl: pdf.fileUrl,
        name: pdf.name,
        size: pdf.size,
      });
    }
  },
});

export const getPdfsByClassId = query({
  args: v.object({
    classId: v.string(),
  }),
  handler: async (ctx, { classId }) => {
    await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);

    if (!normalizedClassId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    return await ctx.db
      .query("pdfs")
      .withIndex("by_class_user", (q) => q.eq("classId", normalizedClassId))
      .collect();
  },
});

export const getAllPDFsByUser = query({
  args: v.object({}),
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    return await ctx.db
      .query("pdfs")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();
  },
});

export const getTotalSizeOfPdfsByUser = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });
    return await getTotalStorageUsage(ctx, userId);
  },
});

export const getPdfsForLesson = query({
  args: { lessonId: v.string() },
  handler: async (ctx, args) => {
    const normalizedLessonId = ctx.db.normalizeId("lessons", args.lessonId);

    if (!normalizedLessonId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", normalizedLessonId))
      .collect();

    return Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
    );
  },
});

export async function deleteLessonPdfRelationsByPdfId(
  ctx: GenericMutationCtx<DataModel>,
  pdfId: string
) {
  const normalizedPdfId = ctx.db.normalizeId("pdfs", pdfId);

  if (!normalizedPdfId) {
    throw createAppError({ message: "Invalid item ID" });
  }

  const lessonPdfs = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_pdfId", (q) => q.eq("pdfId", normalizedPdfId))
    .collect();

  for (const lessonPdf of lessonPdfs) {
    await ctx.db.delete(lessonPdf._id);
  }
}

export const deletePdf = mutation({
  args: { pdfId: v.string() },
  handler: async (ctx, { pdfId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedPdfId = ctx.db.normalizeId("pdfs", pdfId);

    if (!normalizedPdfId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const pdf = await ctx.db.get(normalizedPdfId);
    if (!pdf) {
      throw createAppError({
        message: "PDF not found",
      });
    }

    if (pdf.createdBy !== userId) {
      throw createAppError({
        message: "Not authorized to delete this PDF",
      });
    }

    await deleteLessonPdfRelationsByPdfId(ctx, normalizedPdfId);

    await ctx.scheduler.runAfter(
      0,
      internal.uploadThingActions.deleteFileFromUploadThing,
      {
        pdf,
      }
    );

    await ctx.db.delete(normalizedPdfId);

    return { success: true };
  },
});

export async function deletePdfsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;

  const normalizedId = ctx.db.normalizeId("classes", classId);

  if (!normalizedId) {
    throw createAppError({ message: "Invalid item ID" });
  }

  const { page, isDone, continueCursor } = await ctx.db
    .query("pdfs")
    .withIndex("by_class_user", (q) => q.eq("classId", normalizedId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const pdf of page) {
    await ctx.scheduler.runAfter(
      0,
      internal.uploadThingActions.deleteFileFromUploadThing,
      {
        pdf,
      }
    );

    await ctx.db.delete(pdf._id);
  }

  if (!isDone) {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "pdfs",
      cursor: continueCursor,
    });
  } else {
    await ctx.scheduler.runAfter(0, internal.classes.batchDeleteClassData, {
      classId,
      userId,
      phase: "tests",
      cursor: undefined,
    });
  }
}
