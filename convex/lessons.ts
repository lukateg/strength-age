import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired } from "./utils/utils";

export const getLessonsByClass = query({
  args: v.object({
    classId: v.id("classes"),
  }),
  handler: async (ctx, { classId }) => {
    await AuthenticationRequired({ ctx });
    return await ctx.db
      .query("lessons")
      .filter((q) => q.eq(q.field("classId"), classId))
      .collect();
  },
});

export const createLesson = mutation({
  args: v.object({
    userId: v.string(),
    classId: v.id("classes"),
    title: v.string(),
    description: v.optional(v.string()),
  }),
  handler: async (ctx, { userId, classId, title, description }) => {
    await AuthenticationRequired({ ctx });
    return await ctx.db.insert("lessons", {
      userId,
      classId,
      title,
      description: description ?? "",
    });
  },
});

// export const createLessonWithExistingMaterials = mutation({
//   args: v.object({
//     userId: v.string(),
//     classId: v.id("classes"),
//     title: v.string(),
//     description: v.optional(v.string()),
//     pdfIds: v.array(v.id("pdfs")),
//   }),
//   handler: async (ctx, { userId, classId, title, description, pdfIds }) => {
//     await AuthenticationRequired({ ctx });
//     const lessonId = await ctx.db.insert("lessons", {
//       userId,
//       classId,
//       title,
//       description: description ?? "",
//     });

//     if (pdfIds.length > 0) {
//       for (const pdfId of pdfIds) {
//         const pdf = await ctx.db.get(pdfId);
//         if (pdf) {
//           const updatedLessonIds = [...(pdf.lessonIds ?? []), lessonId];
//           await ctx.db.patch(pdfId, {
//             lessonIds: updatedLessonIds,
//           });
//         }
//       }
//     }

//     return lessonId;
//   },
// });
// TODO: separate this into two functions and use createLesson.then(uploadMaterials)
// export const createLessonWithNewMaterials = mutation({
//   args: v.object({
//     userId: v.string(),
//     classId: v.id("classes"),
//     title: v.string(),
//     description: v.optional(v.string()),
//     pdfFiles: v.array(
//       v.object({
//         fileUrl: v.string(),
//         name: v.string(),
//         size: v.number(),
//       })
//     ),
//   }),
//   handler: async (ctx, { userId, classId, title, description, pdfFiles }) => {
//     // check first if there is already lesson with same title
//     // const existingLesson = await db.query("lessons").filter((q) => q.eq(q.field("title"), title)).first();
//     // if (existingLesson) {
//     //   throw new Error("Lesson with same title already exists");
//     // }

//     const lessonId = await ctx.db.insert("lessons", {
//       userId,
//       classId,
//       title,
//       description: description ?? "",
//     });

//     if (pdfFiles.length > 0) {
//       for (const pdf of pdfFiles) {
//         await ctx.db.insert("pdfs", {
//           userId,
//           classId,
//           fileUrl: pdf.fileUrl,
//           name: pdf.name,
//           lessonIds: [lessonId],
//           size: pdf.size,
//         });
//       }
//     }

//     return lessonId;
//   },
// });

export const getPDFsByLessonId = query({
  args: v.object({
    lessonId: v.id("lessons"),
  }),
  handler: async (ctx, { lessonId }) => {
    await AuthenticationRequired({ ctx });
    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
      .collect();

    const pdfs = await Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
    );

    // Filter out any null PDFs and ensure we have valid PDFs
    return pdfs.filter((pdf): pdf is NonNullable<typeof pdf> => pdf !== null);
  },
});

export const getLessonData = query({
  args: v.object({
    lessonId: v.id("lessons"),
  }),
  handler: async (ctx, { lessonId }) => {
    await AuthenticationRequired({ ctx });
    const lesson = await ctx.db.get(lessonId);

    // TODO: - since we initially load all pdfs already, we can move this logic to context and avoid fetching all pdfs and duplicating logic
    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
      .collect();

    const lessonPDFs = await Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.pdfId))
    );

    return { lesson, lessonPDFs };
  },
});

export const addPdfToLesson = mutation({
  args: v.object({
    lessonId: v.id("lessons"),
    pdfId: v.id("pdfs"),
  }),
  handler: async (ctx, { lessonId, pdfId }) => {
    await AuthenticationRequired({ ctx });

    // Check if relationship already exists
    const existing = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
      .filter((q) => q.eq(q.field("pdfId"), pdfId))
      .unique();

    if (!existing) {
      await ctx.db.insert("lessonPdfs", {
        lessonId,
        pdfId,
      });
    }
  },
});

export const addManyPdfsToLesson = mutation({
  args: v.object({
    lessonId: v.id("lessons"),
    pdfIds: v.array(v.id("pdfs")),
  }),
  handler: async (ctx, { lessonId, pdfIds }) => {
    await AuthenticationRequired({ ctx });

    for (const pdfId of pdfIds) {
      // Check if relationship already exists
      const existing = await ctx.db
        .query("lessonPdfs")
        .withIndex("by_lessonId", (q) => q.eq("lessonId", lessonId))
        .filter((q) => q.eq(q.field("pdfId"), pdfId))
        .unique();

      if (!existing) {
        await ctx.db.insert("lessonPdfs", {
          lessonId,
          pdfId,
        });
      }
    }
  },
});

export const getLessonsForPdf = query({
  args: { pdfId: v.id("pdfs") },
  handler: async (ctx, args) => {
    const lessonPdfs = await ctx.db
      .query("lessonPdfs")
      .withIndex("by_pdfId", (q) => q.eq("pdfId", args.pdfId))
      .collect();

    return Promise.all(
      lessonPdfs.map(async (lp) => await ctx.db.get(lp.lessonId))
    );
  },
});
