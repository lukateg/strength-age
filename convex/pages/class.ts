import { query } from "convex/_generated/server";
import { hasPermission } from "convex/permissions";
import { AuthenticationRequired } from "convex/utils";

import { createAppError } from "convex/utils";
import { v } from "convex/values";
import { type GenericQueryCtx } from "convex/server";
import { type DataModel } from "convex/_generated/dataModel";
import { type Id } from "convex/_generated/dataModel";
import { getTotalStorageUsage } from "convex/materials";

// TODO: Restructure return to look like {permissions:{}, data:{materials:{materials, canUploadMaterials, totalSize}, lessons, tests, testReviews}}
export const getClassPageData = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedId = ctx.db.normalizeId("classes", id);

    if (!normalizedId) {
      throw createAppError({ message: "Invalid item ID" });
    }

    const class_ = await ctx.db.get(normalizedId);

    if (!class_) {
      throw createAppError({ message: "Class not found" });
    }

    const lessons = await getLessonsByClass(ctx, normalizedId);
    const materials = await getMaterialsByClass(ctx, normalizedId);
    const tests = await getTestsByClass(ctx, normalizedId);
    const testReviews = await getTestReviewsByClass(ctx, normalizedId);
    const totalStorageUsage = await getTotalStorageUsage(ctx, userId);

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

    const canUploadMaterials = await hasPermission(
      ctx,
      userId,
      "materials",
      "create"
    );

    const canCreateTest = await hasPermission(ctx, userId, "tests", "create");

    return {
      class_,
      lessons,
      materials,
      tests,
      testReviews,
      totalStorageUsage,
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

export const getLessonsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_class", (q) => q.eq("classId", classId))
    .collect();

  return lessons;
};

export const getMaterialsByClass = async (
  ctx: GenericQueryCtx<DataModel>,
  classId: Id<"classes">
) => {
  const materials = await ctx.db
    .query("pdfs")
    .withIndex("by_class_user", (q) => q.eq("classId", classId))
    .collect();

  return materials;
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
