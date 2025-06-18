import { AuthenticationRequired, createAppError } from "./utils";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { hasPermission } from "./models/permissionsModel";

export const canUploadMaterialsQuery = query({
  args: {
    newFilesSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await AuthenticationRequired({ ctx });
    const canUpload = await hasPermission(
      ctx,
      identity,
      "materials",
      "create",
      {
        newFilesSize: args.newFilesSize ?? 0,
      }
    );

    if (!canUpload) {
      throw createAppError({
        message:
          "You don't have enough storage to upload materials, please upgrade subscription.",
        statusCode: "PERMISSION_DENIED",
      });
    }

    return canUpload;
  },
});
