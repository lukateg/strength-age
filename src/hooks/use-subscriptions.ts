import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";

export const useSubscriptions = () => {
  const [isPending, setIsPending] = useState(false);
  const getCheckoutUrlAction = useAction(
    api.lemonSqueezy.subscriptions_actions.getCheckoutUrlAction
  );

  const getCheckoutUrl = async (variantId: number, embed = false) => {
    setIsPending(true);
    const toastId = toast.loading("Redirecting to checkout...", {
      description: "Please wait while we redirect you to the checkout page.",
      duration: Infinity,
    });
    try {
      const url = await getCheckoutUrlAction({ variantId, embed });
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toastError(error, "Failed to redirect to checkout. Please try again.");
    } finally {
      toast.dismiss(toastId);

      setIsPending(false);
    }
  };

  return { getCheckoutUrl, isPending };
};
