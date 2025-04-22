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
} from "convex/_generated/server";

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
    throw new ConvexError("Not authenticated!");
  }
  return identity.subject;
}
