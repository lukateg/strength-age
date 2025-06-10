import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import {
  mutation,
  query,
  action,
  type ActionCtx,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

import { ConvexError } from "convex/values";
import { hasPermission } from "../src/shared/abac";

import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type DataModel } from "./_generated/dataModel";
import { type Permissions } from "../src/shared/abac";

/** Custom query that requires authentication */
export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    await AuthenticationRequired({ ctx });
    return {};
  })
);

/** Custom mutation that requires authentication */
export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    await AuthenticationRequired({ ctx });
    return {};
  })
);

/** Custom action that requires authentication */
export const authAction = customAction(
  action,
  customCtx(async (ctx) => {
    await AuthenticationRequired({ ctx });
    return {};
  })
);

/** Checks if the current user is authenticated. Throws if not */
export async function AuthenticationRequired({
  ctx,
}: {
  ctx: QueryCtx | MutationCtx | ActionCtx;
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw createAppError({ message: "Not authenticated!" });
  }
  return identity.subject;
}

// Create a custom error function that ensures data always has a message
export function createAppError(data: { message: string }) {
  return new ConvexError(data);
}

// Type guard to check and extract properly typed error data
export function isAppError(
  error: unknown
): error is ConvexError<{ message: string }> {
  return (
    error instanceof ConvexError &&
    typeof (error.data as { message: string }).message === "string"
  );
}

export async function checkResourceOwnership<T extends { createdBy: string }>(
  ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
  resource: T | null,
  resourceName: string
) {
  const userId = await AuthenticationRequired({ ctx });

  if (!resource) {
    throw createAppError({
      message: `${resourceName} not found`,
    });
  }

  if (resource.createdBy !== userId) {
    throw createAppError({
      message: `Not authorized to access this ${resourceName}`,
    });
  }

  return userId;
}

/** Helper to check permissions in backend functions */
export async function checkPermission<Resource extends keyof Permissions>(
  ctx: QueryCtx | MutationCtx,
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

  if (!hasPermission(user, resource, action, data)) {
    throw createAppError({ message: "Permission denied!" });
  }

  return user;
}
