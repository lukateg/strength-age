import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils";
import { hasPermission } from "./models/permissionsModel";

import {
  createManyPdfs,
  createPdf,
  runDeletePdfFromUploadThing,
} from "./models/materialsModel";
import { deleteLessonPdfsJoinByPdfId } from "./models/lessonPdfsModel";

export const addPdfMutation = mutation({
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
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const canAddPdf = await hasPermission(ctx, userId, "materials", "create", {
      newFilesSize: pdf.size,
    });
    if (!canAddPdf) {
      throw createAppError({
        message: "Not authorized to add PDF",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const pdfId = await createPdf(ctx, pdf, userId, normalizedClassId);
    return pdfId;
  },
});

export const addManyPdfsMutation = mutation({
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
      throw createAppError({
        message: "Invalid class ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const newFilesSize = pdfFiles.reduce((acc, pdf) => acc + pdf.size, 0);
    const canAddPdfs = await hasPermission(ctx, userId, "materials", "create", {
      newFilesSize,
    });
    if (!canAddPdfs) {
      throw createAppError({
        message: "Not authorized to add PDFs",
        statusCode: "PERMISSION_DENIED",
      });
    }

    await createManyPdfs(ctx, pdfFiles, userId, normalizedClassId);
  },
});

export const deletePdfMutation = mutation({
  args: { pdfId: v.string() },
  handler: async (ctx, { pdfId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedPdfId = ctx.db.normalizeId("pdfs", pdfId);
    if (!normalizedPdfId) {
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const pdf = await ctx.db.get(normalizedPdfId);
    if (!pdf) {
      throw createAppError({
        message: "PDF you are trying to delete does not exist",
        statusCode: "NOT_FOUND",
      });
    }

    const hasPermissionToDelete = await hasPermission(
      ctx,
      userId,
      "materials",
      "delete",
      pdf
    );
    if (!hasPermissionToDelete) {
      throw createAppError({
        message: "Not authorized to delete this PDF",
        statusCode: "PERMISSION_DENIED",
      });
    }

    await deleteLessonPdfsJoinByPdfId(ctx, normalizedPdfId);
    await runDeletePdfFromUploadThing(ctx, pdf);

    await ctx.db.delete(normalizedPdfId);

    return { success: true };
  },
});
