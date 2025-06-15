import { runDeleteClassDataBatch } from "./classesModel";
import { hasPermission } from "convex/permissions";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type Doc, type Id, type DataModel } from "convex/_generated/dataModel";
import { type TestReviewWithPermissions } from "convex/pages/testsPage";

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

export const getTestReviewsByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"testReviews">[]> => {
  return await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
};

export const getTestReviewsByTitle = async (
  ctx: GenericQueryCtx<DataModel>,
  title: string
) => {
  const testReview = await ctx.db
    .query("testReviews")
    .filter((q) => q.eq(q.field("title"), title))
    .collect();
  return testReview;
};

export async function getTestReviewsWithPermissions(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<TestReviewWithPermissions[]> {
  const testReviews = await getTestReviewsByUser(ctx, userId);

  return await Promise.all(
    testReviews.map(async (review) => {
      const [canDelete, canShare, canRetake] = await Promise.all([
        hasPermission<"testReviews">(ctx, userId, "testReviews", "delete", {
          testReview: review,
        }),
        hasPermission<"testReviews">(ctx, userId, "testReviews", "share", {
          testReview: review,
        }),
        hasPermission<"testReviews">(ctx, userId, "testReviews", "retake", {
          testReview: review,
        }),
      ]);

      return {
        ...review,
        canDelete,
        canShare,
        canRetake,
      };
    })
  );
}

export async function deleteTestReviewsByClassIdBatch(
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string,
  cursor?: string
) {
  const BATCH_SIZE = 100;
  const { page, isDone, continueCursor } = await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.eq(q.field("classId"), classId))
    .paginate({ numItems: BATCH_SIZE, cursor: cursor ?? null });

  for (const review of page) {
    await ctx.db.delete(review._id);
  }

  if (!isDone) {
    await runDeleteClassDataBatch(
      ctx,
      classId,
      "testReviews",
      userId,
      continueCursor
    );
  }
}

// Helper function to validate share token
export async function validateTestReviewShareToken(
  ctx: GenericQueryCtx<DataModel>,
  shareToken?: string
) {
  if (!shareToken) {
    return false;
  }

  const share = await ctx.db
    .query("testReviewShares")
    .withIndex("by_shareToken", (q) => q.eq("shareToken", shareToken))
    .first();

  return share && (!share.expiresAt || share.expiresAt > Date.now());
}
