import { type ActionCtx, internalMutation, query } from "./_generated/server";
import { type UserJSON } from "@clerk/backend";
import { v, type Validator } from "convex/values";
import { internalQuery } from "./_generated/server";
import { isAuthenticated } from "./utils";
import { userByClerkId } from "./models/userModel";
import { internal } from "./_generated/api";
import { type Id } from "./_generated/dataModel";

// TODO: Move this to clerk.ts
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAttributes = {
      firstName: data.first_name ?? "",
      lastName: data.last_name ?? "",
      email: data.email_addresses[0]?.email_address ?? "",
      clerkId: data.id,
      roles: ["user"] as ("admin" | "user")[],
    };

    const user = await userByClerkId(ctx, data.id);
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

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export const getUserData = query({
  handler: async (ctx) => {
    const userId = await isAuthenticated({ ctx });

    const user = await userByClerkId(ctx, userId);

    return { ...user };
  },
});

export const getUserByClerkId = async ({
  ctx,
  clerkId,
}: {
  ctx: ActionCtx;
  clerkId: string;
}) => {
  return await ctx.runQuery(internal.users.getUserByClerkIdInternalQuery, {
    clerkId,
  });
};

export const getUserByUserId = async ({
  ctx,
  userId,
}: {
  ctx: ActionCtx;
  userId: Id<"users">;
}) => {
  return await ctx.runQuery(internal.users.getUserByUserIdInternalQuery, {
    userId,
  });
};

export const getUserByUserIdInternalQuery = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const getUserByClerkIdInternalQuery = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return userByClerkId(ctx, clerkId);
  },
});

export const getCurrentUserQuery = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null;
    }
    return await userByClerkId(ctx, identity.subject);
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
