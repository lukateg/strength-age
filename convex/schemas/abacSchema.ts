import { LIMITATIONS } from "@/lib/limitations";

import { type DataModel } from "../_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";
import { type Doc } from "../_generated/dataModel";
import { userByClerkId } from "convex/models/userModel";
import { getSubscriptionTierByStripeRecord } from "@/lib/utils";
import { stripeCustomerByUserId } from "convex/models/stripeModel";
import { getMonthlyUsageRecord } from "convex/models/tokensModel";
import { getPdfsByUser } from "convex/models/materialsModel";
import { getLessonsByClass } from "convex/models/lessonsModel";
import { getClassesByUser } from "convex/models/classesModel";
import { validateTestReviewShareToken } from "convex/models/testReviewsModel";

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

export type StripeCustomerActionParams = {
  view: Doc<"stripeCustomers">;
};

// Map resource types to their action parameters
export type ResourceActionParams = {
  lessons: LessonActionParams;
  classes: ClassActionParams;
  tests: TestActionParams;
  materials: MaterialActionParams;
  testReviews: TestReviewActionParams;
  stripeCustomers: StripeCustomerActionParams;
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
  stripeCustomers: {
    dataType: Doc<"stripeCustomers">;
    action: keyof StripeCustomerActionParams;
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
    stripeCustomers: {
      view: true,
    },
  },
  user: {
    classes: {
      view: (data, user) => {
        return data.createdBy === user.clerkId;
      },
      create: async (data, user, ctx) => {
        const existingClasses = await getClassesByUser(ctx!, user.clerkId);

        const userSubscriptionRecord = await stripeCustomerByUserId(
          ctx!,
          user.clerkId
        );

        const subscriptionTier = getSubscriptionTierByStripeRecord(
          userSubscriptionRecord
        );

        return LIMITATIONS[subscriptionTier].classes > existingClasses.length;
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
        const existingLessons = await getLessonsByClass(ctx!, data.class._id);
        const userSubscriptionRecord = await stripeCustomerByUserId(
          ctx!,
          user.clerkId
        );

        const subscriptionTier = getSubscriptionTierByStripeRecord(
          userSubscriptionRecord
        );
        return LIMITATIONS[subscriptionTier].lessons > existingLessons.length;
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
        const userSubscriptionRecord = await stripeCustomerByUserId(
          ctx!,
          user.clerkId
        );

        const subscriptionTier = getSubscriptionTierByStripeRecord(
          userSubscriptionRecord
        );
        const uploadedFiles = await getPdfsByUser(ctx!, user.clerkId);
        const totalSize =
          uploadedFiles.reduce((acc, file) => acc + file.size, 0) +
          data.newFilesSize;

        return LIMITATIONS[subscriptionTier].materials > totalSize;
      },
      delete: (data, user) => {
        return data.createdBy === user.clerkId;
      },
    },
    tests: {
      view: (data, user) => {
        return data?.createdBy === user.clerkId;
      },
      create: async (_data, user, ctx) => {
        const userSubscriptionRecord = await stripeCustomerByUserId(
          ctx!,
          user.clerkId
        );

        const subscriptionTier = getSubscriptionTierByStripeRecord(
          userSubscriptionRecord
        );

        const usageRecord = await getMonthlyUsageRecord(ctx!, user.clerkId);

        const tokensUsedThisMonth = usageRecord?.monthlyTokensUsed ?? 0;

        return tokensUsedThisMonth < LIMITATIONS[subscriptionTier].tokens;
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
          const shareToken = await validateTestReviewShareToken(
            ctx!,
            data.shareToken
          );
          return Boolean(shareToken);
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
    stripeCustomers: {
      view: (data, user) => {
        return data.userId === user.clerkId;
      },
    },
  },
} as const satisfies RolesWithPermissions;
