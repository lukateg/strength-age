import { useMutation } from "convex/react";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export const useSettingsMutations = () => {
  const [isPending, setIsPending] = useState(false);

  const updateUserPreferencesMutation = useMutation(
    api.users.updateUserPreferences
  );

  const handleLinkExpirationChange = async (enabled: boolean) => {
    try {
      setIsPending(true);
      await updateUserPreferencesMutation({
        preferences: {
          shouldTestReviewLinksExpire: enabled,
        },
      });
      toast.success("Settings updated successfully!");
    } catch (error) {
      toastError(error, "Failed to update settings. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    handleLinkExpirationChange,
  };
};
