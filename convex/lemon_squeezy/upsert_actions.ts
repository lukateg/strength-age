// import { v } from "convex/values";
// import { internalAction } from "../_generated/server";
// import { getSubscription, getCustomer } from "@lemonsqueezy/lemonsqueezy.js";
// import { createAppError } from "../utils";
// import { configureLemonSqueezy } from "@/config/lemonsqueezy";
// import { internal } from "../_generated/api";
// import { type Id } from "../_generated/dataModel";

// type LemonSqueezyWebhookData = {
//   meta: {
//     test_mode?: boolean;
//     event_name: string;
//     custom_data?: {
//       user_id: Id<"users">;
//       variant_id?: string;
//     };
//     webhook_id: string;
//   };
//   data: {
//     type: string;
//     id: string;
//     attributes: {
//       store_id?: number;
//       customer_id?: number;
//       order_id?: number;
//       order_item_id?: number;
//       product_id?: number;
//       variant_id?: number;
//       product_name?: string;
//       variant_name?: string;
//       user_name?: string;
//       user_email?: string;
//       status?: string;
//       status_formatted?: string;
//       card_brand?: string;
//       card_last_four?: string;
//       payment_processor?: string;
//       cancelled?: boolean;
//       trial_ends_at?: string | null;
//       billing_anchor?: number;
//       renews_at?: string;
//       ends_at?: string | null;
//       created_at?: string;
//       updated_at?: string;
//       test_mode?: boolean;
//       // ...add any other fields you need
//     };
//   };
// };

// export const verifyLSWebhookSignature = async (
//   payload: string,
//   signature: string
// ) => {
//   // Verify webhook signature
//   const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
//   if (!secret) {
//     console.error("[LEMONSQUEEZY WEBHOOK] Webhook Secret not set");
//     return { success: false, error: "Webhook secret not configured" };
//   }

//   // HMAC verification using Web Crypto API
//   const encoder = new TextEncoder();
//   const key = await crypto.subtle.importKey(
//     "raw",
//     encoder.encode(secret),
//     { name: "HMAC", hash: { name: "SHA-256" } },
//     false,
//     ["sign"]
//   );

//   const signatureBuffer = await crypto.subtle.sign(
//     "HMAC",
//     key,
//     encoder.encode(payload)
//   );

//   const digestHex = Array.from(new Uint8Array(signatureBuffer))
//     .map((b) => b.toString(16).padStart(2, "0"))
//     .join("");

//   if (digestHex !== signature) {
//     console.error("[LEMONSQUEEZY WEBHOOK] Invalid signature");
//     return { success: false, error: "Invalid signature" };
//   }
//   return { success: true, message: "Signature verified successfully" };
// };

// export const parseWebhookData = (payload: string) => {
//   // Parse webhook data
//   let webhookData: LemonSqueezyWebhookData;
//   try {
//     webhookData = JSON.parse(payload) as LemonSqueezyWebhookData;
//   } catch (e) {
//     console.error("[LEMONSQUEEZY WEBHOOK] Invalid JSON payload", e);
//     return { success: false, error: "Invalid JSON payload" };
//   }

//   // List of events we want to track
//   const allowedEvents = [
//     "subscription_created",
//     "subscription_updated",
//     "subscription_cancelled",
//     "subscription_resumed",
//     "subscription_expired",
//     "subscription_paused",
//     "subscription_unpaused",
//     "subscription_payment_success",
//     "subscription_payment_failed",
//     "subscription_payment_recovered",
//   ];

//   if (!allowedEvents.includes(webhookData.meta.event_name)) {
//     console.log("[LEMONSQUEEZY WEBHOOK] Ignoring untracked event type", {
//       type: webhookData.meta.event_name,
//     });
//     return { success: false, message: "Event type not tracked" };
//   }

//   return {
//     success: true,
//     message: "Webhook data parsed successfully",
//     webhookData,
//   };
// };

// export const handleLSWebhookInternalAction = internalAction({
//   args: { signature: v.string(), payload: v.string() },
//   handler: async (ctx, { signature, payload }) => {
//     const verification = await verifyLSWebhookSignature(payload, signature);
//     if (!verification.success) {
//       console.error("[LEMONSQUEEZY WEBHOOK] Signature verification failed", {
//         error: verification.error,
//       });
//       return { success: false, error: verification.error };
//     }

//     try {
//       const { webhookData } = parseWebhookData(payload);
//       if (!webhookData) {
//         console.error("[LEMONSQUEEZY WEBHOOK] Failed to parse webhook data");
//         return { success: false, error: "Failed to parse webhook data" };
//       }

//       const userId = webhookData.meta.custom_data?.user_id;
//       if (!userId) {
//         console.log(
//           "[LEMONSQUEEZY WEBHOOK] No user ID in webhook data, skipping"
//         );
//         return { success: true, message: "No user ID in webhook data" };
//       }

//       const variantId = webhookData.data.attributes.variant_id;
//       if (!variantId) {
//         console.log(
//           "[LEMONSQUEEZY WEBHOOK] No variant ID in webhook data, skipping"
//         );
//         return { success: true, message: "No variant ID in webhook data" };
//       }

//       const customerId = webhookData.data.attributes.customer_id;
//       if (!customerId) {
//         console.log(
//           "[LEMONSQUEEZY WEBHOOK] No customer ID in webhook data, skipping"
//         );
//         return { success: true, message: "No customer ID in webhook data" };
//       }

//       // If we have subscription data in the webhook, use it directly for faster processing
//       if (webhookData.data.id) {
//         const syncResult = await ctx.runAction(
//           internal.subscriptions.processWebhookSubscriptionData,
//           {
//             userId,
//             customerId,
//             webhookData: {
//               subscriptionId: webhookData.data.id,
//               variant_id: webhookData.data.attributes.variant_id,
//               status: webhookData.data.attributes.status,
//               card_brand: webhookData.data.attributes.card_brand,
//               card_last_four: webhookData.data.attributes.card_last_four,
//               created_at: webhookData.data.attributes.created_at,
//               updated_at: webhookData.data.attributes.updated_at,
//             },
//           }
//         );

//         if (syncResult) {
//           console.log(
//             "[LEMONSQUEEZY WEBHOOK] Successfully processed subscription from webhook data"
//           );
//           return { success: true, message: "Event processed successfully" };
//         }
//       }

//       // Fallback: Sync the customer's data from Lemon Squeezy API
//       const syncResult = await ctx.runAction(
//         internal.subscriptions.syncLemonSqueezyDataToConvex,
//         {
//           userId,
//           customerId,
//         }
//       );

//       if (!syncResult) {
//         console.log(
//           "[LEMONSQUEEZY WEBHOOK] User not found in database, skipping sync",
//           {
//             userId,
//             customerId,
//             eventName: webhookData.meta.event_name,
//           }
//         );
//         return {
//           success: true,
//           message: "User not found in database, sync skipped",
//         };
//       }

//       console.log("[LEMONSQUEEZY WEBHOOK] Successfully processed event", {
//         eventName: webhookData.meta.event_name,
//       });
//       return { success: true, message: "Event processed successfully" };
//     } catch (err) {
//       console.error("[LEMONSQUEEZY WEBHOOK] Error processing event", err);
//       return {
//         success: false,
//         error: err instanceof Error ? err.message : "Unknown error",
//       };
//     }
//   },
// });

// // Process subscription data directly from webhook payload
// export const processWebhookSubscriptionData = internalAction({
//   args: {
//     userId: v.id("users"),
//     customerId: v.number(),
//     webhookData: v.object({
//       subscriptionId: v.optional(v.string()),
//       variant_id: v.optional(v.number()),
//       status: v.optional(v.string()),
//       card_brand: v.optional(v.string()),
//       card_last_four: v.optional(v.string()),
//       created_at: v.optional(v.string()),
//       updated_at: v.optional(v.string()),
//     }),
//   },
//   handler: async (ctx, { userId, customerId, webhookData }) => {
//     console.log("[LEMONSQUEEZY WEBHOOK PROCESS] Processing webhook data", {
//       userId,
//       customerId,
//     });

//     // Check if user exists in our database
//     const user = await ctx.runQuery(
//       internal.users.getUserByUserIdInternalQuery,
//       {
//         userId,
//       }
//     );

//     if (!user) {
//       console.log("[LEMONSQUEEZY WEBHOOK PROCESS] User not found in database", {
//         userId,
//       });
//       return null;
//     }

//     // Map variant IDs to tiers (update these with your actual variant IDs)
//     const tierMap: Record<number, "starter" | "pro"> = {
//       // Add your actual Lemon Squeezy variant IDs here
//       // Example: 123456: "starter", 789012: "pro"
//     };

//     // Create subscription data from webhook
//     const subData = {
//       status: webhookData.status ?? "unknown",
//       variantId: webhookData.variant_id,
//       subscriptionId: webhookData.subscriptionId,
//       currentPeriodStart: webhookData.created_at,
//       currentPeriodEnd: webhookData.updated_at,
//       cancelAtPeriodEnd: webhookData.status === "cancelled",
//       paymentMethod: webhookData.card_brand
//         ? {
//             brand: webhookData.card_brand,
//             last4: webhookData.card_last_four,
//           }
//         : undefined,
//     };

//     console.log(
//       "[LEMONSQUEEZY WEBHOOK PROCESS] Updating customer with webhook data",
//       {
//         customerId,
//         status: subData.status,
//       }
//     );

//     // Update the customer in Convex
//     await ctx.runAction(internal.subscriptions.upsertLSCustomerInternalAction, {
//       userId: user._id,
//       customerId,
//       data: subData,
//     });

//     return subData;
//   },
// });

// // Sync subscription data from Lemon Squeezy API
// export const syncLemonSqueezyDataToConvex = internalAction({
//   args: { userId: v.id("users"), customerId: v.number() },
//   handler: async (ctx, { userId, customerId }) => {
//     console.log("[LEMONSQUEEZY SYNC] Starting sync for user", {
//       userId,
//       customerId,
//     });

//     configureLemonSqueezy();

//     // Check if user exists in our database first
//     const user = await ctx.runQuery(
//       internal.users.getUserByUserIdInternalQuery,
//       {
//         userId,
//       }
//     );

//     if (!user) {
//       console.log(
//         "[LEMONSQUEEZY SYNC] User not found in database, skipping sync",
//         {
//           userId,
//           customerId,
//         }
//       );
//       return null;
//     }

//     try {
//       // Fetch customer data from Lemon Squeezy API
//       const customer = await getCustomer(customerId.toString());
//       if (!customer.data?.data) {
//         console.error(
//           "[LEMONSQUEEZY SYNC] Customer not found in Lemon Squeezy",
//           {
//             customerId,
//           }
//         );
//         return null;
//       }

//       console.log("[LEMONSQUEEZY SYNC] Customer found", {
//         customerId,
//         email: customer.data.data.attributes.email,
//       });

//       // Check if we have subscription data in our database
//       const existingCustomer = await ctx.runQuery(
//         internal.customer.getLSCustomerByCustomerIdInternalQuery,
//         { customerId }
//       );

//       const subscriptionId: string | undefined =
//         existingCustomer?.subscriptionId;

//       // If no subscription ID in database, this might be a new customer with no subscription
//       if (!subscriptionId) {
//         console.log(
//           "[LEMONSQUEEZY SYNC] No subscription found in database, updating customer with no subscription",
//           { customerId }
//         );

//         await ctx.runAction(
//           internal.subscriptions.upsertLSCustomerInternalAction,
//           {
//             userId: user._id,
//             customerId,
//             data: {
//               status: "none",
//               subscriptionId: undefined,
//               variantId: undefined,
//               currentPeriodStart: undefined,
//               currentPeriodEnd: undefined,
//               cancelAtPeriodEnd: undefined,
//               paymentMethod: undefined,
//             },
//           }
//         );

//         return null;
//       }

//       // Fetch detailed subscription data
//       const subscriptionData = await getSubscription(subscriptionId.toString());
//       if (!subscriptionData.data?.data) {
//         console.error(
//           "[LEMONSQUEEZY SYNC] Subscription not found in Lemon Squeezy",
//           {
//             subscriptionId,
//           }
//         );

//         // Subscription no longer exists, mark as cancelled
//         await ctx.runAction(
//           internal.subscriptions.upsertLSCustomerInternalAction,
//           {
//             userId: user._id,
//             customerId,
//             data: {
//               status: "cancelled",
//               subscriptionId: undefined,
//               variantId: undefined,
//               currentPeriodStart: undefined,
//               currentPeriodEnd: undefined,
//               cancelAtPeriodEnd: undefined,
//               paymentMethod: undefined,
//             },
//           }
//         );

//         return null;
//       }

//       const subscription = subscriptionData.data.data;
//       console.log("[LEMONSQUEEZY SYNC] Processing subscription data", {
//         subscriptionId: subscription.id,
//         status: subscription.attributes.status,
//       });

//       // Map variant IDs to tiers (you'll need to update these with your actual variant IDs)
//       const tierMap: Record<number, "starter" | "pro"> = {
//         // Add your actual Lemon Squeezy variant IDs here
//         // Example: 123456: "starter", 789012: "pro"
//       };

//       // Store complete subscription state
//       const subData = {
//         subscriptionId: subscription.id,
//         status: subscription.attributes.status,
//         variantId: subscription.attributes.variant_id,
//         currentPeriodStart: subscription.attributes.renews_at,
//         currentPeriodEnd: subscription.attributes.ends_at ?? undefined,
//         cancelAtPeriodEnd: subscription.attributes.cancelled ?? false,
//         paymentMethod: subscription.attributes.card_brand
//           ? {
//               brand: subscription.attributes.card_brand,
//               last4: subscription.attributes.card_last_four ?? undefined,
//             }
//           : undefined,
//       };

//       console.log(
//         "[LEMONSQUEEZY SYNC] Updating customer with subscription data",
//         {
//           customerId,
//           subscriptionId: subData.subscriptionId,
//           status: subData.status,
//         }
//       );

//       // Update the customer in Convex
//       await ctx.runAction(
//         internal.subscriptions.upsertLSCustomerInternalAction,
//         {
//           userId: user._id,
//           customerId,
//           data: subData,
//         }
//       );

//       return subData;
//     } catch (err) {
//       console.error("[LEMONSQUEEZY SYNC] Error syncing subscription data", err);
//       throw createAppError({
//         message: "Error syncing subscription data",
//         statusCode: "SERVER_ERROR",
//       });
//     }
//   },
// });

// // Internal action to update customer data
// export const upsertLSCustomerInternalAction = internalAction({
//   args: {
//     userId: v.id("users"),
//     customerId: v.number(),
//     data: v.object({
//       status: v.string(),
//       variantId: v.optional(v.number()),
//       subscriptionId: v.optional(v.string()),
//       currentPeriodStart: v.optional(v.string()),
//       currentPeriodEnd: v.optional(v.string()),
//       cancelAtPeriodEnd: v.optional(v.boolean()),
//       paymentMethod: v.optional(
//         v.object({
//           brand: v.optional(v.string()),
//           last4: v.optional(v.string()),
//         })
//       ),
//     }),
//   },
//   handler: async (ctx, { userId, customerId, data }) => {
//     const existingCustomer = await ctx.runQuery(
//       internal.customer.getLSCustomerByCustomerIdInternalQuery,
//       {
//         customerId,
//       }
//     );

//     if (existingCustomer) {
//       await ctx.runMutation(
//         internal.customer.updateLSCustomerInternalMutation,
//         {
//           customerId: existingCustomer._id,
//           data,
//         }
//       );
//     } else {
//       await ctx.runMutation(
//         internal.customer.createLSQCustomerInternalMutation,
//         {
//           userId,
//           customerId,
//           data,
//         }
//       );
//     }
//     return data;
//   },
// });
