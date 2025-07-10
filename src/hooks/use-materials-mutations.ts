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
  const { startUpload, isUploading } = useUploadThing("materialUploader", {
    onUploadError: (error: Error) => {
      throw error;
    },
  });

  const deleteMaterialMutation = useMutation(
    api.materials.deleteMaterialMutation
  );

  const deleteMaterial = useCallback(
    async (materialId: Id<"materials">) => {
      const toastId = toast.loading("Deleting...", {
        description: "Please wait while we delete the file.",
        duration: Infinity,
      });

      try {
        setIsPending(true);
        await deleteMaterialMutation({ materialId });
        toast.dismiss(toastId);
        toast.success("File deleted successfully.");
      } catch (error) {
        toastError(error, "Failed to delete file. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [deleteMaterialMutation]
  );

  return {
    isPending,
    isUploading,
    startUpload,
    deleteMaterial,
    classId,
  };
};
