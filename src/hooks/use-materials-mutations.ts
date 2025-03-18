import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useClass } from "@/providers/class-context-provider";
import { toast } from "@/hooks/use-toast";

interface UploadPDFParams {
  userId: string;
  classId: string;
  lessonIds: string[];
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
    async (params: Omit<UploadPDFParams, "userId" | "classId">) => {
      try {
        if (!userId) {
          toast({
            title: "Error",
            description: "You must be logged in to upload materials.",
            variant: "destructive",
          });
          return;
        }

        const uploadParams: UploadPDFParams = {
          userId,
          classId,
          lessonIds: params.lessonIds,
          pdfFiles: params.pdfFiles,
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
