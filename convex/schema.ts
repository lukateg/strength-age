import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pdfs: defineTable({
    classId: v.string(),
    fileUrl: v.string(),
    uploadedAt: v.float64(),
    userId: v.string(),
  }).index("by_user_course", ["userId", "classId"]), // ✅ Add an index for queries
});
