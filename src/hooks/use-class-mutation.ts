import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

import { useClasses } from "@/providers/classes-provider";

interface CreateClassParams {
  title: string;
  description: string;
}

export const useClassMutations = () => {
  const { userId } = useClasses();

  const createClassMutation = useMutation(api.classes.createClass);

  const createClass = useCallback(
    async (params: CreateClassParams) => {
      try {
        if (!userId) {
          toast.error("You must be logged in to create a class.");
          return;
        }

        await createClassMutation({
          ...params,
        });

        toast.success("Class created successfully.");
      } catch (error) {
        console.error("Failed to create class:", error);
        toast.error("Failed to create class. Please try again.");
      }
    },
    [userId, createClassMutation]
  );

  return {
    createClass,
  };
};
