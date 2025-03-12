import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

// export const addPDFToLesson = mutation({
//   args: v.object({
//     pdfId: v.string(),
//     lessonId: v.string(),
//   }),
//   handler: async ({ db }, { pdfId, lessonId }) => {
//     const pdf = await db.get(pdfId);
//     if (!pdf) {
//       throw new Error("PDF not found");
//     }

//     // ✅ Add the lessonId to the lessonIds array if it's not already there
//     await db.patch(pdfId, {
//       lessonIds: pdf.lessonIds.includes(lessonId)
//         ? pdf.lessonIds
//         : [...pdf.lessonIds, lessonId],
//     });
//   },
// });
