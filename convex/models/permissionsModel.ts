import { type DataModel } from "../_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";
import { createAppError } from "../utils";
import {
  type ResourceActionParams,
  type Permissions,
  ROLES,
} from "../schemas/abacSchema";

export async function hasPermission<Resource extends keyof Permissions>(
  ctx: GenericQueryCtx<DataModel>,
  userId: string,
  resource: Resource,
  action: keyof ResourceActionParams[Resource],
  data?: ResourceActionParams[Resource][typeof action]
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
    .first();

  if (!user) {
    throw createAppError({ message: "User not found!" });
  }

  const roles = user.roles;

  const results = await Promise.all(
    roles.map(async (role) => {
      const permission = ROLES[role][resource]?.[action];
      if (permission == null) return false;

      if (typeof permission === "boolean") return permission;

      return permission(data!, user, ctx);
    })
  );

  return results.some(Boolean);
}
