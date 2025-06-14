import { useCallback } from "react";
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
  const createClassMutation = useMutation(api.classes.createClassMutation);
  const updateClassMutation = useMutation(api.classes.updateClassMutation);
  const deleteClassMutation = useMutation(api.classes.deleteClassMutation);

  const createClass = useCallback(
    async (params: CreateClassParams) => {
      try {
        const classId = await createClassMutation({
          ...params,
        });

        toast.success("Class created successfully.");
        return classId;
      } catch (error) {
        console.log("error", error);
        toastError(error, "Failed to create class. Please try again.");
      }
    },
    [createClassMutation]
  );

  const updateClass = useCallback(
    async (params: UpdateClassParams) => {
      try {
        await updateClassMutation({
          ...params,
        });

        toast.success("Class updated successfully.");
      } catch (error) {
        console.error("Failed to update class:", error);
        toastError(error, "Failed to update class. Please try again.");
      }
    },
    [updateClassMutation]
  );

  const deleteClass = useCallback(
    async (classId: string) => {
      try {
        await deleteClassMutation({
          classId,
        });

        toast.success("Class deleted successfully.");
      } catch (error) {
        console.error("Failed to delete class:", error);
        toastError(error, "Failed to delete class. Please try again.");
      }
    },
    [deleteClassMutation]
  );

  return {
    createClass,
    updateClass,
    deleteClass,
  };
};
