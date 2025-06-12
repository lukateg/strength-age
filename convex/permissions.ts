import { type DataModel } from "./_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";
import { AuthenticationRequired, createAppError } from "./utils";
import { type Doc } from "./_generated/dataModel";

// TODO:
// rename this file to abac.ts
// move the validator functions into the permissions.ts file

// Types
export type Role = "admin" | "user";

export type Permissions = {
  classes: {
    dataType: Doc<"classes">;
    action: "view" | "create" | "update" | "delete";
  };
  lessons: {
    dataType: Doc<"lessons">;
    action: "view" | "create" | "update" | "delete";
  };
  // TODO: remove the dataType optional
  tests: {
    dataType?: Doc<"tests">;
    action: "view" | "create" | "delete" | "share";
  };
  materials: {
    dataType: Doc<"pdfs">;
    action: "view" | "create" | "delete";
  };
  testReviews: {
    dataType: {
      testReview: Doc<"testReviews">;
      shareToken?: string;
    };
    action: "view" | "delete" | "share" | "retake";
  };
};

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((
      ctx: GenericQueryCtx<DataModel>,
      data: Permissions[Key]["dataType"]
    ) => Promise<boolean>);

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type RolesWithPermissions = {
  [R in Role]: {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    [K in keyof Permissions]?: {
      [A in Permissions[K]["action"]]?: PermissionCheck<K>;
    };
  };
};

// Constants
export const LIMITATIONS = {
  free: {
    classes: 1,
    lessons: 3,
    tests: 3,
    materials: 10485760, // 10 MB in bytes (10 * 1024 * 1024)
    testShare: false,
    resultsShare: true,
  },
  starter: {
    classes: 3,
    lessons: 10,
    tests: 10,
    materials: 262144000, // 250 MB in bytes (250 * 1024 * 1024)
    testShare: true,
    resultsShare: true,
  },
  pro: {
    classes: 100,
    lessons: 100,
    tests: 100,
    materials: 524288000, // 500 MB in bytes (500 * 1024 * 1024)
    testShare: true,
    resultsShare: true,
  },
} as const;

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
        // console.log(user.subscriptionTier, "user.subscriptionTier");
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
        data: Permissions["lessons"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
      },
      create: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["lessons"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .first();
        if (!user) return false;

        const existingLessons = await ctx.db
          .query("lessons")
          .withIndex("by_class", (q) => q.eq("classId", data.classId))
          .collect();

        return (
          LIMITATIONS[user.subscriptionTier].lessons > existingLessons.length
        );
      },
      update: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["lessons"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
      },
      delete: async (
        ctx: GenericQueryCtx<DataModel>,
        data: Permissions["lessons"]["dataType"]
      ) => {
        const userId = await AuthenticationRequired({ ctx });
        return data.createdBy === userId;
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
      create: async (ctx: GenericQueryCtx<DataModel>) => {
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

        const totalSize = uploadedFiles.reduce(
          (acc, file) => acc + file.size,
          0
        );
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
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
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

      return await permission(ctx, data);
    })
  );

  return results.some(Boolean);
}
