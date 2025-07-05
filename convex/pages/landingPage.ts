import { query } from "../_generated/server";

export const getLandingPageData = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db.query("tests").collect();
    const userFeedback = 55;
    const activeUsers = await ctx.db.query("users").collect();

    return {
      testsGenerated: tests.length,
      userFeedback,
      activeUsers: activeUsers.length,
    };
  },
});
