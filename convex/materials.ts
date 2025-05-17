import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils/utils";
import { internal } from "./_generated/api";

import { type DataModel, type Id } from "./_generated/dataModel";
import { type GenericMutationCtx } from "convex/server";

export const addPdf = mutation({
  args: {
    classId: v.id("classes"),
    pdf: v.object({
      fileUrl: v.string(),
      name: v.string(),
      size: v.number(),
    }),
  },
  handler: async (ctx, { classId, pdf }) => {
    const userId = await AuthenticationRequired({ ctx });

    const pdfId = await ctx.db.insert("pdfs", {
      createdBy: userId,
      classId,
      fileUrl: pdf.fileUrl,
      name: pdf.name,
      size: pdf.size,
    });

    return pdfId;
  },
});

export const addManyPdfs = mutation({
  args: {
    classId: v.id("classes"),
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

    for (const pdf of pdfFiles) {
      await ctx.db.insert("pdfs", {
        createdBy: userId,
        classId,
        fileUrl: pdf.fileUrl,
        name: pdf.name,
        size: pdf.size,
      });
    }
  },
});

export const getPdfsByClassId = query({
  args: v.object({
    classId: v.id("classes"),
  }),
  handler: async (ctx, { classId }) => {
    await AuthenticationRequired({ ctx });

    return await ctx.db
      .query("pdfs")
      .withIndex("by_class_user", (q) => q.eq("classId", classId))
      .collect();
  },
});

export const getAllPDFsByUser = query({
  args: v.object({}),
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    return await ctx.db
      .query("pdfs")
      .filter((q) => q.eq(q.field("createdBy"), userId))
      .collect();
  },
});

export const getPdfsForLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", args.lessonId))
      .collect();

    return Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
    );
  },
});

export async function deleteLessonPdfRelationsByPdfId(
  ctx: GenericMutationCtx<DataModel>,
  pdfId: Id<"pdfs">
) {
  const lessonPdfs = await ctx.db
    .query("lessonPdfs")
    .withIndex("by_pdfId", (q) => q.eq("pdfId", pdfId))
    .collect();

  for (const lessonPdf of lessonPdfs) {
    await ctx.db.delete(lessonPdf._id);
  }
}

export const deletePdf = mutation({
  args: { pdfId: v.id("pdfs") },
  handler: async (ctx, { pdfId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const pdf = await ctx.db.get(pdfId);
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

    await deleteLessonPdfRelationsByPdfId(ctx, pdfId);

    await ctx.scheduler.runAfter(
      0,
      internal.uploadThingActions.deleteFileFromUploadThing,
      {
        pdf,
      }
    );

    await ctx.db.delete(pdfId);

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
  const { page, isDone, continueCursor } = await ctx.db
    .query("pdfs")
    .withIndex("by_class_user", (q) => q.eq("classId", classId))
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
