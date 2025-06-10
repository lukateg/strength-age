import { auth } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { ConvexError } from "convex/values";
import { hasPermission } from "@/shared/abac";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const pdfFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({
    pdf: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
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
      const { getToken } = await auth();

      // This code runs on your server before upload
      const token = await getToken({ template: "convex" });
      if (!token)
        throw new ConvexError({ message: "No Convex token available" });

      const user = await fetchQuery(
        api.users.getCurrentUserQuery,
        {},
        { token }
      );
      const uploadedFilesSize = await fetchQuery(
        api.materials.getTotalSizeOfPdfsByUser,
        {},
        { token }
      );

      if (!user) throw new ConvexError({ message: "Unauthorized" });

      const pdfsToUploadTotalSize = files.reduce(
        (acc, file) => acc + file.size,
        0
      );

      const canUpload = hasPermission(user, "materials", "create", {
        uploadedFilesSize: (uploadedFilesSize ?? 0) + pdfsToUploadTotalSize,
      });

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
        const pdfId = await fetchMutation(
          api.materials.addPdf,
          {
            classId: metadata.classId,
            pdf: { fileUrl: file.ufsUrl, name: file.name, size: file.size },
          },
          { token: metadata.token }
        );

        if (metadata.lessonId) {
          await fetchMutation(
            api.lessons.addPdfToLesson,
            {
              lessonId: metadata.lessonId,
              pdfId,
              classId: metadata.classId,
            },
            { token: metadata.token }
          );
        }
      } catch (error) {
        console.error("Error adding PDF", error);
        throw new ConvexError({ message: "Error when adding PDF." });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof pdfFileRouter;
