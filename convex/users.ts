import { internalMutation, query } from "./_generated/server";
import { internalQuery } from "./_generated/server";
import { getUserByClerkId } from "./models/userModel";
import { v, type Validator } from "convex/values";
import { type UserJSON } from "@clerk/backend";

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

export const upsertUserByClerkIdInternalMutation = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAttributes = {
      firstName: data.first_name ?? "",
      lastName: data.last_name ?? "",
      email: data.email_addresses[0]?.email_address ?? "",
      clerkId: data.id,
      roles: ["user"] as ("admin" | "user")[],
    };

    const user = await getUserByClerkId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, {
        firstName: userAttributes.firstName,
        lastName: userAttributes.lastName,
        clerkId: userAttributes.clerkId,
        roles: userAttributes.roles,
        email: userAttributes.email,
      });
    }
  },
});

export const deleteUserByClerkIdInternalMutation = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await getUserByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});
