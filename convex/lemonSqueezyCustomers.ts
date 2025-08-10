import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const createLSQCustomerInternalMutation = internalMutation({
  args: {
    userId: v.id("users"),
    customerId: v.number(),
    data: v.object({
      status: v.string(),
      subscriptionId: v.optional(v.string()),
      variantId: v.optional(v.number()),
      currentPeriodStart: v.optional(v.string()),
      currentPeriodEnd: v.optional(v.string()),
      cancelAtPeriodEnd: v.optional(v.boolean()),
      paymentMethod: v.optional(
        v.object({
          brand: v.optional(v.string()),
          last4: v.optional(v.string()),
        })
      ),
    }),
  },
  handler: async (ctx, { userId, customerId, data }) => {
    return await ctx.db.insert("lemonSqueezyCustomers", {
      userId,
      customerId,
      ...data,
    });
  },
});

export const updateLSCustomerInternalMutation = internalMutation({
  args: {
    customerId: v.id("lemonSqueezyCustomers"),
    data: v.object({
      status: v.string(),
      subscriptionId: v.optional(v.string()),
      variantId: v.optional(v.number()),
      currentPeriodStart: v.optional(v.string()),
      currentPeriodEnd: v.optional(v.string()),
      cancelAtPeriodEnd: v.optional(v.boolean()),
      paymentMethod: v.optional(
        v.object({
          brand: v.optional(v.string()),
          last4: v.optional(v.string()),
        })
      ),
    }),
  },
  handler: async (ctx, { customerId, data }) => {
    return await ctx.db.patch(customerId, data);
  },
});

export const getLSCustomerByCustomerIdInternalQuery = internalQuery({
  args: { customerId: v.number() },
  handler: async (ctx, { customerId }) => {
    return await ctx.db
      .query("lemonSqueezyCustomers")
      .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
      .first();
  },
});

export const getLSCustomerByUserIdInternalQuery = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("lemonSqueezyCustomers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});
