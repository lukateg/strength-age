import { useCallback } from "react";
import { useMutation } from "convex/react";
import { useClass } from "@/providers/class-context-provider";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { toast } from "sonner";

import { toastError } from "@/lib/utils";
import { api } from "../../convex/_generated/api";

import { type ClientUploadedFileData } from "uploadthing/types";
import { type Id } from "../../convex/_generated/dataModel";

interface UploadPDFParams {
  classId: string;
  pdfFiles: {
    fileUrl: string;
    name: string;
    size: number;
  }[];
}

export const useMaterialsMutations = () => {
  const { classId } = useClass();
  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onUploadError: (error: Error) => {
      throw error;
    },
  });

  // Mutations
  const addManyPdfsMutation = useMutation(api.materials.addManyPdfs);
  const deletePdfMutation = useMutation(api.materials.deletePdf);

  const uploadManyPdfs = useCallback(
    async (params: {
      lessonId: string;
      pdfFiles: ClientUploadedFileData<{
        uploadedBy: string;
      }>[];
    }) => {
      const toastId = toast.loading("Uploading...", {
        description: "Please wait while we upload your files.",
        duration: Infinity,
      });
      try {
        const pdfFiles = params.pdfFiles.map((pdf) => ({
          fileUrl: pdf.ufsUrl,
          name: pdf.name,
          size: pdf.size,
        }));

        const uploadParams: UploadPDFParams = {
          classId,
          pdfFiles,
        };

        await addManyPdfsMutation(uploadParams);

        toast.dismiss(toastId);
        toast.success("Materials uploaded successfully.");
      } catch (error) {
        toastError(error, "Failed to upload materials. Please try again.");
      }
    },
    [classId, addManyPdfsMutation]
  );

  const deletePdf = useCallback(
    async (pdfId: Id<"pdfs">) => {
      const toastId = toast.loading("Deleting...", {
        description: "Please wait while we delete the file.",
        duration: Infinity,
      });

      try {
        await deletePdfMutation({ pdfId });
        toast.dismiss(toastId);
        toast.success("File deleted successfully.");
      } catch (error) {
        toastError(error, "Failed to delete file. Please try again.");
      }
    },
    [deletePdfMutation]
  );

  return {
    isUploading,
    startUpload,
    uploadManyPdfs,
    deletePdf,
    classId,
  };
};
