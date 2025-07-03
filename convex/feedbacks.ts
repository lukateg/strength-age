import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFeedback = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const feedbackId = await ctx.db.insert("feedbacks", {
      createdBy: user._id,
      type: args.type,
      rating: args.rating,
      title: args.title,
      description: args.description,
      email: args.email,
      createdAt: Date.now(),
    });

    return feedbackId;
  },
});

export const getFeedbacksByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db
      .query("feedbacks")
      .withIndex("by_user", (q) => q.eq("createdBy", user._id))
      .order("desc")
      .collect();
  },
});

// Admin query to get all feedbacks (you can add role checking later)
export const getAllFeedbacks = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // You can add admin role checking here
    // For now, returning all feedbacks
    return await ctx.db
      .query("feedbacks")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});
