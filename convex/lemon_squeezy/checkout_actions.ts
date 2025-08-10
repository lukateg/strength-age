"use node";

import { v } from "convex/values";
import { action, type ActionCtx } from "../_generated/server";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { isAuthenticated, createAppError } from "../utils";
import { configureLemonSqueezy } from "@/config/lemonsqueezy";
import { internal } from "../_generated/api";
import { type Id } from "../_generated/dataModel";

export const checkIfSubscribingToSamePlan = async ({
  ctx,
  userId,
  variantId,
}: {
  ctx: ActionCtx;
  userId: Id<"users">;
  variantId: number;
}) => {
  const activeStatuses = ["active", "on_trial", "paused"];

  const existingCustomer = await ctx.runQuery(
    internal.customer.getLSCustomerByUserIdInternalQuery,
    {
      userId,
    }
  );
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

  console.log("[LEMONSQUEEZY CHECKOUT] User changing plans", {
    userId,
    currentVariantId: existingCustomer.variantId,
    currentStatus: existingCustomer.status,
    newVariantId: variantId,
  });

  return false;
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
      redirectUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/app`,
      // redirectUrl: `${process.env.SITE_URL ?? "http://localhost:3000"}/app`,
    },
  };
};

export const getCheckoutUrlAction = action({
  args: { variantId: v.number(), embed: v.optional(v.boolean()) },
  handler: async (ctx, { variantId, embed }) => {
    configureLemonSqueezy();
    console.log("[LEMONSQUEEZY CHECKOUT] Checkout started, payload >", {
      variantId,
      embed,
    });
    const clerkId = await isAuthenticated({ ctx });

    const user = await ctx.runQuery(
      internal.users.getUserByClerkIdInternalQuery,
      { clerkId }
    );
    if (!user) {
      throw createAppError({
        message: "User not found",
        statusCode: "NOT_FOUND",
      });
    }
    console.log("[LEMONSQUEEZY CHECKOUT] User by clerk id", { user });

    const isSubscribingToSamePlan = await checkIfSubscribingToSamePlan({
      ctx,
      userId: user._id,
      variantId,
    });
    if (isSubscribingToSamePlan) {
      throw createAppError({
        message: "You're already subscribed to this plan",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      variantId,
      generateCheckoutPayload({
        userId: user._id,
        variantId,
        embed: embed ?? false,
      })
    );

    const checkoutPayload = generateCheckoutPayload({
      userId: user._id,
      variantId,
      embed: embed ?? false,
    });

    console.log(
      "[LEMONSQUEEZY CHECKOUT] Checkout payload >",
      checkoutPayload.checkoutData.custom
    );

    if (!checkout.data?.data?.attributes?.url) {
      console.error("[LEMONSQUEEZY CHECKOUT] Failed to create checkout URL");
      throw createAppError({
        message: "Failed to create checkout session",
        statusCode: "SERVER_ERROR",
      });
    }

    console.log("[LEMONSQUEEZY CHECKOUT] Checkout session URL created", {
      checkoutSessionUrl: checkout.data.data.attributes.url,
      variantId,
      userId: user._id,
    });
    console.log(
      "[LEMONSQUEEZY CHECKOUT] Checkout value >",
      checkout.data.data.attributes.checkout_data
    );

    return checkout.data.data.attributes.url;
  },
});
