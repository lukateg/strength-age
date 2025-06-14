import { type DataModel, type Id } from "convex/_generated/dataModel";
import { hasPermission } from "../permissions";
import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type ClassWithPermissions } from "convex/pages/dashboard";
import { internal } from "../_generated/api";

export const getClassById = async (
  ctx: GenericQueryCtx<DataModel>,
  id: Id<"classes">
) => {
  const class_ = await ctx.db.get(id);
  return class_;
};

export const getClassesByUser = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
) => {
  const classes = await ctx.db
    .query("classes")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .collect();

  return classes;
};

// Helper function to get classes with permissions
export const getClassesWithPermissions = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
): Promise<ClassWithPermissions[]> => {
  const classes = await getClassesByUser(ctx, userId);

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
};

export const findClassByTitle = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string,
  title: string
) => {
  const existingClass = await ctx.db
    .query("classes")
    .withIndex("by_user", (q) => q.eq("createdBy", userId))
    .filter((q) => q.eq(q.field("title"), title))
    .first();

  return existingClass !== null;
};

export const createClass = async (
  ctx: GenericMutationCtx<DataModel>,
  userId: string,
  title: string,
  description: string
) => {
  return await ctx.db.insert("classes", {
    title,
    description,
    createdBy: userId,
  });
};

export const updateClass = async (
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  title: string,
  description: string
) => {
  return await ctx.db.patch(classId, { title, description });
};

export const deleteClass = async (
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">
) => {
  return await ctx.db.delete(classId);
};

export const runDeleteClassDataBatch = async (
  ctx: GenericMutationCtx<DataModel>,
  classId: Id<"classes">,
  userId: string
) => {
  await ctx.scheduler.runAfter(
    0,
    internal.classes.deleteClassDataInternalMutation,
    {
      classId,
      userId,
      phase: "lessonPdfs",
      cursor: undefined,
    }
  );
};
