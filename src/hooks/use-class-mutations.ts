import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

import { type Id } from "../../convex/_generated/dataModel";

type CreateClassParams = {
  title: string;
  description: string;
};

type UpdateClassParams = CreateClassParams & {
  classId: string;
};

export const useClassMutations = () => {
  const createClassMutation = useMutation(api.classes.createClass);
  const updateClassMutation = useMutation(api.classes.updateClass);
  const deleteClassMutation = useMutation(api.classes.deleteClass);

  const createClass = useCallback(
    async (params: CreateClassParams) => {
      try {
        await createClassMutation({
          ...params,
        });

        toast.success("Class created successfully.");
      } catch (error) {
        console.error("Failed to create class:", error);
        toast.error("Failed to create class. Please try again.");
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
        toast.error("Failed to update class. Please try again.");
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
        toast.error("Failed to delete class. Please try again.");
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
