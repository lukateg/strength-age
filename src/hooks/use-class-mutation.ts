import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { toast } from "@/hooks/use-toast";
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
          toast({
            title: "Error",
            description: "You must be logged in to create a class.",
            variant: "destructive",
          });
          return;
        }

        await createClassMutation({
          ...params,
        });

        toast({
          title: "Success",
          description: "Class created successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to create class:", error);
        toast({
          title: "Error",
          description: "Failed to create class. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [userId, createClassMutation]
  );

  return {
    createClass,
  };
};
