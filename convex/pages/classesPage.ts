import { query } from "../_generated/server";
import { AuthenticationRequired } from "../utils";
import { hasPermission } from "../models/permissionsModel";
import { getClassesByUser } from "../models/classesModel";
import { getTestsByClass } from "../models/testsModel";
import { getMaterialsByClass } from "../models/materialsModel";

export const getClassesPageData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const canCreateClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "create"
    );

    const classes = await getClassesByUser(ctx, userId);

    const classesWithPermissions = await Promise.all(
      classes.map(async (classItem) => {
        const [
          canDeleteClass,
          canUpdateClass,
          canGenerateTest,
          tests,
          materials,
        ] = await Promise.all([
          hasPermission(ctx, userId, "classes", "delete", classItem),
          hasPermission(ctx, userId, "classes", "update", classItem),
          hasPermission(ctx, userId, "tests", "create"),
          getTestsByClass(ctx, classItem._id),
          getMaterialsByClass(ctx, classItem._id),
        ]);

        return {
          ...classItem,
          canDeleteClass,
          canUpdateClass,
          canGenerateTest,
          testCount: tests.length || 0,
          materialCount: materials.length || 0,
        };
      })
    );

    return { classesWithPermissions, permissions: { canCreateClass } };
  },
});
