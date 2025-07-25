"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { AuthenticationRequired, createAppError } from "../utils";
import { configureLemonSqueezy } from "@/config/lemonsqueezy";
import { getUserByClerkId } from "../users";
import { getLemonSqueezyCustomerByUserId } from "../customer";
import {
  checkIfSubscribingToSamePlan,
  generateCheckoutPayload,
} from "./subscriptions_utils";

export const getCheckoutUrlAction = action({
  args: { variantId: v.number(), embed: v.optional(v.boolean()) },
  handler: async (ctx, { variantId, embed }) => {
    configureLemonSqueezy();
    const clerkId = await AuthenticationRequired({ ctx });

    const user = await getUserByClerkId({ ctx, clerkId });

    if (!user) {
      throw createAppError({
        message: "User not found",
        statusCode: "NOT_FOUND",
      });
    }

    const existingCustomer = await getLemonSqueezyCustomerByUserId({
      ctx,
      userId: user._id,
    });

    const isSubscribingToSamePlan = checkIfSubscribingToSamePlan({
      existingCustomer: existingCustomer ?? undefined,
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
        clerkId,
        variantId,
        embed: embed ?? false,
      })
    );

    if (!checkout.data?.data?.attributes?.url) {
      console.error("[LEMONSQUEEZY CHECKOUT] Failed to create checkout URL");
      throw createAppError({
        message: "Failed to create checkout session",
        statusCode: "SERVER_ERROR",
      });
    }

    return checkout.data.data.attributes.url;
  },
});
