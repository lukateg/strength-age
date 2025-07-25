import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { type Doc, type Id } from "convex/_generated/dataModel";

export const verifyWebhookSubscriptionSignature = async (
  payload: string,
  signature: string
) => {
  // Verify webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[LEMONSQUEEZY WEBHOOK] Webhook Secret not set");
    return { success: false, error: "Webhook secret not configured" };
  }

  // HMAC verification using Web Crypto API
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const digestHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (digestHex !== signature) {
    console.error("[LEMONSQUEEZY WEBHOOK] Invalid signature");
    return { success: false, error: "Invalid signature" };
  }
  return { success: true, message: "Signature verified successfully" };
};

export const parseWebhookData = (payload: string) => {
  // Parse webhook data
  let webhookData: {
    data: Subscription["data"];
    meta: {
      event_name: string;
      custom_data?: {
        user_id: Id<"users">;
        variant_id?: string;
      };
    };
  };
  try {
    webhookData = JSON.parse(payload) as {
      data: Subscription["data"];
      meta: {
        event_name: string;
        custom_data?: {
          user_id: Id<"users">;
          variant_id?: string;
        };
      };
    };
  } catch (e) {
    console.error("[LEMONSQUEEZY WEBHOOK] Invalid JSON payload", e);
    return { success: false, error: "Invalid JSON payload" };
  }

  // List of events we want to track
  const allowedEvents = [
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
    "subscription_resumed",
    "subscription_expired",
    "subscription_paused",
    "subscription_unpaused",
    "subscription_payment_success",
    "subscription_payment_failed",
    "subscription_payment_recovered",
  ];

  if (!allowedEvents.includes(webhookData.meta.event_name)) {
    console.log("[LEMONSQUEEZY WEBHOOK] Ignoring untracked event type", {
      type: webhookData.meta.event_name,
    });
    return { success: false, message: "Event type not tracked" };
  }

  return {
    success: true,
    message: "Webhook data parsed successfully",
    webhookData,
  };
};

export const createSubscriptionData = ({
  userId,
  customerId,
  variantId,
  status,
  subscriptionId,
  createdAt,
  updatedAt,
  cardBrand,
  cardLastFour,
}: {
  // rewrite this payload
  userId: Id<"users">;
  customerId: number;
  variantId?: number;
  status?: string;
  subscriptionId?: string;
  createdAt?: string;
  updatedAt?: string;
  cardBrand?: string;
  cardLastFour?: string;
}) => {
  const tierMap: Record<number, "free" | "starter" | "pro"> = {
    914556: "starter",
    914565: "pro",
  };
  const tier = variantId ? (tierMap[variantId] ?? "free") : "free";

  return {
    userId,
    customerId,
    status: status ?? "unknown",
    variantId: variantId,
    subscriptionTier: tier,
    subscriptionId,
    currentPeriodStart: createdAt,
    currentPeriodEnd: updatedAt,
    cancelAtPeriodEnd: status === "cancelled",
    paymentMethod: cardBrand
      ? {
          brand: cardBrand,
          last4: cardLastFour,
        }
      : undefined,
  };
};

// Extract and validate required fields from webhook data
export const extractWebhookRequiredFields = (webhookData: {
  data: Subscription["data"];
  meta: {
    custom_data?: {
      user_id: Id<"users">;
      variant_id?: string;
    };
  };
}):
  | { success: false; error: string; message: string }
  | {
      success: true;
      data: {
        userId: Id<"users">;
        customerId: number;
        subscriptionId: string;
        variantId: number;
        status: string;
        cardBrand: string;
        cardLastFour: string;
        createdAt: string;
        updatedAt: string;
      };
    } => {
  const userId = webhookData.meta.custom_data?.user_id;
  if (!userId) {
    return {
      success: false,
      error: "No user ID in webhook data",
      message: "No user ID in webhook data",
    };
  }

  const variantId = webhookData.data.attributes.variant_id;
  if (!variantId) {
    return {
      success: false,
      error: "No variant ID in webhook data",
      message: "No variant ID in webhook data",
    };
  }

  const customerId = webhookData.data.attributes.customer_id;
  if (!customerId) {
    return {
      success: false,
      error: "No customer ID in webhook data",
      message: "No customer ID in webhook data",
    };
  }

  const subscriptionId = webhookData.data.id;
  if (!subscriptionId) {
    return {
      success: false,
      error: "No subscription ID in webhook data",
      message: "No subscription ID in webhook data",
    };
  }

  const status = webhookData.data.attributes.status;
  if (!status) {
    return {
      success: false,
      error: "No status in webhook data",
      message: "No status in webhook data",
    };
  }

  const cardBrand = webhookData.data.attributes.card_brand;
  if (!cardBrand) {
    return {
      success: false,
      error: "No card brand in webhook data",
      message: "No card brand in webhook data",
    };
  }

  const cardLastFour = webhookData.data.attributes.card_last_four;
  if (!cardLastFour) {
    return {
      success: false,
      error: "No card last four in webhook data",
      message: "No card last four in webhook data",
    };
  }

  const createdAt = webhookData.data.attributes.created_at;
  if (!createdAt) {
    return {
      success: false,
      error: "No created at in webhook data",
      message: "No created at in webhook data",
    };
  }

  const updatedAt = webhookData.data.attributes.updated_at;
  if (!updatedAt) {
    return {
      success: false,
      error: "No updated at in webhook data",
      message: "No updated at in webhook data",
    };
  }

  return {
    success: true,
    data: {
      userId,
      customerId,
      subscriptionId,
      variantId,
      status,
      cardBrand,
      cardLastFour,
      createdAt,
      updatedAt,
    },
  };
};

export const generateCheckoutPayload = ({
  userId,
  variantId,
  embed,
}: {
  userId: Id<"users">;
  variantId: number;
  embed: boolean;
}) => {
  return {
    checkoutOptions: {
      embed,
      media: true,
      logo: !embed,
    },
    checkoutData: {
      custom: {
        user_id: userId,
        variant_id: String(variantId),
      },
    },
    productOptions: {
      enabledVariants: [variantId],
      redirectUrl: `${"http://localhost:3000"}/app`,
      // redirectUrl: `${process.env.SITE_URL ?? "http://localhost:3000"}/app`,
    },
  };
};

export const checkIfSubscribingToSamePlan = ({
  existingCustomer,
  variantId,
}: {
  existingCustomer: Doc<"lemonSqueezyCustomers">;
  variantId: number;
}) => {
  const activeStatuses = ["active", "on_trial", "paused"];

  if (!existingCustomer) {
    return false;
  }

  const isSubscribingToSamePlan = existingCustomer?.variantId === variantId;
  const isInActiveStatus = activeStatuses.includes(
    existingCustomer.status ?? ""
  );

  if (isInActiveStatus && isSubscribingToSamePlan) {
    return true;
  }

  return false;
};
