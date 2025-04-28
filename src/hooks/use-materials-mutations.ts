import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useClass } from "@/providers/class-context-provider";
import { toast } from "@/hooks/use-toast";
import { type ClientUploadedFileData } from "uploadthing/types";
import { type Id } from "../../convex/_generated/dataModel";
interface UploadPDFParams {
  userId: string;
  classId: Id<"classes">;
  pdfFiles: {
    fileUrl: string;
    name: string;
    size: number;
  }[];
}

export const useMaterialsMutations = () => {
  const { userId, classId } = useClass();

  // Mutations
  const uploadPDFMutation = useMutation(api.materials.uploadPdf);

  const uploadPDF = useCallback(
    async (params: {
      lessonId: string;
      pdfFiles: ClientUploadedFileData<{
        uploadedBy: string;
      }>[];
    }) => {
      try {
        if (!userId) {
          toast({
            title: "Error",
            description: "You must be logged in to upload materials.",
            variant: "destructive",
          });
          return;
        }
        const pdfFiles = params.pdfFiles.map((pdf) => ({
          fileUrl: pdf.ufsUrl,
          name: pdf.name,
          size: pdf.size,
        }));

        const uploadParams: UploadPDFParams = {
          userId,
          classId,
          pdfFiles,
        };

        await uploadPDFMutation(uploadParams);

        toast({
          title: "Success",
          description: "Materials uploaded successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to upload materials:", error);
        toast({
          title: "Error",
          description: "Failed to upload materials. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [userId, classId, uploadPDFMutation]
  );

  return {
    uploadPDF,
    classId,
  };
};
