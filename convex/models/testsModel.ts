import { type Doc, type DataModel, type Id } from "convex/_generated/dataModel";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type TestWithPermissions } from "convex/pages/testsPage";

import { hasPermission } from "convex/permissions";
import { runDeleteClassDataBatch } from "./classesModel";

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

export const getTestsByTitle = async (
  ctx: GenericQueryCtx<DataModel>,
  title: string
) => {
  const test = await ctx.db
    .query("tests")
    .filter((q) => q.eq(q.field("title"), title))
    .collect();

  return test;
};

export async function getTestsWithPermissions(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<TestWithPermissions[]> {
  const tests = await getTestsByUser(ctx, userId);

  return await Promise.all(
    tests.map(async (test) => {
      const [canDelete, canShare] = await Promise.all([
        hasPermission<"tests">(ctx, userId, "tests", "delete", test),
        hasPermission<"tests">(ctx, userId, "tests", "share", test),
      ]);

      return {
        ...test,
        canDelete,
        canShare,
      };
    })
  );
}

export async function deleteTestsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.eq(q.field("classId"), classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const test of page) {
    await ctx.db.delete(test._id);
  }

  if (!isDone) {
    await runDeleteClassDataBatch(
      ctx,
      classId,
      "tests",
      userId,
      continueCursor
    );
  } else {
    await runDeleteClassDataBatch(
      ctx,
      classId,
      "testReviews",
      userId,
      undefined
    );
  }
}
