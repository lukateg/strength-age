"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteFileFromUploadThing = internalAction({
  args: { fileKey: v.string() },
  handler: async (ctx, args) => {
    try {
      await utapi.deleteFiles(args.fileKey);

      return { success: true };
    } catch (error) {
      console.error("Error deleting file from UploadThing:", error);
      throw error;
    }
  },
});
