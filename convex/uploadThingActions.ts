"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

import { UTApi } from "uploadthing/server";
import { createAppError } from "./utils/utils";

const utapi = new UTApi();

export const deleteFileFromUploadThing = internalAction({
  args: {
    pdf: v.object({
      fileUrl: v.string(),
      name: v.string(),
      size: v.number(),
      _creationTime: v.number(),
      _id: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const fileKey = args.pdf.fileUrl.split("/").pop();
    if (!fileKey) {
      throw createAppError({
        message: "File key not found",
      });
    }
    try {
      await utapi.deleteFiles(fileKey);

      return { success: true };
    } catch (error) {
      console.error("Error deleting file from UploadThing:", error);
      throw createAppError({
        message: "Error deleting file from UploadThing",
      });
    }
  },
});
