import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    subscriptionTier: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  classes: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(),
  })
    .index("by_user", ["createdBy"])
    .index("by_class_name", ["title"]),

  lessons: defineTable({
    createdBy: v.string(),
    classId: v.id("classes"),
    title: v.string(),
    description: v.optional(v.string()),
  })
    .index("by_class", ["classId"])
    .index("by_lesson_name", ["title"]),

  pdfs: defineTable({
    createdBy: v.string(),
    classId: v.id("classes"),
    fileUrl: v.string(),
    name: v.string(),
    size: v.number(),
  })
    .index("by_class_user", ["classId", "createdBy"])
    .index("by_user", ["createdBy"]),

  lessonPdfs: defineTable({
    lessonId: v.id("lessons"),
    pdfId: v.id("pdfs"),
    classId: v.id("classes"),
    order: v.optional(v.number()),
  })
    .index("by_lessonId", ["lessonId"])
    .index("by_pdfId", ["pdfId"])
    .index("by_classId", ["classId"]),

  tests: defineTable({
    createdBy: v.string(),
    classId: v.id("classes"),
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
  })
    .index("by_user", ["createdBy"])
    .index("by_class", ["classId"]),

  testReviews: defineTable({
    createdBy: v.string(),
    classId: v.id("classes"),
    title: v.string(),
    description: v.optional(v.string()),
    testId: v.id("tests"),
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
  })
    .index("by_user", ["createdBy"])
    .index("by_class", ["classId"]),
});
