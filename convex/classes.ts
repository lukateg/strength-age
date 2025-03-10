import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createClass = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async ({ db }, { title, description }) => {
    await db.insert("classes", {
      title,
      description,
    });
  },
});
