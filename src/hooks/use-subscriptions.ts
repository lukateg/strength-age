import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";

export const useSubscriptions = () => {
  const [isPending, setIsPending] = useState(false);
  // const getCheckoutUrlAction = useAction(
  //   api.subscribeActions.getCheckoutUrlAction
  // );
  // const cancelSubscriptionAction = useAction(
  //   api.subscribeActions.cancelSubscriptionAction
  // );

  const getCheckoutUrl = async (variantId: number, embed = false) => {
    setIsPending(true);
    const toastId = toast.loading("Redirecting to checkout...", {
      description: "Please wait while we redirect you to the checkout page.",
      duration: Infinity,
    });
    try {
      // const url = await getCheckoutUrlAction({ variantId, embed });
      // if (url) {
      //   window.location.href = url;
      // }
    } catch (error) {
      toastError(error, "Failed to redirect to checkout. Please try again.");
    } finally {
      toast.dismiss(toastId);

      setIsPending(false);
    }
  };

  // const cancelSubscription = async () => {
  //   setIsPending(true);
  //   const toastId = toast.loading("Cancelling subscription...", {
  //     description: "Please wait while we cancel your subscription.",
  //     duration: Infinity,
  //   });
  //   try {
  //     const result = await cancelSubscriptionAction();
  //     toast.dismiss(toastId);
  //     toast.success("Subscription cancelled successfully.", {
  //       description:
  //         "Your subscription will remain active until the end of your billing period.",
  //     });
  //     return result;
  //   } catch (error) {
  //     toast.dismiss(toastId);
  //     toastError(error, "Failed to cancel subscription. Please try again.");
  //     throw error;
  //   } finally {
  //     setIsPending(false);
  //   }
  // };

  return { getCheckoutUrl, isPending };
};
