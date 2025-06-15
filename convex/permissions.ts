import { AuthenticationRequired, createAppError } from "./utils";
import { LIMITATIONS } from "@/shared/constants";

import { type DataModel } from "./_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";
import { type Doc } from "./_generated/dataModel";
import { v } from "convex/values";
import { query } from "./_generated/server";

// TODO:
// rename this file to abac.ts
// move the validator functions into the permissions.ts file
// probaj ipak da napravis da permission schema radi sinhrono jer izgleda sve te podatke vec fecujes u query funkcijama

// ostavi refaktor baze za drugi put
// resi permisije za sve i onda refaktoruj

// SECURED
//  classes, can create class, class card, class dropdown - everything there secured
//  class page, materials, tests, test reviews - everything there secured

// Types
export type Role = "admin" | "user";

// Base types for different resources
type LessonDataType = {
  lesson: Doc<"lessons">;
  class: Doc<"classes">;
};

type ClassOnlyType = Pick<LessonDataType, "class">;

// Define parameter types for each action
type LessonActionParams = {
  view: { class: Doc<"classes"> };
  create: { class: Doc<"classes"> };
  update: { lesson: Doc<"lessons">; class?: Doc<"classes"> };
  delete: { lesson: Doc<"lessons">; class?: Doc<"classes"> };
};

type ClassActionParams = {
  view: Doc<"classes">;
  create: void;
  update: Doc<"classes">;
  delete: Doc<"classes">;
};

type TestActionParams = {
  view: Doc<"tests">;
  create: void;
  delete: Doc<"tests">;
  share: void;
};

type MaterialActionParams = {
  view: Doc<"pdfs">;
  create: {
    newFilesSize: number;
  };
  delete: Doc<"pdfs">;
};

type TestReviewActionParams = {
  view: { testReview: Doc<"testReviews">; shareToken?: string };
  delete: { testReview: Doc<"testReviews"> };
  share: void;
  retake: { testReview: Doc<"testReviews"> };
};

// Map resource types to their action parameters
type ResourceActionParams = {
  lessons: LessonActionParams;
  classes: ClassActionParams;
  tests: TestActionParams;
  materials: MaterialActionParams;
  testReviews: TestReviewActionParams;
};

export type Permissions = {
  classes: {
    dataType: Doc<"classes">;
    action: keyof ClassActionParams;
  };
  lessons: {
    dataType: LessonDataType;
    action: keyof LessonActionParams;
  };
  tests: {
    dataType?: Doc<"tests">;
    action: keyof TestActionParams;
  };
  materials: {
    dataType: Doc<"pdfs">;
    action: keyof MaterialActionParams;
  };
  testReviews: {
    dataType: {
      testReview: Doc<"testReviews">;
      shareToken?: string;
    };
    action: keyof TestReviewActionParams;
  };
};

type PermissionCheck<
  Resource extends keyof Permissions,
  Action extends keyof ResourceActionParams[Resource],
> =
  | boolean
  | ((
      ctx: GenericQueryCtx<DataModel>,
      data: ResourceActionParams[Resource][Action]
    ) => Promise<boolean>);

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type RolesWithPermissions = {
  [R in Role]: {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    [K in keyof Permissions]?: {
      [A in keyof ResourceActionParams[K]]?: PermissionCheck<K, A>;
    };
  };
};

const ROLES: RolesWithPermissions = {
  admin: {
    classes: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    lessons: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    tests: {
      view: true,
      create: true,
      delete: true,
      share: true,
    },
    materials: {
      view: true,
      create: true,
      delete: true,
    },
    testReviews: {
      view: true,
      delete: true,
      share: true,
      retake: true,
    },
  },
  user: {
    classes: {
      view: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["classes"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
      },
      create: async (ctx: GenericQueryCtx<DataModel>) => {
        const userId = await AuthenticationRequired({ ctx });
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .first();
        if (!user) return false;
        const existingClasses = await ctx.db
          .query("classes")
          .withIndex("by_user", (q) => q.eq("createdBy", userId))
          .collect();

        return (
          LIMITATIONS[user.subscriptionTier].classes > existingClasses.length
        );
      },
      update: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["classes"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
      },
      delete: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["classes"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
      },
    },
    lessons: {
      view: async (
        ctx: GenericQueryCtx<DataModel>,
        data: LessonActionParams["view"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.class.createdBy === userId;
      },
      create: async (
        ctx: GenericQueryCtx<DataModel>,
        data: LessonActionParams["create"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .first();
        if (!user) return false;

        const existingLessons = await ctx.db
          .query("lessons")
          .withIndex("by_class", (q) => q.eq("classId", data.class._id))
          .collect();

        return (
          LIMITATIONS[user.subscriptionTier].lessons > existingLessons.length
        );
      },
      update: async (
        ctx: GenericQueryCtx<DataModel>,
        data: LessonActionParams["update"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.lesson.createdBy === userId;
      },
      delete: async (
        ctx: GenericQueryCtx<DataModel>,
        data: LessonActionParams["delete"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.lesson.createdBy === userId;
      },
    },
    materials: {
      view: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["materials"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
      },
      create: async (
        ctx: GenericQueryCtx<DataModel>,
        data: MaterialActionParams["create"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .first();
        if (!user) return false;

        const uploadedFiles = await ctx.db
          .query("pdfs")
          .withIndex("by_user", (q) => q.eq("createdBy", userId))
          .collect();
        const totalSize =
          uploadedFiles.reduce((acc, file) => acc + file.size, 0) +
          data.newFilesSize;

        return LIMITATIONS[user.subscriptionTier].materials > totalSize;
      },
      delete: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["materials"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
      },
    },
    tests: {
      view: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["tests"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data?.createdBy === userId;
      },
      create: async (ctx: GenericQueryCtx<DataModel>) => {
        const userId = await AuthenticationRequired({ ctx });
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .first();

        if (!user) return false;

        const existingTests = await ctx.db
          .query("tests")
          .withIndex("by_user", (q) => q.eq("createdBy", userId))
          .collect();

        return LIMITATIONS[user.subscriptionTier].tests > existingTests.length;
      },
      delete: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["tests"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data?.createdBy === userId;
      },
      share: async (ctx: GenericQueryCtx<DataModel>) => {
        const userId = await AuthenticationRequired({ ctx });
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .first();
        if (!user) return false;

        return LIMITATIONS[user.subscriptionTier].testShare;
      },
    },
    testReviews: {
      view: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["testReviews"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        if (data.shareToken && typeof data.shareToken === "string") {
          const shareToken: string = data.shareToken;
          const share = await ctx.db
            .query("testReviewShares")
            .withIndex("by_shareToken", (q) => q.eq("shareToken", shareToken))
            .first();

          return Boolean(
            share && (!share.expiresAt || share.expiresAt > Date.now())
          );
        }
        return data.testReview.createdBy === userId;
      },
      delete: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["testReviews"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.testReview.createdBy === userId;
      },
      share: async (ctx: GenericQueryCtx<DataModel>) => {
        const userId = await AuthenticationRequired({ ctx });
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .first();
        if (!user) return false;

        return LIMITATIONS[user.subscriptionTier].resultsShare;
      },
      retake: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["testReviews"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.testReview.createdBy === userId;
      },
    },
  },
} as const satisfies RolesWithPermissions;

// Core permission check function
export async function hasPermission<Resource extends keyof Permissions>(
  ctx: GenericQueryCtx<DataModel>,
  userId: string,
  resource: Resource,
  action: keyof ResourceActionParams[Resource],
  data?: ResourceActionParams[Resource][typeof action]
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
    .first();

  if (!user) {
    throw createAppError({ message: "User not found!" });
  }
  const results = await Promise.all(
    user.roles.map(async (role) => {
      const permission = ROLES[role][resource]?.[action];
      if (permission == null) return false;

      if (typeof permission === "boolean") return permission;

      return await permission(ctx, data!);
    })
  );

  return results.some(Boolean);
}

export const hasPermissionQuery = query({
  args: {
    resource: v.union(
      v.literal("classes"),
      v.literal("lessons"),
      v.literal("tests"),
      v.literal("materials"),
      v.literal("testReviews")
    ),
    action: v.union(
      v.literal("view"),
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("share"),
      v.literal("retake")
    ),
  },
  handler: async (ctx, { resource, action }) => {
    const userId = await AuthenticationRequired({ ctx });
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) {
      throw createAppError({ message: "User not found!" });
    }
    return await hasPermission(
      ctx,
      userId,
      resource,
      action as keyof ResourceActionParams[typeof resource]
    );
  },
});
