import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const uploadPdf = mutation({
  args: { userId: v.string(), classId: v.string(), fileUrl: v.string() },
  handler: async ({ db }, { userId, classId, fileUrl }) => {
    await db.insert("pdfs", {
      userId,
      classId,
      fileUrl,
      uploadedAt: Date.now(),
    });
  },
});

export const getPDFs = query({
  args: {
    classId: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return []; // Return an empty array if userId is not provided
    }
    const materials = await ctx.db
      .query("pdfs")
      .filter((q) =>
        q.and(
          q.eq(q.field("classId"), args.classId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .collect();

    return materials as unknown;
  },
});
