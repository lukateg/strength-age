import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { AuthenticationRequired } from "./utils";

export const incrementTokensUsed = mutation({
  args: { tokens: v.number() },
  handler: async (ctx, { tokens }) => {
    const userId = await AuthenticationRequired({ ctx });

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`; // YYYY-MM format

    // Fetch current month's usage record efficiently using composite index
    const monthlyRecord = await ctx.db
      .query("userTokenUsage")
      .withIndex("by_user_month", (q) =>
        q.eq("userId", userId).eq("month", month)
      )
      .unique();

    if (monthlyRecord) {
      // Increment existing record for the month
      await ctx.db.patch(monthlyRecord._id, {
        monthlyTokensUsed: monthlyRecord.monthlyTokensUsed + tokens,
      });
    } else {
      // Create new month record
      await ctx.db.insert("userTokenUsage", {
        userId,
        monthlyTokensUsed: tokens,
        month,
      });
    }
  },
});
