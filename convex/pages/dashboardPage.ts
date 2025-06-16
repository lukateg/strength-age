import { query } from "../_generated/server";
import { AuthenticationRequired } from "../utils";
import { hasPermission } from "../models/permissionsModel";
import { getClassesWithPermissions } from "../models/classesModel";
import { getPdfsByUser } from "../models/materialsModel";
import { getTestsByUser } from "../models/testsModel";
import { getTestReviewsByUser } from "../models/testReviewsModel";

import { type Doc } from "../_generated/dataModel";
export interface ClassWithPermissions extends Doc<"classes"> {
  canDeleteClass: boolean;
  canUpdateClass: boolean;
  canGenerateTest: boolean;
}

export interface DashboardData {
  classes: ClassWithPermissions[];
  materials: Doc<"pdfs">[];
  tests: Doc<"tests">[];
  testReviews: Doc<"testReviews">[];
  permissions: {
    canCreateClass: boolean;
  };
}

export const getDashboardPageData = query({
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
      getPdfsByUser(ctx, userId),
      getTestsByUser(ctx, userId),
      getTestReviewsByUser(ctx, userId),
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
