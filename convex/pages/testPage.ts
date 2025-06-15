import { v } from "convex/values";
import { query } from "../_generated/server";
import { AuthenticationRequired, createAppError } from "convex/utils";
import { getClassById } from "convex/models/classesModel";
import { getTestById, getTestReviewsByTestId } from "convex/models/testsModel";

export const getTestPageData = query({
  args: {
    testId: v.string(),
  },
  handler: async (ctx, { testId }) => {
    const userId = await AuthenticationRequired({ ctx });
    const normalizedId = ctx.db.normalizeId("tests", testId);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const test = await getTestById(ctx, normalizedId);

    if (!test) {
      throw createAppError({ message: "Test not found" });
    }

    const testReviews = await getTestReviewsByTestId(ctx, normalizedId);
    const class_ = await getClassById(ctx, test.classId);

    return { ...test, testReviews, class: class_ };
  },
});
