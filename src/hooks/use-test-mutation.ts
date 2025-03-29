import { useCallback } from "react";
import { type z } from "zod";
import { type testSchema } from "@/lib/schemas";

import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type CreateTestParams = z.infer<typeof testSchema> & {
  classId: string;
};

export const useTestMutations = () => {
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  const createTestMutation = useMutation(api.tests.createTest);

  const createTest = useCallback(
    async (params: CreateTestParams) => {
      try {
        if (!userId) {
          toast({
            title: "Error",
            description: "You must be logged in to create a test.",
            variant: "destructive",
          });
          return;
        }
        const testId = await createTestMutation({ ...params, userId });

        toast({
          title: "Success",
          description: "Test created successfully.",
          variant: "default",
        });

        return testId;
      } catch (error) {
        console.error("Failed to create class:", error);
        toast({
          title: "Error",
          description: "Failed to create test. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [userId, createTestMutation]
  );

  return {
    createTest,
  };
};
