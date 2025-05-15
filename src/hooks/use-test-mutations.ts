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
  const deleteTestReviewMutation = useMutation(api.tests.deleteTestReview);
  const deleteTestMutation = useMutation(api.tests.deleteTest);

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

  const deleteTestReview = useCallback(
    async (testReviewId: Id<"testReviews">) => {
      const toastId = toast.loading("Deleting...", {
        description: "Please wait while we delete the test review.",
        duration: Infinity,
      });

      try {
        await deleteTestReviewMutation({ testReviewId });
        toast.dismiss(toastId);
        toast.success("Test review deleted successfully.");
      } catch (error) {
        console.error("Failed to delete test review:", error);
        toast.dismiss(toastId);
        toast.error("Failed to delete test review. Please try again.");
      }
    },
    [deleteTestReviewMutation]
  );

  const deleteTest = useCallback(
    async (testId: Id<"tests">) => {
      const toastId = toast.loading("Deleting...", {
        description: "Please wait while we delete the test.",
        duration: Infinity,
      });

      try {
        await deleteTestMutation({ testId });
        toast.dismiss(toastId);
        toast.success("Test deleted successfully.");
      } catch (error) {
        console.error("Failed to delete test:", error);
        toast.dismiss(toastId);
        toast.error("Failed to delete test. Please try again.");
      }
    },
    [deleteTestMutation]
  );

  return {
    createTest,
    createTestReview,
    deleteTestReview,
    deleteTest,
  };
};
