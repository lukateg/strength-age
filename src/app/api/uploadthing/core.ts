import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { type Id } from "convex/_generated/dataModel";
import { ConvexError } from "convex/values";
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
      maxFileSize: "8MB",
      maxFileCount: 100,
    },
  })
    .input(
      z.object({
        classId: z.custom<Id<"classes">>(),
        lessonId: z.optional(z.custom<Id<"lessons">>()),
      })
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const user = await currentUser();
      if (!user) throw new ConvexError({ message: "Unauthorized" });

      const { getToken } = await auth();
      const token = await getToken({ template: "convex" });
      if (!token)
        throw new ConvexError({ message: "No Convex token available" });

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
              pdfId: pdfId,
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
