"use client";

import { useState, useTransition } from "react";
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
          onSuccess?.(data);
        }
      } catch (error) {
        console.error("Subscription hook error:", error);
        setState({
          isSubmitting: false,
          message: "An unexpected error occurred. Please try again.",
          isSuccess: false,
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
