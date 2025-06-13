import { v } from "convex/values";
import { query } from "../_generated/server";
import { AuthenticationRequired } from "../utils";
import { hasPermission } from "../permissions";
import { type DataModel, type Doc } from "../_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";

interface ClassWithPermissions extends Doc<"classes"> {
  canDeleteClass: boolean;
  canUpdateClass: boolean;
  canGenerateTest: boolean;
}

interface DashboardData {
  classes: ClassWithPermissions[];
  materials: Doc<"pdfs">[];
  tests: Doc<"tests">[];
  testReviews: Doc<"testReviews">[];
  permissions: {
    canCreateClass: boolean;
  };
}

async function getClasses(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"classes">[]> {
  return await ctx.db
    .query("classes")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
}

// Helper function to get classes with permissions
async function getClassesWithPermissions(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<ClassWithPermissions[]> {
  const classes = await getClasses(ctx, userId);

  return await Promise.all(
    classes.map(async (classItem) => {
      const [canDeleteClass, canUpdateClass, canGenerateTest] =
        await Promise.all([
          hasPermission<"classes">(ctx, userId, "classes", "delete", classItem),
          hasPermission<"classes">(ctx, userId, "classes", "update", classItem),
          hasPermission<"tests">(ctx, userId, "tests", "create"),
        ]);

      return {
        ...classItem,
        canDeleteClass,
        canUpdateClass,
        canGenerateTest,
      };
    })
  );
}

// Helper function to get materials
async function getMaterials(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"pdfs">[]> {
  return await ctx.db
    .query("pdfs")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
}

// Helper function to get tests
async function getTests(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"tests">[]> {
  return await ctx.db
    .query("tests")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
}

// Helper function to get test reviews
async function getTestReviews(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<Doc<"testReviews">[]> {
  return await ctx.db
    .query("testReviews")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();
}

export const getDashboardData = query({
  handler: async (ctx): Promise<DashboardData> => {
    const userId = await AuthenticationRequired({ ctx });

    const canCreateClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "create"
    );

    // Fetch all data in parallel using helper functions
    const [classes, materials, tests, testReviews] = await Promise.all([
      getClassesWithPermissions(ctx, userId),
      getMaterials(ctx, userId),
      getTests(ctx, userId),
      getTestReviews(ctx, userId),
    ]);

    return {
      classes,
      materials,
      tests,
      testReviews,
      permissions: {
        canCreateClass,
      },
    };
  },
});
