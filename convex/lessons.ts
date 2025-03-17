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

export const createLessonWithExistingMaterials = mutation({
  args: v.object({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    pdfIds: v.array(v.id("pdfs")),
  }),
  handler: async ({ db }, { userId, classId, title, description, pdfIds }) => {
    const lessonId = await db.insert("lessons", {
      userId,
      classId,
      title,
      description: description ?? "",
      createdAt: Date.now(), // remove
    });

    if (pdfIds.length > 0) {
      for (const pdfId of pdfIds) {
        const pdf = await db.get(pdfId);
        if (pdf) {
          const updatedLessonIds = [...(pdf.lessonIds ?? []), lessonId];
          await db.patch(pdfId, {
            lessonIds: updatedLessonIds,
          });
        }
      }
    }

    return lessonId;
  },
});
// TODO: separate this into two functions and use createLesson.then(uploadMaterials)
export const createLessonWithNewMaterials = mutation({
  args: v.object({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    pdfFiles: v.array(
      v.object({
        fileUrl: v.string(),
        name: v.string(),
      })
    ),
  }),
  handler: async (
    { db },
    { userId, classId, title, description, pdfFiles }
  ) => {
    // check first if there is already lesson with same title
    // const existingLesson = await db.query("lessons").filter((q) => q.eq(q.field("title"), title)).first();
    // if (existingLesson) {
    //   throw new Error("Lesson with same title already exists");
    // }

    const lessonId = await db.insert("lessons", {
      userId,
      classId,
      title,
      description: description ?? "",
      createdAt: Date.now(), // remove
    });

    if (pdfFiles.length > 0) {
      for (const pdf of pdfFiles) {
        await db.insert("pdfs", {
          userId,
          classId,
          fileUrl: pdf.fileUrl,
          name: pdf.name,
          lessonIds: [lessonId],
          uploadedAt: Date.now(),
        });
      }
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
