import { AuthenticationRequired, createAppError } from "./utils";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { hasPermission } from "./models/permissionsModel";

export const canUploadMaterialsQuery = query({
  args: {
    newFilesSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await AuthenticationRequired({ ctx });
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity))
      .first();

    if (!user) {
      throw createAppError({ message: "User not found!" });
    }

    return hasPermission(ctx, user._id, "materials", "create", {
      newFilesSize: args.newFilesSize ?? 0,
    });
  },
});

export const canCreateTestQuery = query({
  handler: async (ctx) => {
    const identity = await AuthenticationRequired({ ctx });
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity))
      .first();

    if (!user) {
      throw createAppError({ message: "User not found!" });
    }

    return hasPermission(ctx, user._id, "tests", "create");
  },
});
