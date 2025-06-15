import { query } from "../_generated/server";
import { AuthenticationRequired } from "../utils";
import { hasPermission } from "../permissions";
import { getClassesByUser } from "../models/classesModel";

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
        const canDeleteClass = await hasPermission(
          ctx,
          userId,
          "classes",
          "delete",
          classItem
        );
        const canUpdateClass = await hasPermission(
          ctx,
          userId,
          "classes",
          "update",
          classItem
        );
        const canGenerateTest = await hasPermission(
          ctx,
          userId,
          "tests",
          "create"
        );
        return {
          ...classItem,
          canDeleteClass,
          canUpdateClass,
          canGenerateTest,
        };
      })
    );

    return { classesWithPermissions, canCreateClass };
  },
});
