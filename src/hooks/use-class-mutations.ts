import { useCallback, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";

type CreateClassParams = {
  title: string;
  description: string;
};

type UpdateClassParams = CreateClassParams & {
  classId: string;
};

export const useClassMutations = () => {
  const [isPending, setIsPending] = useState(false);

  const createClassMutation = useMutation(api.classes.createClassMutation);
  const updateClassMutation = useMutation(api.classes.updateClassMutation);
  const deleteClassMutation = useMutation(api.classes.deleteClassMutation);

  const createClass = useCallback(
    async (params: CreateClassParams) => {
      try {
        setIsPending(true);
        const classId = await createClassMutation({
          ...params,
        });

        toast.success("Class created successfully.");
        return classId;
      } catch (error) {
        console.log("error", error);
        toastError(error, "Failed to create class. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [createClassMutation]
  );

  const updateClass = useCallback(
    async (params: UpdateClassParams) => {
      try {
        setIsPending(true);
        await updateClassMutation({
          ...params,
        });

        toast.success("Class updated successfully.");
      } catch (error) {
        console.error("Failed to update class:", error);
        toastError(error, "Failed to update class. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [updateClassMutation]
  );

  const deleteClass = useCallback(
    async (classId: string) => {
      try {
        setIsPending(true);
        await deleteClassMutation({
          classId,
        });

        toast.success("Class deleted successfully.");
      } catch (error) {
        console.error("Failed to delete class:", error);
        toastError(error, "Failed to delete class. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [deleteClassMutation]
  );

  return {
    createClass,
    updateClass,
    deleteClass,
    isPending,
  };
};
