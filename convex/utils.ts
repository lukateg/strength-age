import {
  type ActionCtx,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

import { ConvexError } from "convex/values";

/** Checks if the current user is authenticated. Throws if not */
export async function isAuthenticated({
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
