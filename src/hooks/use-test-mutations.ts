import { useCallback, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";

import { toast } from "sonner";
import { toastError } from "@/lib/utils";
import { generateTest } from "@/server/test-actions";
import { api } from "../../convex/_generated/api";

import { type Id } from "../../convex/_generated/dataModel";
import { type z } from "zod";
import { type testReviewSchema } from "@/lib/schemas";
import { type TestFormValues } from "@/components/generate-test-form/generate-test-form";

type CreateTestReviewParams = z.infer<typeof testReviewSchema> & {
  classId: Id<"classes">;
};

export const useTestMutations = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [isPending, setIsPending] = useState(false);

  const uploadTestMutation = useMutation(api.tests.uploadTestMutation);
  const createTestReviewMutation = useMutation(
    api.testReviews.createTestReviewMutation
  );
  const deleteTestReviewMutation = useMutation(
    api.testReviews.deleteTestReviewMutation
  );
  const deleteTestMutation = useMutation(api.tests.deleteTestMutation);
  const createTestReviewShareLinkMutation = useMutation(
    api.testReviews.createTestReviewShareLinkMutation
  );

  const generateAndUploadTest = async (formData: TestFormValues) => {
    const toastId = toast.loading("Generating test...", {
      description:
        "Please don't refresh or close the page, or the test will be lost.",
      duration: Infinity,
    });

    try {
      setIsPending(true);
      generateTest(formData)
        .then(async (generatedTest) => {
          await uploadTestMutation({
            ...generatedTest,
          });

          toast.dismiss(toastId);
          toast.success("Test generated successfully!");
        })
        .catch((error) => {
          toast.dismiss(toastId);
          let errorMessage =
            "An unknown error occurred. Please try again later.";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        });
    } catch (error) {
      toast.dismiss(toastId);
      toastError(error, "Failed to create test. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const createTestReview = useCallback(
    async (params: CreateTestReviewParams) => {
      try {
        if (!userId) {
          toast.error("You must be logged in to create a test review.");
          return;
        }
        setIsPending(true);
        const testReviewId = await createTestReviewMutation({
          testId: params.testId,
          title: params.title,
          description: params.description,
          classId: params.classId,
          questions: params.questions,
        });

        toast.success("Test review created successfully.");

        return testReviewId;
      } catch (error) {
        toastError(error, "Failed to create test review. Please try again.");
      } finally {
        setIsPending(false);
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
        setIsPending(true);
        await deleteTestReviewMutation({ testReviewId });
        toast.dismiss(toastId);
        toast.success("Test review deleted successfully.");
      } catch (error) {
        toastError(error, "Failed to delete test review. Please try again.");
      } finally {
        setIsPending(false);
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
        setIsPending(true);
        await deleteTestMutation({ testId });
        toast.dismiss(toastId);
        toast.success("Test deleted successfully.");
      } catch (error) {
        toastError(error, "Failed to delete test. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [deleteTestMutation]
  );

  const copyTestReviewShareLink = useCallback(
    async (testReviewId: Id<"testReviews">, testId: Id<"tests">) => {
      try {
        setIsPending(true);
        const shareToken = await createTestReviewShareLinkMutation({
          testReviewId,
          expiresInDays: 7,
        });

        if (!shareToken) {
          throw new Error("Failed to create share token");
        }

        const shareUrl = `${window.location.origin}/app/tests/${testId}/review/${testReviewId}?token=${shareToken}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      } catch (error) {
        toastError(
          error,
          "Failed to create test review share link. Please try again."
        );
      } finally {
        setIsPending(false);
      }
    },
    [createTestReviewShareLinkMutation]
  );

  return {
    generateAndUploadTest,
    createTestReview,
    deleteTestReview,
    deleteTest,
    copyTestReviewShareLink,
    isPending,
  };
};
