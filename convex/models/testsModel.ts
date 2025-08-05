import { type Doc, type DataModel, type Id } from "convex/_generated/dataModel";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type TestWithPermissions } from "convex/pages/testsPage";

import { hasPermission } from "convex/models/permissionsModel";
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

export const getTestsWithSameTitleByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  title: string,
  userId: string
) => {
  const tests = await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.eq(q.field("title"), title))
    .collect();

  return tests;
};

export const getTestsWithTitlePattern = async (
  ctx: GenericQueryCtx<DataModel>,
  baseTitle: string,
  userId: string
) => {
  // Get all tests for the user and filter in JavaScript
  const allTests = await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();

  // Filter tests that match the base title pattern
  return allTests.filter((test) => {
    // Exact match
    if (test.title === baseTitle) return true;

    // Pattern match: baseTitle + " #" + number
    const pattern = new RegExp(
      `^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} #\\d+$`
    );
    return pattern.test(test.title);
  });
};

export const optionalIncrementTitle = async (
  ctx: GenericQueryCtx<DataModel>,
  title: string,
  userId: string
) => {
  // Get all tests that match the base title pattern
  const existingTests = await getTestsWithTitlePattern(ctx, title, userId);

  // Check if the exact title exists
  const exactTitleExists = existingTests.some((test) => test.title === title);

  if (exactTitleExists || existingTests.length > 0) {
    // Extract numbers from titles that match the pattern "title #number"
    const numbers = existingTests
      .map((test) => {
        const match = new RegExp(
          `^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} #(\\d+)$`
        ).exec(test.title);
        return match?.[1] ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => num > 0); // Only consider numbered variants

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `${title} #${maxNumber + 1}`;
  }

  return title;
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
