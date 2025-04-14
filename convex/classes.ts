import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllClasses = query({
  // args: { userId: v.string() },
  handler: async ({ db }) => {
    return await db
      .query("classes")
      // .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getClassById = query({
  args: { id: v.id("classes") },
  handler: async ({ db }, { id }) => {
    return await db.get(id);
  },
});
export const createClass = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async ({ db }, { title, description }) => {
    await db.insert("classes", {
      title,
      description,
    });
  },
});
