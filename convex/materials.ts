import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired } from "./utils/utils";

export const uploadPdf = mutation({
  args: {
    userId: v.string(),
    classId: v.string(),
    lessonIds: v.array(v.string()),
    pdfFiles: v.array(
      v.object({
        fileUrl: v.string(),
        name: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, { userId, classId, lessonIds, pdfFiles }) => {
    await AuthenticationRequired({ ctx });

    for (const pdf of pdfFiles) {
      await ctx.db.insert("pdfs", {
        userId,
        classId,
        lessonIds,
        fileUrl: pdf.fileUrl,
        name: pdf.name,
        size: pdf.size,
      });
    }
  },
});

// TODO: rename to getAllPDFsByClassId
export const getPdfsByClassId = query({
  args: v.object({
    classId: v.string(),
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
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

// TODO: check if this returns all PDFs from database
export const getLessonPDFs = query({
  args: {
    lessonId: v.string(),
  },
  handler: async (ctx, { lessonId }) => {
    await AuthenticationRequired({ ctx });

    const allPDFs = await ctx.db.query("pdfs").collect();
    return allPDFs.filter((pdf) => pdf.lessonIds?.includes(lessonId));
  },
});
