import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { getUserByClerkId } from "./models/userModel";

export const getUserByUserIdInternalQuery = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const getUserByClerkIdInternalQuery = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return getUserByClerkId(ctx, clerkId);
  },
});

export const getCurrentUserByClerkIdQuery = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null;
    }
    return await getUserByClerkId(ctx, identity.subject);
  },
});

export const updateUser = internalMutation({
  args: {
    userId: v.id("users"),
    data: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      email: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { userId, data }) => {
    await ctx.db.patch(userId, data);
  },
});
