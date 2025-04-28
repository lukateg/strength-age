import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired } from "./utils/utils";

export const uploadPdf = mutation({
  args: {
    userId: v.string(),
    classId: v.id("classes"),
    pdfFiles: v.array(
      v.object({
        fileUrl: v.string(),
        name: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, { userId, classId, pdfFiles }) => {
    await AuthenticationRequired({ ctx });

    for (const pdf of pdfFiles) {
      await ctx.db.insert("pdfs", {
        userId,
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
      .filter((q) => q.eq(q.field("userId"), userId))
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

// export const addPdfToLesson = mutation({
//   args: {
//     lessonId: v.id("lessons"),
//     pdfId: v.id("pdfs"),
//   },
//   handler: async (ctx, args) => {
//     // Check if relationship already exists
//     const existing = await ctx.db
//       .query("lessonPdfs")
//       .withIndex("by_lessonId", q =>
//         q.eq("lessonId", args.lessonId).eq("pdfId", args.pdfId)
//       )
//       .unique();

//     if (!existing) {
//       await ctx.db.insert("lessonPdfs", {
//         lessonId: args.lessonId,
//         pdfId: args.pdfId,
//       });
//     }
//   },
// });
