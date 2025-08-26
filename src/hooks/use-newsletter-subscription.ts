"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";
import type { NewsletterSubscriptionData } from "@/lib/validations/newsletter";

interface UseNewsletterSubscriptionProps {
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  onSuccess?: (data: NewsletterSubscriptionData) => void;
}

interface SubscriptionState {
  isSubmitting: boolean;
  message: string | null;
  isSuccess: boolean;
}

export function useNewsletterSubscription({
  utmSource = "website",
  utmCampaign = "waitlist",
  utmMedium = "form",
  onSuccess,
}: UseNewsletterSubscriptionProps = {}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<SubscriptionState>({
    isSubmitting: false,
    message: null,
    isSuccess: false,
  });

  const subscribe = async (data: NewsletterSubscriptionData) => {
    setState({
      isSubmitting: true,
      message: null,
      isSuccess: false,
    });

    startTransition(async () => {
      try {
        const result = await subscribeToNewsletter(
          data.email,
          utmSource,
          utmCampaign,
          utmMedium
        );

        setState({
          isSubmitting: false,
          message: result.message,
          isSuccess: result.success,
        });

        if (result.success) {
          toast.success(result.message, {
            duration: 5000,
          });
          onSuccess?.(data);
        } else {
          toast.error(result.message, {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Subscription hook error:", error);
        const errorMessage = "An unexpected error occurred. Please try again.";
        setState({
          isSubmitting: false,
          message: errorMessage,
          isSuccess: false,
        });
        toast.error(errorMessage, {
          duration: 5000,
        });
      }
    });
  };

  const clearMessage = () => {
    setState((prev) => ({
      ...prev,
      message: null,
      isSuccess: false,
    }));
  };

  return {
    subscribe,
    clearMessage,
    isSubmitting: state.isSubmitting || isPending,
    message: state.message,
    isSuccess: state.isSuccess,
  };
}
