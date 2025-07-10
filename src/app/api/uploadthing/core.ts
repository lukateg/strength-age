import { api } from "../../../../convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { ConvexError } from "convex/values";
import { getConvexToken } from "@/lib/server-utils";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const pdfFileRouter = {
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
        classId: z.string(),
        lessonId: z.optional(z.string()),
      })
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input, files }) => {
      // This code runs on your server before upload
      const token = await getConvexToken();

      const canUpload = await fetchQuery(
        api.permissions.canUploadMaterialsQuery,
        {
          newFilesSize: files.reduce((acc, file) => acc + file.size, 0),
        },
        { token }
      );

      if (!canUpload) {
        throw new ConvexError({
          message:
            "You don't have enough storage to upload materials, please upgrade subscription.",
        });
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        lessonId: input.lessonId,
        classId: input.classId,
        token,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const materialId = await fetchMutation(
          api.materials.addMaterialMutation,
          {
            classId: metadata.classId,
            material: {
              fileUrl: file.ufsUrl,
              name: file.name,
              size: file.size,
            },
          },
          { token: metadata.token }
        );

        if (metadata.lessonId) {
          await fetchMutation(
            api.lessons.addMaterialToLessonMutation,
            {
              lessonId: metadata.lessonId,
              materialId,
              classId: metadata.classId,
            },
            { token: metadata.token }
          );
        }
      } catch (error) {
        console.error("Error adding material", error);
        throw new ConvexError({ message: "Error when adding material." });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof pdfFileRouter;
