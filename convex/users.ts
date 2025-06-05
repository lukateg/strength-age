import { internalMutation, type QueryCtx } from "./_generated/server";
import { type UserJSON } from "@clerk/backend";
import { v, type Validator } from "convex/values";
import { internalQuery } from "./_generated/server";

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      clerkId: data.id,
      subscriptionTier: "free" as "free" | "starter" | "pro",
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      // For new users, insert with free tier
      await ctx.db.insert("users", userAttributes);
    } else {
      // For existing users, only update name and clerkId, preserve their subscription tier
      await ctx.db.patch(user._id, {
        name: userAttributes.name,
        clerkId: userAttributes.clerkId,
        subscriptionTier: userAttributes.subscriptionTier,
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

async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

export const getUserByClerkId = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

export const updateUser = internalMutation({
  args: {
    userId: v.id("users"),
    data: v.object({
      subscriptionTier: v.optional(
        v.union(v.literal("free"), v.literal("starter"), v.literal("pro"))
      ),
    }),
  },
  handler: async (ctx, { userId, data }) => {
    await ctx.db.patch(userId, data);
  },
});
