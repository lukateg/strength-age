import { LIMITATIONS } from "@/lib/limitations";

import { type DataModel } from "../_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";
import { type Doc } from "../_generated/dataModel";

// Types
export type Role = "admin" | "user";

// Base types for different resources
export type LessonDataType = {
  lesson: Doc<"lessons">;
  class: Doc<"classes">;
};

// Define parameter types for each action
export type LessonActionParams = {
  view: { lesson: Doc<"lessons"> };
  create: { class: Doc<"classes"> };
  update: { lesson: Doc<"lessons">; class?: Doc<"classes"> };
  delete: { lesson: Doc<"lessons">; class?: Doc<"classes"> };
};

export type ClassActionParams = {
  view: Doc<"classes">;
  create: void;
  update: Doc<"classes">;
  delete: Doc<"classes">;
};

export type TestActionParams = {
  view: Doc<"tests"> | null;
  create: void;
  delete: Doc<"tests">;
  share: void;
};

export type MaterialActionParams = {
  view: Doc<"pdfs">;
  create: {
    newFilesSize: number;
  };
  delete: Doc<"pdfs">;
};

export type TestReviewActionParams = {
  view: { testReview: Doc<"testReviews">; shareToken?: string };
  delete: { testReview: Doc<"testReviews"> };
  share: void;
  retake: { testReview: Doc<"testReviews"> };
};

// Map resource types to their action parameters
export type ResourceActionParams = {
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

export type PermissionCheck<
  Resource extends keyof Permissions,
  Action extends keyof ResourceActionParams[Resource],
> =
  | boolean
  | ((
      data: ResourceActionParams[Resource][Action],
      user: Doc<"users">,
      ctx?: GenericQueryCtx<DataModel>
    ) => boolean | Promise<boolean>);

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type RolesWithPermissions = {
  [R in Role]: {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    [K in keyof Permissions]?: {
      [A in keyof ResourceActionParams[K]]?: PermissionCheck<K, A>;
    };
  };
};

export const ROLES: RolesWithPermissions = {
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
      view: (data, user) => {
        return data.createdBy === user.clerkId;
      },
      create: async (data, user, ctx) => {
        const existingClasses = await ctx!.db
          .query("classes")
          .withIndex("by_user", (q) => q.eq("createdBy", user.clerkId))
          .collect();

        return (
          LIMITATIONS[user.subscriptionTier].classes > existingClasses.length
        );
      },
      update: (data, user) => {
        return data.createdBy === user.clerkId;
      },
      delete: (data, user) => {
        return data.createdBy === user.clerkId;
      },
    },
    lessons: {
      view: (data, user) => {
        return data.lesson.createdBy === user.clerkId;
      },
      create: async (data, user, ctx) => {
        const existingLessons = await ctx!.db
          .query("lessons")
          .withIndex("by_class", (q) => q.eq("classId", data.class._id))
          .collect();

        return (
          LIMITATIONS[user.subscriptionTier].lessons > existingLessons.length
        );
      },
      update: (data, user) => {
        return data.lesson.createdBy === user.clerkId;
      },
      delete: (data, user) => {
        return data.lesson.createdBy === user.clerkId;
      },
    },
    materials: {
      view: (data, user) => {
        return data.createdBy === user.clerkId;
      },
      create: async (data, user, ctx) => {
        const uploadedFiles = await ctx!.db
          .query("pdfs")
          .withIndex("by_user", (q) => q.eq("createdBy", user.clerkId))
          .collect();
        const totalSize =
          uploadedFiles.reduce((acc, file) => acc + file.size, 0) +
          data.newFilesSize;

        return LIMITATIONS[user.subscriptionTier].materials > totalSize;
      },
      delete: (data, user) => {
        return data.createdBy === user.clerkId;
      },
    },
    tests: {
      view: (data, user) => {
        return data?.createdBy === user.clerkId;
      },
      create: async (data, user, ctx) => {
        const existingTests = await ctx!.db
          .query("tests")
          .withIndex("by_user", (q) => q.eq("createdBy", user.clerkId))
          .collect();

        return LIMITATIONS[user.subscriptionTier].tests > existingTests.length;
      },
      delete: (data, user) => {
        return data?.createdBy === user.clerkId;
      },
      share: (data, user) => {
        return LIMITATIONS[user.subscriptionTier].testShare;
      },
    },
    testReviews: {
      view: async (data, user, ctx) => {
        if (data.shareToken) {
          const shareToken = data.shareToken;
          const share = await ctx!.db
            .query("testReviewShares")
            .withIndex("by_shareToken", (q) => q.eq("shareToken", shareToken))
            .first();

          return Boolean(
            share && (!share.expiresAt || share.expiresAt > Date.now())
          );
        }
        return data.testReview.createdBy === user.clerkId;
      },
      delete: (data, user) => {
        return data.testReview.createdBy === user.clerkId;
      },
      share: () => {
        return true;
      },
    },
  },
} as const satisfies RolesWithPermissions;
