import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export const useStripe = () => {
  const triggerStripeSyncForUserAction = useAction(
    api.stripe.triggerStripeSyncForUser
  );
  const stripePaymentAction = useAction(api.stripe.handleStripeCheckout);
  const cancelSubscriptionAction = useAction(api.stripe.cancelSubscription);
  const undoSubscriptionCancellationAction = useAction(
    api.stripe.undoSubscriptionCancellation
  );

  const handlePlanChangeAction = async (priceId: string) => {
    try {
      const url = await stripePaymentAction({
        priceId,
        redirectRootUrl: window.location.origin,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error processing subscription change:", error);
    }
  };

  const triggerStripeSyncForUser = async () => {
    try {
      await triggerStripeSyncForUserAction();
    } catch (error) {
      console.error("Failed to trigger stripe sync for user", error);
      return { error: error as Error };
    }
  };

  const cancelStripeSubscriptionAction = async () => {
    const toastId = toast.loading("Cancelling subscription...", {
      description: "Please wait while we cancel your subscription.",
      duration: Infinity,
    });
    try {
      const result = await cancelSubscriptionAction();
      toast.dismiss(toastId);
      toast.success("Subscription cancelled successfully.", {
        description:
          "Your subscription will remain active until the end of your billing period.",
      });
      return result;
    } catch (error) {
      console.error("Failed to cancel subscription", error);
      toast.dismiss(toastId);
      toast.error("Failed to cancel subscription", {
        description:
          "Please try again or contact support if the issue persists.",
      });
      throw error;
    }
  };

  const undoStripeSubscriptionCancellationAction = async () => {
    const toastId = toast.loading("Undoing subscription cancellation...", {
      description: "Please wait while we restore your subscription.",
      duration: Infinity,
    });
    try {
      const result = await undoSubscriptionCancellationAction();
      toast.dismiss(toastId);
      toast.success("Subscription cancellation undone successfully.", {
        description: "Your subscription will continue as normal.",
      });
      return result;
    } catch (error) {
      console.error("Failed to undo subscription cancellation", error);
      toast.dismiss(toastId);
      toast.error("Failed to undo subscription cancellation", {
        description:
          "Please try again or contact support if the issue persists.",
      });
      throw error;
    }
  };

  return {
    triggerStripeSyncForUser,
    handlePlanChangeAction,
    cancelStripeSubscriptionAction,
    undoStripeSubscriptionCancellationAction,
  };
};
