import { useCallback } from "react";
import { type z } from "zod";
import { type testSchema, type testReviewSchema } from "@/lib/schemas";

import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { type Id } from "../../convex/_generated/dataModel";

type CreateTestParams = z.infer<typeof testSchema> & {
  classId: Id<"classes">;
};

type CreateTestReviewParams = z.infer<typeof testReviewSchema> & {
  classId: Id<"classes">;
};

export const useTestMutations = () => {
  const { user } = useUser(); // Clerk provides the logged-in user
  const userId = user?.id;

  const createTestMutation = useMutation(api.tests.createTest);
  const createTestReviewMutation = useMutation(api.tests.createTestReview);

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

  const createTestReview = useCallback(
    async (params: CreateTestReviewParams) => {
      try {
        if (!userId) {
          toast({
            title: "Error",
            description: "You must be logged in to create a test review.",
            variant: "destructive",
          });
          return;
        }
        const testReviewId = await createTestReviewMutation({
          userId,
          testId: params.testId,
          title: params.title,
          description: params.description,
          classId: params.classId,
          questions: params.questions,
        });

        toast({
          title: "Success",
          description: "Test review created successfully.",
          variant: "default",
        });

        return testReviewId;
      } catch (error) {
        console.error("Failed to create test review:", error);
        toast({
          title: "Error",
          description: "Failed to create test review. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [userId, createTestReviewMutation]
  );

  return {
    createTest,
    createTestReview,
  };
};
