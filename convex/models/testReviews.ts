import { type Doc, type DataModel } from "convex/_generated/dataModel";
import { type Id } from "convex/_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";

export const getTestReviewsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  const testReviews = await ctx.db
    .query("testReviews")
    .withIndex("by_class", (q) => q.eq("classId", classId))
    .collect();

  return testReviews;
};

// Helper function to get test reviews
export const getTestReviewsByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"testReviews">[]> => {
  return await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
};
