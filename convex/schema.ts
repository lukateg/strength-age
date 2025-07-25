import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    subscriptionTier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("pro")
    ),
    roles: v.array(v.union(v.literal("admin"), v.literal("user"))),
    userPreferences: v.optional(
      v.object({
        shouldTestReviewLinksExpire: v.optional(v.boolean()),
      })
    ),
  }).index("by_clerkId", ["clerkId"]),

  stripeCustomers: defineTable({
    userId: v.string(),
    stripeCustomerId: v.string(),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    status: v.optional(v.string()),
    priceId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    paymentMethod: v.optional(
      v.object({
        brand: v.optional(v.string()),
        last4: v.optional(v.string()),
      })
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  lemonSqueezyCustomers: defineTable({
    userId: v.string(),
    clerkId: v.string(),
    customerId: v.number(),
    variantId: v.optional(v.number()),
    subscriptionId: v.optional(v.string()),
    subscriptionTier: v.optional(
      v.union(v.literal("free"), v.literal("starter"), v.literal("pro"))
    ),
    status: v.optional(v.string()),
    currentPeriodStart: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    paymentMethod: v.optional(
      v.object({
        brand: v.optional(v.string()),
        last4: v.optional(v.string()),
      })
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_customerId", ["customerId"]),

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
    .index("by_user", ["createdBy"])
    .index("by_lesson_name", ["title"]),

  materials: defineTable({
    createdBy: v.string(),
    classId: v.id("classes"),
    fileUrl: v.string(),
    name: v.string(),
    size: v.number(),
    fileType: v.union(v.literal("pdf"), v.literal("txt")),
  })
    .index("by_class_user", ["classId", "createdBy"])
    .index("by_user", ["createdBy"]),

  lessonMaterials: defineTable({
    lessonId: v.id("lessons"),
    materialId: v.id("materials"),
    classId: v.id("classes"),
    order: v.optional(v.number()),
  })
    .index("by_lessonId", ["lessonId"])
    .index("by_materialId", ["materialId"])
    .index("by_classId", ["classId"]),

  tests: defineTable({
    createdBy: v.string(),
    classId: v.id("classes"),
    title: v.string(),
    description: v.optional(v.string()),
    difficulty: v.number(),
    questionTypes: v.array(
      v.union(
        v.literal("multiple_choice"),
        v.literal("true_false"),
        v.literal("short_answer")
      )
    ),
    questionAmount: v.number(),
    lessons: v.array(
      v.object({
        lessonId: v.id("lessons"),
        lessonTitle: v.string(),
      })
    ),
    additionalInstructions: v.optional(v.string()),
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
    .index("by_class", ["classId"])
    .index("by_test", ["testId"])
    .index("by_title_and_user", ["title", "createdBy"]),

  testReviewShares: defineTable({
    testReviewId: v.id("testReviews"),
    createdBy: v.string(),
    shareToken: v.string(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_shareToken", ["shareToken"])
    .index("by_testReview", ["testReviewId"])
    .index("expiresAt", ["expiresAt"]),

  feedbacks: defineTable({
    createdBy: v.string(),
    type: v.union(
      v.literal("bug"),
      v.literal("feature"),
      v.literal("complaint"),
      v.literal("compliment"),
      v.literal("general")
    ),
    rating: v.number(),
    title: v.string(),
    description: v.string(),
    email: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["createdBy"])
    .index("by_type", ["type"])
    .index("by_created_at", ["createdAt"]),

  userTokenUsage: defineTable({
    userId: v.string(),
    monthlyTokensUsed: v.number(),
    month: v.string(), // Format "YYYY-MM"
  })
    .index("by_user", ["userId"])
    .index("by_user_month", ["userId", "month"]),
});
