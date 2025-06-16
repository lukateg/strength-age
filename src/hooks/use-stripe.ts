import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useStripe = () => {
  const triggerStripeSyncForUserAction = useAction(
    api.stripe.triggerStripeSyncForUser
  );

  const triggerStripeSyncForUser = async () => {
    try {
      await triggerStripeSyncForUserAction();
    } catch (error) {
      console.error("Failed to trigger stripe sync for user", error);
      return { error: error as Error };
    }
  };
  return {
    triggerStripeSyncForUser,
  };
};
