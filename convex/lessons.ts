import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getLessonsByClass = query({
  args: v.object({
    classId: v.string(),
  }),
  handler: async ({ db }, { classId }) => {
    return await db
      .query("lessons")
      .filter((q) => q.eq(q.field("classId"), classId))
      .collect();
  },
});

export const createLesson = mutation({
  args: v.object({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  }),
  handler: async ({ db }, { userId, classId, title, description }) => {
    return await db.insert("lessons", {
      userId,
      classId,
      title,
      description: description ?? "",
      createdAt: Date.now(), // remove
    });
  },
});

// TODO: separate this into two functions and use createLesson.then(uploadMaterials)
export const createLessonWithMaterials = mutation({
  args: v.object({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    pdfId: v.optional(v.string()), // Allow optional materials
    fileUrl: v.string(),
  }),
  handler: async (
    { db },
    { userId, classId, title, description, pdfId, fileUrl }
  ) => {
    const lessonId = await db.insert("lessons", {
      userId,
      classId,
      title,
      description: description ?? "",
      createdAt: Date.now(), // remove
    });

    // TODO : Add support for multiple materials, and if there is PDF with same values, this will override lessions
    if (pdfId) {
      await db.insert("pdfs", {
        userId,
        classId,
        fileUrl: fileUrl,
        lessonIds: [lessonId],
        uploadedAt: Date.now(),
      });
    }

    return lessonId;
  },
});

export const getLessonData = query({
  args: v.object({
    lessonId: v.id("lessons"),
  }),
  handler: async ({ db }, { lessonId }) => {
    const lesson = await db.get(lessonId);

    // TODO: - since we initially load all pdfs already, we can move this logic to context and avoid fetching all pdfs and duplicating logic
    const allPDFs = await db.query("pdfs").collect();
    const lessonPDFs = allPDFs.filter((pdf) =>
      pdf.lessonIds?.includes(lessonId)
    );

    return { lesson, lessonPDFs };
  },
});

// TODO: instead of lesson to the pdf, we should have pdf to the lesson -MAYBE(check theory)
// TODO: check if this is optimal solution
export const addPDFToLesson = mutation({
  args: v.object({
    pdfIds: v.array(v.id("pdfs")),
    lessonId: v.string(),
  }),
  handler: async ({ db }, { pdfIds, lessonId }) => {
    for (const pdfId of pdfIds) {
      const pdf = await db.get(pdfId);
      if (pdf) {
        const updatedLessonIds = [...(pdf.lessonIds ?? []), lessonId];
        await db.patch(pdfId, {
          lessonIds: updatedLessonIds,
        });
      }
    }
  },
});
