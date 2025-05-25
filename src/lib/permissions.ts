import { Doc, Id } from "../../convex/_generated/dataModel";

type SubscriptionTier = "free" | "paid";

type User = {
  _id: string;
  name: string;
  clerkId: string;
  subscriptionTier: SubscriptionTier;
};

type TestReview = Doc<"testReviews">;
type Test = Doc<"tests">;
type Class = Doc<"classes">;

type Resource = "testReviews" | "tests" | "classes";
type Action = "view" | "create" | "update" | "delete" | "share";

type DataType = TestReview | Test | Class;

type PermissionCheck<T extends DataType> =
  | boolean
  | ((user: User, data: T) => boolean);

type Permissions = {
  testReviews: {
    dataType: TestReview;
    action: Action;
  };
  tests: {
    dataType: Test;
    action: Action;
  };
  classes: {
    dataType: Class;
    action: Action;
  };
};

// Define more precise types for subscription permissions
type SubscriptionPermissions = Record<
  SubscriptionTier,
  {
    testReviews: Record<Action, PermissionCheck<TestReview>>;
    tests: Record<Action, PermissionCheck<Test>>;
    classes: Record<Action, PermissionCheck<Class>>;
  }
>;

const SUBSCRIPTION_PERMISSIONS: SubscriptionPermissions = {
  free: {
    testReviews: {
      view: (user: User, review: TestReview) => review.createdBy === user._id,
      create: true,
      update: (user: User, review: TestReview) => review.createdBy === user._id,
      delete: (user: User, review: TestReview) => review.createdBy === user._id,
      share: false,
    },
    tests: {
      view: (user: User, test: Test) => test.createdBy === user._id,
      create: true,
      update: (user: User, test: Test) => test.createdBy === user._id,
      delete: (user: User, test: Test) => test.createdBy === user._id,
      share: false,
    },
    classes: {
      view: (user: User, class_: Class) => class_.createdBy === user._id,
      create: true,
      update: (user: User, class_: Class) => class_.createdBy === user._id,
      delete: (user: User, class_: Class) => class_.createdBy === user._id,
      share: false,
    },
  },
  paid: {
    testReviews: {
      view: true,
      create: true,
      update: (user: User, review: TestReview) => review.createdBy === user._id,
      delete: (user: User, review: TestReview) => review.createdBy === user._id,
      share: true,
    },
    tests: {
      view: true,
      create: true,
      update: (user: User, test: Test) => test.createdBy === user._id,
      delete: (user: User, test: Test) => test.createdBy === user._id,
      share: true,
    },
    classes: {
      view: true,
      create: true,
      update: (user: User, class_: Class) => class_.createdBy === user._id,
      delete: (user: User, class_: Class) => class_.createdBy === user._id,
      share: true,
    },
  },
};

export function hasPermission<R extends keyof Permissions>(
  user: User,
  resource: R,
  action: Permissions[R]["action"],
  data?: Permissions[R]["dataType"]
): boolean {
  const tier = user.subscriptionTier ?? "free";
  const permission = SUBSCRIPTION_PERMISSIONS[tier][resource]?.[action];

  if (permission === undefined) return false;

  if (typeof permission === "boolean") return permission;

  if (data) {
    switch (resource) {
      case "testReviews":
        return (permission as (user: User, data: TestReview) => boolean)(
          user,
          data as TestReview
        );
      case "tests":
        return (permission as (user: User, data: Test) => boolean)(
          user,
          data as Test
        );
      case "classes":
        return (permission as (user: User, data: Class) => boolean)(
          user,
          data as Class
        );
      default:
        return false;
    }
  }

  return false;
}

// Helper function to generate a shareable link
export function generateShareLink(reviewId: string): string {
  return `${typeof window !== "undefined" ? window.location.origin : ""}/app/tests/review/${reviewId}`;
}
