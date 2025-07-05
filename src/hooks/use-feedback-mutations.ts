import { useMutation } from "convex/react";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

type FeedbackData = {
  type: "bug" | "feature" | "complaint" | "compliment" | "general";
  rating: number;
  title: string;
  description: string;
  email?: string;
};

export const useFeedbackMutations = () => {
  const [isPending, setIsPending] = useState(false);

  const createFeedbackMutation = useMutation(api.feedbacks.createFeedback);

  const handleCreateFeedback = async (feedback: FeedbackData) => {
    try {
      setIsPending(true);
      await createFeedbackMutation({
        type: feedback.type,
        rating: feedback.rating,
        title: feedback.title,
        description: feedback.description,
        email: feedback.email,
      });
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toastError(error, "Failed to submit feedback. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    handleCreateFeedback,
  };
};
