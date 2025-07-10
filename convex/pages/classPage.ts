import { query } from "convex/_generated/server";
import { hasPermission } from "convex/models/permissionsModel";
import { AuthenticationRequired } from "convex/utils";

import { createAppError } from "convex/utils";
import { v } from "convex/values";

import { getLessonsByClass } from "../models/lessonsModel";
import {
  getMaterialsByClass,
  getTotalStorageUsage,
} from "../models/materialsModel";
import { getTestsByClass } from "../models/testsModel";
import { getTestReviewsByClass } from "../models/testReviewsModel";

// TODO: Restructure return to look like {permissions:{}, data:{materials:{materials, canUploadMaterials, totalSize}, lessons, tests, testReviews}}
export const getClassPageData = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("classes", id);

    if (!normalizedId) {
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const class_ = await ctx.db.get(normalizedId);

    if (!class_) {
      throw createAppError({
        message: "Class not found",
        statusCode: "NOT_FOUND",
      });
    }

    const lessons = await getLessonsByClass(ctx, normalizedId);
    const materials = await getMaterialsByClass(ctx, normalizedId);
    const tests = await getTestsByClass(ctx, normalizedId);
    const testReviews = await getTestReviewsByClass(ctx, normalizedId);
    const totalStorageUsage = await getTotalStorageUsage(ctx, userId);

    // --- New Calculations ---
    const classStorageUsage = materials.reduce(
      (total, material) => total + (material.size || 0),
      0
    );

    const classSuccessRate =
      testReviews.length > 0
        ? (testReviews.reduce((acc, review) => {
            const rate =
              review.questions.length > 0
                ? review.questions.filter((q) => q.isCorrect).length /
                  review.questions.length
                : 0;
            return acc + rate;
          }, 0) /
            testReviews.length) *
          100
        : 0;

    const canViewClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "view",
      class_
    );
    if (!canViewClass) {
      throw createAppError({
        message: "You are not authorized to view this class",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const canEditClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "update",
      class_
    );

    const canDeleteClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "delete",
      class_
    );

    const canCreateLesson = await hasPermission(
      ctx,
      userId,
      "lessons",
      "create",
      {
        class: class_,
      }
    );

    // TODO: write this better
    const canUploadMaterials = await hasPermission(
      ctx,
      userId,
      "materials",
      "create",
      {
        newFilesSize: 0,
      }
    );

    const canCreateTest = await hasPermission(ctx, userId, "tests", "create");

    return {
      class_,
      lessons,
      materials,
      tests,
      testReviews,
      totalStorageUsage,
      classStorageUsage,
      classSuccessRate,
      permissions: {
        canEditClass,
        canDeleteClass,
        canViewClass,
        canCreateLesson,
        canUploadMaterials,
        canCreateTest,
      },
    };
  },
});
