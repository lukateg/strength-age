import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { ConvexError } from "convex/values";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  materialUploader: f({
    pdf: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 10,
    },
    text: {
      maxFileSize: "16MB",
      maxFileCount: 10,
    },
  })
    .input(
      z.object({
        userId: z.string(),
      })
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input, files }) => {
      // This code runs on your server before upload
      // const token = await getConvexToken();

      // const canUpload = await fetchQuery(
      //   api.permissions.checkPermission,
      //   { token }
      // );

      // if (!canUpload) {
      //   throw new ConvexError({
      //     message:
      //       "You cannot upload materials.",
      //   });
      // }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        userId: input.userId,
        // token,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // await fetchMutation(
        //   api.materials.addFileToDatabase,
        //   { token: metadata.token }
        // );
      } catch (error) {
        console.error("Error adding file", error);
        throw new ConvexError({ message: "Error when adding file." });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
