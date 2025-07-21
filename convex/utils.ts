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
    throw createAppError({
      message: "Not authenticated!",
      statusCode: "AUTHENTICATION_ERROR",
    });
  }
  return identity.subject;
}

// Create a custom error function that ensures data always has a message
export function createAppError(data: {
  message: string;
  statusCode:
    | "PERMISSION_DENIED"
    | "NOT_FOUND"
    | "VALIDATION_ERROR"
    | "SERVER_ERROR"
    | "AUTHENTICATION_ERROR";
}) {
  return new ConvexError(data);
}

// Type guard to check and extract properly typed error data
export function isAppError(error: unknown): error is ConvexError<{
  message: string;
  statusCode?:
    | "PERMISSION_DENIED"
    | "NOT_FOUND"
    | "VALIDATION_ERROR"
    | "SERVER_ERROR"
    | "AUTHENTICATION_ERROR";
}> {
  return (
    error instanceof ConvexError &&
    typeof (error.data as { message: string }).message === "string"
  );
}

// TODO: check if this is used
// export async function checkResourceOwnership<T extends { createdBy: string }>(
//   ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
//   resource: T | null,
//   resourceName: string
// ) {
//   const userId = await AuthenticationRequired({ ctx });

//   if (!resource) {
//     throw createAppError({
//       message: `${resourceName} not found`,
//       statusCode: "NOT_FOUND",
//     });
//   }

//   if (resource.createdBy !== userId) {
//     throw createAppError({
//       message: `Not authorized to access this ${resourceName}`,
//       statusCode: "PERMISSION_DENIED",
//     });
//   }

//   return userId;
// }
