import { type Doc } from "../../convex/_generated/dataModel";

// Types
export type Role = "admin" | "user";

// TODO
// Consider rewriting a permissions to be the convex query functions that collect data and perform checks and return boolean
// then use those functions only on backend for performant results and on the ui only use them when specific elements need to be displayed conditionally

// also that way consider bundling with my main data queries so I have all data in one place and can use it for both

export type Permissions = {
  classes: {
    dataType: { class?: Doc<"classes">; existingClassesLength?: number };
    action: "view" | "create" | "update" | "delete";
  };
  lessons: {
    dataType: {
      lesson?: Doc<"lessons">;
      existingLessonsLength?: number;
      class?: Doc<"classes">;
    };
    action: "view" | "create" | "update" | "delete";
  };
  tests: {
    dataType: {
      test?: Doc<"tests">;
      existingTestsLength?: number;
      class?: Doc<"classes">;
    };
    action: "view" | "create" | "delete" | "share";
  };
  materials: {
    dataType: {
      pdf?: Doc<"pdfs">;
      uploadedFilesSize?: number;
    };
    action: "view" | "create" | "delete";
  };
  testReviews: {
    dataType: {
      testReview?: Doc<"testReviews">;
      existingTestResultsLength?: number;
      hasValidShareToken?: boolean;
    };
    action: "view" | "delete" | "share" | "retake";
  };
};

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: Doc<"users">, data: Permissions[Key]["dataType"]) => boolean);

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type RolesWithPermissions = {
  [R in Role]: Partial<{
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

// Constants
export const LIMITATIONS = {
  free: {
    classes: 1,
    lessons: 3,
    tests: 3,
    materials: 10485760, // 10 MB in bytes (10 * 1024 * 1024)
    // materials: 52428800, // 50 MB in bytes (50 * 1024 * 1024)
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

const ROLES = {
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
      view: (user, { class: class_ }) => class_?.createdBy === user.clerkId,
      create: (user, { existingClassesLength }) => {
        return (
          LIMITATIONS[user.subscriptionTier].classes >
          (existingClassesLength ?? 0)
        );
      },
      update: (user, { class: class_ }) => class_?.createdBy === user.clerkId,
      delete: (user, { class: class_ }) => class_?.createdBy === user.clerkId,
    },
    lessons: {
      view: (user, { lesson }) => lesson?.createdBy === user.clerkId,
      create: (user, { existingLessonsLength, class: class_ }) =>
        LIMITATIONS[user.subscriptionTier].lessons >
          (existingLessonsLength ?? 0) && class_?.createdBy === user.clerkId,
      update: (user, { lesson }) => lesson?.createdBy === user.clerkId,
      delete: (user, { lesson }) => lesson?.createdBy === user.clerkId,
    },
    materials: {
      view: (user, { pdf }) => pdf?.createdBy === user.clerkId,
      create: (user, { uploadedFilesSize }) =>
        LIMITATIONS[user.subscriptionTier].materials > (uploadedFilesSize ?? 0),
      delete: (user, { pdf }) => pdf?.createdBy === user.clerkId,
    },
    tests: {
      view: (user, { test }) => test?.createdBy === user.clerkId,
      create: (user, { existingTestsLength }) =>
        LIMITATIONS[user.subscriptionTier].tests > (existingTestsLength ?? 0),
      delete: (user, { test }) => test?.createdBy === user.clerkId,
      share: (user) => LIMITATIONS[user.subscriptionTier].testShare,
    },
    testReviews: {
      view: (user, { testReview, hasValidShareToken }) =>
        testReview?.createdBy === user.clerkId || !!hasValidShareToken,
      delete: (user, { testReview }) => testReview?.createdBy === user.clerkId,
      share: (user) => LIMITATIONS[user.subscriptionTier].resultsShare,
      retake: (user, { testReview }) => testReview?.createdBy === user.clerkId,
    },
  },
} as const satisfies RolesWithPermissions;

// Core permission check function
export function hasPermission<Resource extends keyof Permissions>(
  user: Doc<"users">,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}
