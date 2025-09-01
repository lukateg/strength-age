"use server";

import { beehiivApiSchema } from "@/lib/validations/newsletter";

interface SubscriptionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

export async function subscribeToNewsletter(
  email: string,
  utmSource = "website",
  utmCampaign = "waitlist",
  utmMedium = "form"
): Promise<SubscriptionResult> {
  try {
    // Validate the input data with Zod
    const validationResult = beehiivApiSchema.safeParse({
      email,
      utmSource,
      utmCampaign,
      utmMedium,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error("Missing Beehiiv API credentials");
      return {
        success: false,
        message:
          "Newsletter service is temporarily unavailable. Please try again later.",
      };
    }

    // Beehiiv API endpoint
    const beehiivEndpoint = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;

    // Prepare subscriber data
    const subscriberData = {
      email: validationResult.data.email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: validationResult.data.utmSource,
      utm_campaign: validationResult.data.utmCampaign,
      utm_medium: validationResult.data.utmMedium,
      referring_site:
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://quickaudit.com",
    };

    // Make API call to Beehiiv
    const response = await fetch(beehiivEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(subscriberData),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      console.error("Beehiiv API error:", response.status, errorData);

      // Handle specific Beehiiv error cases
      if (
        response.status === 400 &&
        errorData.message?.includes("already exists")
      ) {
        return {
          success: true,
          message:
            "You&apos;re already subscribed! Thanks for your continued interest.",
        };
      }

      // Handle rate limiting
      if (response.status === 429) {
        return {
          success: false,
          message: "Too many requests. Please wait a moment and try again.",
        };
      }

      // Handle authorization errors
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          message:
            "Newsletter service is temporarily unavailable. Please try again later.",
        };
      }

      return {
        success: false,
        message:
          "Unable to complete subscription. Please try again or contact support.",
      };
    }

    const data = (await response.json()) as Record<string, unknown>;

    return {
      success: true,
      message: "🎉 Thanks for subscribing! Check your email for confirmation.",
      data,
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
