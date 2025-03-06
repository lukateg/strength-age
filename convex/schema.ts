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

  pdfs: defineTable({
    classId: v.string(),
    fileUrl: v.string(),
    uploadedAt: v.float64(),
    userId: v.string(),
  }).index("by_user_course", ["userId", "classId"]), // ✅ Add an index for queries

  lessonMaterials: defineTable({
    lessonId: v.string(),
    materialId: v.string(),
  })
    .index("by_lesson", ["lessonId"])
    .index("by_material", ["materialId"]),
});

// export default defineSchema({
//   lessons: defineTable({
//     classId: v.string(),
//     title: v.string(),
//     description: v.optional(v.string()),
//     createdAt: v.number(),
//   }).index("by_class", ["classId"]),

//   materials: defineTable({
//     userId: v.string(),
//     classId: v.string(),
//     title: v.string(),
//     fileUrl: v.string(),
//     uploadedAt: v.number(),
//   }).index("by_class", ["classId"]),

//   lessonMaterials: defineTable({
//     lessonId: v.string(),
//     materialId: v.string(),
//   }).index("by_lesson", ["lessonId"])
//     .index("by_material", ["materialId"]),
// });
