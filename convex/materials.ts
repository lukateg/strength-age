import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
  handler: async ({ db }, { userId, classId, lessonIds, pdfFiles }) => {
    for (const pdf of pdfFiles) {
      await db.insert("pdfs", {
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
export const getAllPDFs = query({
  args: v.object({
    classId: v.string(),
    userId: v.optional(v.string()),
  }),
  handler: async ({ db }, { classId, userId }) => {
    if (!userId) {
      return [];
    }
    return await db
      .query("pdfs")
      .withIndex("by_class_user", (q) => q.eq("classId", classId))
      .collect();
  },
});

export const getAllPDFsByUser = query({
  args: v.object({
    userId: v.optional(v.string()),
  }),
  handler: async ({ db }, { userId }) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await db
      .query("pdfs")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getLessonPDFs = query({
  args: {
    lessonId: v.string(),
  },
  handler: async ({ db }, { lessonId }) => {
    const allPDFs = await db.query("pdfs").collect();
    return allPDFs.filter((pdf) => pdf.lessonIds?.includes(lessonId));
  },
});
