import { type QueryCtx } from "convex/_generated/server";

export async function stripeCustomerByUserId(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("stripeCustomers")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}
