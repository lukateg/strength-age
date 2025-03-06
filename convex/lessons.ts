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

export const createLessonWithMaterials = mutation({
  args: v.object({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    pdfId: v.optional(v.string()), // Allow optional materials
    fileUrl: v.string(),
    // materialIds: v.optional(v.array(v.string())), // Allow optional materials
  }),
  handler: async (
    { db },
    { userId, classId, title, description, pdfId, fileUrl }
  ) => {
    // 1️⃣ Create the lesson
    const lessonId = await db.insert("lessons", {
      userId,
      classId,
      title,
      description: description ?? "",
      createdAt: Date.now(),
    });
    console.log("Created lesson with ID:", lessonId);
    // 2️⃣ If materials were selected, link them to the lesson
    // TODO : Add support for multiple materials, and if there is PDF with same values, this will override lessions
    if (pdfId) {
      await db.insert("pdfs", {
        userId,
        classId,
        fileUrl: fileUrl,
        lessonIds: [lessonId],
        uploadedAt: Date.now(),
      });
      // await db.insert("lessonPdfs", { lessonId, pdfId });
      // await Promise.all(
      //   pdfIds.map((pdfId) => db.insert("lessonPdfs", { lessonId, pdfId }))
      // );
    }

    return lessonId;
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
