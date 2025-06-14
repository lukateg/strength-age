import { type Doc, type DataModel, type Id } from "convex/_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";

// Helper function to get tests
export const getTestsByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"tests">[]> => {
  return await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
};

export const getTestById = async (
  ctx: GenericQueryCtx<DataModel>,
  id: Id<"tests">
) => {
  const test = await ctx.db.get(id);
  return test;
};

export const getTestReviewsByTestId = async (
  ctx: GenericQueryCtx<DataModel>,
  testId: Id<"tests">
) => {
  return await ctx.db
    .query("testReviews")
    .withIndex("by_test", (q) => q.eq("testId", testId))
    .collect();
};

export const getTestsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  const tests = await ctx.db
    .query("tests")
    .withIndex("by_class", (q) => q.eq("classId", classId))
    .collect();

  return tests;
};
