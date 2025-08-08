import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    roles: v.array(v.union(v.literal("admin"), v.literal("user"))),
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
});
