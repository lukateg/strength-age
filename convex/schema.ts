import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  classes: defineTable({
    classId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  }),

  lessons: defineTable({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_class", ["classId"]),
  // TODO: check if queries by both user and class
  pdfs: defineTable({
    userId: v.string(), // Owner of the PDF
    classId: v.string(), // Class the PDF belongs to
    lessonIds: v.optional(v.array(v.string())), // Array of lesson IDs the PDF is linked to
    fileUrl: v.string(), // PDF URL
    uploadedAt: v.number(), // Timestamp
  }).index("by_class_user", ["classId", "userId"]), // ✅ Add an index for queries

  lessonPdfs: defineTable({
    lessonId: v.string(),
    pdfId: v.string(),
  })
    .index("by_lesson", ["lessonId"])
    .index("by_material", ["pdfId"]),
});
