import { query } from "../_generated/server";
import { AuthenticationRequired, createAppError } from "convex/utils";
import { getClassesByUser } from "../models/classesModel";
import { hasPermission } from "convex/permissions";
import { getLessonsByUser } from "../models/lessonsModel";

export const getGenerateTestPageData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const classes = await getClassesByUser(ctx, userId);
    const lessons = await getLessonsByUser(ctx, userId);

    const canGenerateTest = await hasPermission(ctx, userId, "tests", "create");

    if (!canGenerateTest) {
      throw createAppError({
        message: "You are not authorized to generate a test",
      });
    }

    return { classes, lessons };
  },
});
