import { type Doc } from "../_generated/dataModel";

// Types
export type Role = "admin" | "user";

export type Permissions = {
  classes: {
    dataType: { class?: Doc<"classes">; existingClassesLength?: number };
    action: "view" | "create" | "update" | "delete";
  };
  lessons: {
    dataType: { lesson: Doc<"lessons">; existingLessonsLength?: number };
    action: "view" | "create" | "update" | "delete";
  };
  tests: {
    dataType: { test: Doc<"tests">; existingTestsLength?: number };
    action: "view" | "create" | "delete" | "share";
  };
  materials: {
    dataType: { pdf: Doc<"pdfs">; existingMaterialsLength?: number };
    action: "view" | "create" | "delete";
  };
  testReviews: {
    dataType: {
      testResult: Doc<"testReviews">;
      existingTestResultsLength?: number;
    };
    action: "view" | "delete";
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
    materials: 50, // 50 MB
    testShare: false,
    resultsShare: true,
  },
  starter: {
    classes: 3,
    lessons: 10,
    tests: 10,
    materials: 250, // 250 MB
    testShare: true,
    resultsShare: true,
  },
  pro: {
    classes: 100,
    lessons: 100,
    tests: 100,
    materials: 500, // 500 MB
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
      view: (user, { lesson }) => lesson.createdBy === user.clerkId,
      create: (user, { existingLessonsLength }) =>
        LIMITATIONS[user.subscriptionTier].lessons >
        (existingLessonsLength ?? 0) + 1,
      update: (user, { lesson }) => lesson.createdBy === user.clerkId,
      delete: (user, { lesson }) => lesson.createdBy === user.clerkId,
    },
    materials: {
      view: (user, { pdf }) => pdf.createdBy === user.clerkId,
      create: (user, { existingMaterialsLength }) =>
        LIMITATIONS[user.subscriptionTier].materials >
        (existingMaterialsLength ?? 0) + 1,
      delete: (user, { pdf }) => pdf.createdBy === user.clerkId,
    },
    tests: {
      view: (user, { test }) => test.createdBy === user.clerkId,
      create: (user, { existingTestsLength }) =>
        LIMITATIONS[user.subscriptionTier].tests >
        (existingTestsLength ?? 0) + 1,
      delete: (user, { test }) => test.createdBy === user.clerkId,
      share: (user) => LIMITATIONS[user.subscriptionTier].testShare,
    },
    testReviews: {
      view: (user, { testResult }) => testResult.createdBy === user.clerkId,
      delete: (user, { testResult }) => testResult.createdBy === user.clerkId,
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
