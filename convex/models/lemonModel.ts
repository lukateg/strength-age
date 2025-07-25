import { type QueryCtx } from "../_generated/server";

export async function getCustomerByUserId(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("lemonSqueezyCustomers")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
    .first();
}
