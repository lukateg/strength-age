import { useCallback, useState } from "react";
import { useMutation } from "convex/react";
import { useClass } from "@/providers/class-context-provider";
import { useUploadThing } from "@/hooks/use-upload-thing";
import { toast } from "sonner";

import { toastError } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { type Id } from "../../convex/_generated/dataModel";

export const useMaterialsMutations = () => {
  const [isPending, setIsPending] = useState(false);
  const { classId } = useClass();
  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onUploadError: (error: Error) => {
      throw error;
    },
  });

  const deletePdfMutation = useMutation(api.materials.deletePdfMutation);

  const deletePdf = useCallback(
    async (pdfId: Id<"pdfs">) => {
      const toastId = toast.loading("Deleting...", {
        description: "Please wait while we delete the file.",
        duration: Infinity,
      });

      try {
        setIsPending(true);
        await deletePdfMutation({ pdfId });
        toast.dismiss(toastId);
        toast.success("File deleted successfully.");
      } catch (error) {
        toastError(error, "Failed to delete file. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [deletePdfMutation]
  );

  return {
    isPending,
    isUploading,
    startUpload,
    deletePdf,
    classId,
  };
};
