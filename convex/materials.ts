import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const uploadPdf = mutation({
  args: {
    userId: v.string(),
    classId: v.string(),
    fileUrl: v.string(),
    lessonIds: v.array(v.string()),
    name: v.string(),
  },
  handler: async ({ db }, { userId, classId, fileUrl, lessonIds, name }) => {
    await db.insert("pdfs", {
      userId,
      classId,
      fileUrl,
      uploadedAt: Date.now(),
      lessonIds,
      name,
    });
  },
});

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

export const getLessonPDFs = query({
  args: {
    lessonId: v.string(),
  },
  handler: async ({ db }, { lessonId }) => {
    const allPDFs = await db.query("pdfs").collect();
    return allPDFs.filter((pdf) => pdf.lessonIds?.includes(lessonId));
  },
});
