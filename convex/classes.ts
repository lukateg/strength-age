import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthenticationRequired } from "./utils/utils";

export const getAllClassesByUserId = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    return await ctx.db
      .query("classes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getClassById = query({
  args: { id: v.id("classes") },
  handler: async (ctx, { id }) => {
    await AuthenticationRequired({ ctx });

    return await ctx.db.get(id);
  },
});
export const createClass = mutation({
  args: { title: v.string(), description: v.string(), userId: v.string() },
  handler: async (ctx, { title, description, userId }) => {
    await AuthenticationRequired({ ctx });

    return await ctx.db.insert("classes", {
      title,
      description,
      userId,
    });
  },
});
