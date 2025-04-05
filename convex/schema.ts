import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  classes: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
  }),

  lessons: defineTable({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  }).index("by_class", ["classId"]),

  // TODO: check if queries by both user and class
  pdfs: defineTable({
    userId: v.string(),
    classId: v.string(),
    lessonIds: v.array(v.string()), // Array of lesson IDs the PDF is linked to
    fileUrl: v.string(),
    name: v.string(),
    size: v.number(),
  })
    .index("by_class_user", ["classId", "userId"]) // ✅ Add an index for queries
    .index("by_lessonId", ["lessonIds"]), // Index for lessonIds

  tests: defineTable({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    questions: v.array(
      v.object({
        questionText: v.string(),
        questionType: v.string(),
        availableAnswers: v.optional(v.array(v.string())),
        correctAnswer: v.array(v.string()),
      })
    ),
  }),
  testReviews: defineTable({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    testId: v.string(),
    questions: v.array(
      v.object({
        questionText: v.string(),
        questionType: v.string(),
        availableAnswers: v.optional(v.array(v.string())),
        correctAnswer: v.array(v.string()),
        isCorrect: v.boolean(),
        answer: v.union(v.array(v.string()), v.string()),
        feedback: v.optional(v.string()),
      })
    ),
  }),
});
