import { useCallback } from "react";
import { type z } from "zod";
import { type testSchema, type testReviewSchema } from "@/lib/schemas";

import { toast } from "sonner";
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
          toast.error("You must be logged in to create a test.");
          return;
        }
        const testId = await createTestMutation({ ...params, userId });

        toast.success("Test created successfully.");

        return testId;
      } catch (error) {
        console.error("Failed to create class:", error);
        toast.error("Failed to create test. Please try again.");
        throw error;
      }
    },
    [userId, createTestMutation]
  );

  const createTestReview = useCallback(
    async (params: CreateTestReviewParams) => {
      try {
        if (!userId) {
          toast.error("You must be logged in to create a test review.");
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

        toast.success("Test review created successfully.");

        return testReviewId;
      } catch (error) {
        console.error("Failed to create test review:", error);
        toast.error("Failed to create test review. Please try again.");
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
