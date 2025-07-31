import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { internal } from "../_generated/api";

import { getSubscription, getCustomer } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy } from "@/config/lemonsqueezy";
import {
  extractWebhookRequiredFields,
  parseWebhookData,
  verifyWebhookSubscriptionSignature,
  createSubscriptionData,
} from "./subscriptions_utils";
import {
  processWebhookSubscriptionData,
  syncLemonSqueezyDataToConvex,
  updateLemonSqueezyCustomerData,
} from "./subscriptions_model";

import { getUserByUserId } from "../users";
import {
  getLemonSqueezyCustomerByCustomerId,
  createLemonSqueezyCustomer,
  updateLemonSqueezyCustomer,
} from "../customer";

import { createAppError } from "../utils";

export const handleSubscriptionWebhook = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, { signature, payload }) => {
    const verification = await verifyWebhookSubscriptionSignature(
      payload,
      signature
    );
    if (!verification.success) {
      console.error("[LEMONSQUEEZY WEBHOOK] Signature verification failed", {
        error: verification.error,
      });
      return { success: false, error: verification.error };
    }

    try {
      const { success, webhookData, message } = parseWebhookData(payload);
      if (!success) {
        console.error("[LEMONSQUEEZY WEBHOOK] Failed to parse webhook data");
        return { success: false, error: "Failed to parse webhook data" };
      }

      // If success is true but no webhookData, it means we're ignoring this event type
      if (!webhookData) {
        console.log(
          "[LEMONSQUEEZY WEBHOOK] Event type ignored, acknowledging receipt"
        );
        return { success: true, message: message ?? "Event type ignored" };
      }

      const extractionResult = extractWebhookRequiredFields(webhookData);
      if (!extractionResult.success) {
        console.error(`[LEMONSQUEEZY WEBHOOK] ${extractionResult.message}`);
        return { success: false, message: extractionResult.message };
      }

      // If we have subscription data in the webhook, use it directly for faster processing
      const data = extractionResult.data;

      if (data) {
        const processResult = await processWebhookSubscriptionData({
          ctx,
          data,
        });

        if (processResult) {
          return { success: true, message: "Event processed successfully" };
        }
      }

      // Fallback: Sync the customer's data from Lemon Squeezy API manually
      const syncResult = await syncLemonSqueezyDataToConvex({
        ctx,
        userId: data.userId,
        customerId: data.customerId,
        clerkId: data.clerkId,
      });
      if (!syncResult) {
        console.log(
          "[LEMONSQUEEZY WEBHOOK] User not found in database, skipping sync",
          {
            userId: data.userId,
            customerId: data.customerId,
            eventName: webhookData.meta.event_name,
          }
        );
        return {
          success: true,
          message: "User not found in database, sync skipped",
        };
      }

      return { success: true, message: "Event processed successfully" };
    } catch (err) {
      console.error("[LEMONSQUEEZY WEBHOOK] Error processing event", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },
});

// Process subscription data directly from webhook payload
export const processWebhookSubscription = internalAction({
  args: {
    userId: v.id("users"),
    clerkId: v.string(),
    customerId: v.number(),
    subscriptionId: v.optional(v.string()),
    variantId: v.optional(v.number()),
    status: v.optional(v.string()),
    cardBrand: v.optional(v.string()),
    cardLastFour: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
    renewsAt: v.optional(v.string()),
    endsAt: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      userId,
      clerkId,
      customerId,
      subscriptionId,
      variantId,
      status,
      cardBrand,
      cardLastFour,
      createdAt,
      updatedAt,
      renewsAt,
      endsAt,
    }
  ) => {
    const user = await getUserByUserId({ ctx, userId });
    if (!user) {
      console.error(
        "[LEMONSQUEEZY WEBHOOK PROCESS] User not found in database",
        {
          userId,
        }
      );
      return null;
    }

    const subscriptionData = createSubscriptionData({
      userId: user._id,
      clerkId,
      customerId,
      variantId,
      status,
      subscriptionId,
      createdAt,
      updatedAt,
      renewsAt,
      endsAt,
      cardBrand,
      cardLastFour,
    });

    await updateLemonSqueezyCustomerData({
      ctx,
      data: subscriptionData,
    });

    await ctx.runMutation(internal.users.updateUser, {
      userId: user._id,
      data: { subscriptionTier: subscriptionData.subscriptionTier },
    });

    return subscriptionData;
  },
});

// Sync subscription data from Lemon Squeezy API
export const syncLemonSqueezyDataToConvexInternalAction = internalAction({
  args: { userId: v.id("users"), customerId: v.number(), clerkId: v.string() },
  handler: async (ctx, { userId, customerId, clerkId }) => {
    configureLemonSqueezy();

    // Check if user exists in our database first
    const user = await getUserByUserId({ ctx, userId });
    if (!user) {
      console.log(
        "[LEMONSQUEEZY SYNC] User not found in database, skipping sync",
        {
          userId,
          customerId,
          clerkId,
        }
      );
      return null;
    }

    try {
      // Fetch customer data from Lemon Squeezy API
      const customer = await getCustomer(customerId.toString());
      if (!customer.data?.data) {
        console.error(
          "[LEMONSQUEEZY SYNC] Customer not found in Lemon Squeezy",
          {
            customerId,
          }
        );
        return null;
      }

      // Check if we have subscription data in our database
      const existingCustomer = await getLemonSqueezyCustomerByCustomerId({
        ctx,
        customerId,
      });
      if (!existingCustomer) {
        console.error(
          "[LEMONSQUEEZY SYNC] Customer not found in database, skipping sync",
          { customerId }
        );
        return null;
      }

      // If no subscription ID in database, this might be a new customer with no subscription
      if (!existingCustomer.subscriptionId) {
        console.log(
          "[LEMONSQUEEZY SYNC] No subscription found in database, updating customer with no subscription",
          { customerId }
        );

        const subData = createSubscriptionData({
          userId: user._id,
          clerkId,
          customerId,
          status: "none",
          subscriptionId: undefined,
          variantId: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          renewsAt: undefined,
          endsAt: undefined,
          cardBrand: undefined,
          cardLastFour: undefined,
        });

        await updateLemonSqueezyCustomerData({
          ctx,
          data: subData,
        });

        // TODO: remove this once you're sure you're not going to need it
        await ctx.runMutation(internal.users.updateUser, {
          userId: user._id,
          data: { subscriptionTier: subData.subscriptionTier },
        });

        return null;
      }

      // Fetch detailed subscription data
      const subscriptionData = await getSubscription(
        existingCustomer.subscriptionId.toString()
      );
      if (!subscriptionData.data?.data) {
        console.error(
          `[LEMONSQUEEZY SYNC] Subscription not found in Lemon Squeezy: subscriptionId: ${existingCustomer.subscriptionId}`
        );

        const subData = createSubscriptionData({
          userId: user._id,
          clerkId,
          customerId,
          status: "cancelled",
          subscriptionId: undefined,
          variantId: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          renewsAt: undefined,
          endsAt: undefined,
          cardBrand: undefined,
          cardLastFour: undefined,
        });

        // Subscription no longer exists, mark as cancelled
        await updateLemonSqueezyCustomerData({
          ctx,
          data: subData,
        });

        await ctx.runMutation(internal.users.updateUser, {
          userId: user._id,
          data: { subscriptionTier: subData.subscriptionTier },
        });

        return null;
      }

      const subscription = subscriptionData.data.data;

      const extractedData = extractWebhookRequiredFields({
        data: subscription,
        meta: {
          custom_data: {
            user_id: user._id,
          },
        },
      });

      if (!extractedData.success) {
        console.error(
          `[LEMONSQUEEZY SYNC] Failed to extract webhook required fields: ${extractedData.error}`
        );
        return null;
      }

      const subData = createSubscriptionData({
        ...extractedData.data,
      });

      // Update the customer in Convex
      await ctx.runAction(
        internal.lemonSqueezy.subscriptions
          .updateLemonSqueezyCustomerDataInternalAction,
        {
          ...subData,
        }
      );

      // Update user's subscription tier (tier is now stored in subData.subscriptionTier)
      await ctx.runMutation(internal.users.updateUser, {
        userId: user._id,
        data: { subscriptionTier: subData.subscriptionTier },
      });

      return subData;
    } catch (err) {
      console.error("[LEMONSQUEEZY SYNC] Error syncing subscription data", err);
      throw createAppError({
        message: "Error syncing subscription data",
        statusCode: "SERVER_ERROR",
      });
    }
  },
});

// Internal action to update customer data
export const updateLemonSqueezyCustomerDataInternalAction = internalAction({
  args: {
    userId: v.id("users"),
    clerkId: v.string(),
    customerId: v.number(),
    status: v.string(),
    variantId: v.optional(v.number()),
    subscriptionId: v.optional(v.string()),
    subscriptionTier: v.optional(
      v.union(v.literal("free"), v.literal("starter"), v.literal("pro"))
    ),
    currentPeriodStart: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    paymentMethod: v.optional(
      v.object({
        brand: v.optional(v.string()),
        last4: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { userId, clerkId, customerId, ...data }) => {
    // Implement proper upsert logic to avoid race conditions
    try {
      // First, try to find existing customer
      const existingCustomer = await ctx.runQuery(
        internal.lemonSqueezy.subscriptions
          .getLemonSqueezyCustomerByCustomerIdInternalQuery,
        { customerId }
      );

      if (existingCustomer) {
        // Customer exists, update it
        await ctx.runMutation(
          internal.lemonSqueezy.subscriptions
            .updateLemonSqueezyCustomerInternalMutation,
          {
            _id: existingCustomer._id,
            ...data,
          }
        );
      } else {
        // Customer doesn't exist, try to create it
        try {
          await ctx.runMutation(
            internal.lemonSqueezy.subscriptions
              .createLemonSqueezyCustomerInternalMutation,
            {
              userId,
              clerkId,
              customerId,
              ...data,
            }
          );
        } catch (error) {
          // If creation fails due to race condition, try to update instead
          console.log(
            `[LEMONSQUEEZY] Customer creation failed (likely race condition), attempting update. CustomerId: ${customerId}`
          );

          // Re-query to get the customer that was created by another function
          const newExistingCustomer = await ctx.runQuery(
            internal.lemonSqueezy.subscriptions
              .getLemonSqueezyCustomerByCustomerIdInternalQuery,
            { customerId }
          );

          if (newExistingCustomer) {
            // Update the customer that was created by another function
            await ctx.runMutation(
              internal.lemonSqueezy.subscriptions
                .updateLemonSqueezyCustomerInternalMutation,
              {
                _id: newExistingCustomer._id,
                ...data,
              }
            );
          } else {
            // If still no customer found, re-throw the original error
            throw error;
          }
        }
      }
    } catch (error) {
      console.error(
        `[LEMONSQUEEZY] Error updating customer data for customerId ${customerId}:`,
        error
      );
      throw error;
    }

    return data;
  },
});

// Database mutations and queries
export const createLemonSqueezyCustomerInternalMutation = internalMutation({
  args: {
    userId: v.id("users"),
    clerkId: v.string(),
    customerId: v.number(),
    status: v.string(),
    subscriptionId: v.optional(v.string()),
    variantId: v.optional(v.number()),
    subscriptionTier: v.optional(
      v.union(v.literal("free"), v.literal("starter"), v.literal("pro"))
    ),
    currentPeriodStart: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    paymentMethod: v.optional(
      v.object({
        brand: v.optional(v.string()),
        last4: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { userId, customerId, clerkId, ...data }) => {
    return await ctx.db.insert("lemonSqueezyCustomers", {
      userId,
      clerkId,
      customerId,
      ...data,
    });
  },
});

export const updateLemonSqueezyCustomerInternalMutation = internalMutation({
  args: {
    _id: v.id("lemonSqueezyCustomers"),
    status: v.string(),
    subscriptionId: v.optional(v.string()),
    variantId: v.optional(v.number()),
    subscriptionTier: v.optional(
      v.union(v.literal("free"), v.literal("starter"), v.literal("pro"))
    ),
    currentPeriodStart: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    paymentMethod: v.optional(
      v.object({
        brand: v.optional(v.string()),
        last4: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { _id, ...data }) => {
    return await ctx.db.patch(_id, data);
  },
});

export const getLemonSqueezyCustomerByCustomerIdInternalQuery = internalQuery({
  args: { customerId: v.number() },
  handler: async (ctx, { customerId }) => {
    return await ctx.db
      .query("lemonSqueezyCustomers")
      .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
      .first();
  },
});

export const getLemonSqueezyCustomerByUserIdInternalQuery = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("lemonSqueezyCustomers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});
