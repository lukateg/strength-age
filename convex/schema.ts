import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
  }).index("by_clerkId", ["clerkId"]),

  classes: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(), // Changed to proper ID reference
  }).index("by_user", ["userId"]),

  lessons: defineTable({
    userId: v.string(), // Changed to proper ID reference
    classId: v.id("classes"), // Changed to proper ID reference
    title: v.string(),
    description: v.optional(v.string()),
  }).index("by_class", ["classId"]),

  pdfs: defineTable({
    userId: v.string(), // Changed to proper ID reference
    classId: v.id("classes"), // Changed to proper ID reference
    fileUrl: v.string(),
    name: v.string(),
    size: v.number(),
  }).index("by_class_user", ["classId", "userId"]),

  // New join table for the many-to-many relationship between lessons and pdfs
  lessonPdfs: defineTable({
    lessonId: v.id("lessons"),
    pdfId: v.id("pdfs"),
    // You could add additional fields if needed
    order: v.optional(v.number()), // Optional: for ordering pdfs within a lesson
  })
    .index("by_lessonId", ["lessonId"])
    .index("by_pdfId", ["pdfId"]),

  tests: defineTable({
    userId: v.string(), // Changed to proper ID reference
    classId: v.id("classes"), // Changed to proper ID reference
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
  }).index("by_user", ["userId"]),

  testReviews: defineTable({
    userId: v.string(), // Changed to proper ID reference
    classId: v.id("classes"), // Changed to proper ID reference
    title: v.string(),
    description: v.optional(v.string()),
    testId: v.id("tests"), // Changed to proper ID reference
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
  }).index("by_user", ["userId"]),
});
