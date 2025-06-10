import { v } from "convex/values";
import { query } from "./_generated/server";
import { LIMITATIONS } from "../src/shared/abac";
import { AuthenticationRequired, createAppError } from "./utils";

export const canCreateClass = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) {
      throw createAppError({ message: "User not found!" });
    }
    const existingClasses = await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .collect();

    return LIMITATIONS[user.subscriptionTier].classes > existingClasses.length;
  },
});
