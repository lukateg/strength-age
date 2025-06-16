import Stripe from "stripe";
import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  action,
  query,
} from "./_generated/server";
import { type Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { AuthenticationRequired, createAppError } from "./utils";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
  throw createAppError({ message: "Missing STRIPE_SECRET_KEY" });
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

export const handleStripeCheckout = action({
  args: {
    priceId: v.string(),
    redirectRootUrl: v.string(),
  },
  handler: async (ctx, { priceId, redirectRootUrl }): Promise<string> => {
    console.log("[STRIPE CHECKOUT] Creating checkout session", { priceId });

    const userId = await AuthenticationRequired({ ctx });
    const identity = await ctx.auth.getUserIdentity();

    const existingCustomer = await ctx.runQuery(
      internal.stripe.getStripeCustomerByUserId,
      {
        userId: userId,
      }
    );

    let existingCustomerId = existingCustomer?.stripeCustomerId;
    if (!existingCustomerId) {
      console.log(
        "[STRIPE CHECKOUT] No existing customer ID, creating new one"
      );
      const customer = await stripe.customers.create({
        email: identity?.email,
        metadata: {
          userId: userId,
        },
      });

      console.log("[STRIPE CHECKOUT] Created new customer", {
        customerId: customer.id,
      });

      await ctx.runMutation(internal.stripe.createStripeCustomer, {
        userId: userId,
        customerId: customer.id,
      });
      existingCustomerId = customer.id;
    }
    console.log("[STRIPE CHECKOUT] Existing customer ID", {
      existingCustomerId,
    });

    if (existingCustomer?.status === "active") {
      // Only allow if trying to change to a different plan
      if (existingCustomer.priceId === priceId) {
        console.log("[STRIPE CHECKOUT] Customer is already on this plan");
        throw createAppError({
          message: "You're already subscribed to this plan",
        });
      }
    }

    let checkoutSession: Stripe.Checkout.Session;
    try {
      checkoutSession = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${redirectRootUrl}/app/success?stripe_session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${redirectRootUrl}/app/pricing`,
        subscription_data: {
          metadata: {
            userId: userId,
          },
        },
        customer: existingCustomerId,
      });
      console.log("[STRIPE CHECKOUT] Created checkout session", {
        checkoutSessionId: checkoutSession.id,
      });
    } catch (err) {
      console.error("[STRIPE CHECKOUT] Error creating checkout session", err);
      throw createAppError({ message: "Failed to create checkout session" });
    }
    if (!checkoutSession.url) {
      console.error("Failed to create checkout session");
      throw createAppError({ message: "Failed to create checkout session" });
    }

    console.log("[STRIPE CHECKOUT] Checkout session URL", {
      checkoutSessionUrl: checkoutSession.url,
    });

    return checkoutSession.url;
  },
});

export const triggerStripeSyncForUser = action({
  args: {},
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });
    const stripeCustomer = await ctx.runQuery(
      internal.stripe.getStripeCustomerByUserId,
      { userId }
    );
    if (!stripeCustomer) {
      throw createAppError({ message: "No stripe customer found" });
    }

    await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
      customerId: stripeCustomer.stripeCustomerId,
    });
  },
});

export const handleStripeWebhook = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, { signature, payload }) => {
    console.log("[STRIPE WEBHOOK] Handling webhook request", { signature });
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
      const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret
      );
      console.log("[STRIPE WEBHOOK] Constructed event", { type: event.type });

      // List of events we want to track
      const allowedEvents = [
        "checkout.session.completed",
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
        "customer.subscription.paused",
        "customer.subscription.resumed",
        "customer.subscription.pending_update_applied",
        "customer.subscription.pending_update_expired",
        "customer.subscription.trial_will_end",
        "invoice.paid",
        "invoice.payment_failed",
        "invoice.payment_action_required",
        "invoice.upcoming",
        "invoice.marked_uncollectible",
        "invoice.payment_succeeded",
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
        "payment_intent.canceled",
      ];

      if (!allowedEvents.includes(event.type)) {
        console.log("[STRIPE WEBHOOK] Ignoring untracked event type", {
          type: event.type,
        });
        return { success: true, message: "Event type not tracked" };
      }

      // All the events we track have a customerId
      const { customer: customerId } = event.data.object as {
        customer: string;
      };

      if (typeof customerId !== "string") {
        console.error("[STRIPE WEBHOOK] Invalid customer ID", {
          customerId,
          eventType: event.type,
        });
        throw new Error(
          `[STRIPE HOOK] Customer ID isn't string.\nEvent type: ${event.type}`
        );
      }

      console.log("[STRIPE WEBHOOK] Processing event", {
        customerId,
        type: event.type,
      });

      // Sync the customer's data to Convex using the internal action
      await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
        customerId,
      });

      console.log("[STRIPE WEBHOOK] Successfully processed event", {
        type: event.type,
      });
      return { success: true, message: "Event processed successfully" };
    } catch (err) {
      console.error("[STRIPE WEBHOOK] Error processing event", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },
});

// Public action to sync subscription data
export const syncStripeDataToConvex = internalAction({
  args: { customerId: v.string() },
  handler: async (
    ctx,
    { customerId }
  ): Promise<
    | {
        subscriptionId: string;
        status: string;
        priceId?: string;
        currentPeriodEnd?: number;
        currentPeriodStart?: number;
        cancelAtPeriodEnd?: boolean;
        paymentMethod?: {
          brand?: string;
          last4?: string;
        };
      }
    | undefined
  > => {
    console.log("[STRIPE SYNC] Starting sync for customer", { customerId });

    // Fetch latest subscription data from Stripe
    const subscriptions = await ctx.runAction(
      internal.stripe.fetchLatestSubscriptionFromStripe,
      {
        customerId,
      }
    );
    console.log("[STRIPE SYNC] Fetched subscriptions", {
      count: subscriptions.length,
    });

    if (subscriptions.length === 0) {
      console.log(
        "[STRIPE SYNC] No subscriptions found, updating customer with no subscription",
        { customerId }
      );
      // Update customer with no subscription
      await ctx.runAction(internal.stripe.updateCustomerData, {
        customerId,
        data: {
          status: "none",
          subscriptionId: undefined,
          priceId: undefined,
          currentPeriodStart: undefined,
          currentPeriodEnd: undefined,
          cancelAtPeriodEnd: undefined,
          paymentMethod: undefined,
        },
      });

      // Update user's subscription tier to none
      const stripeCustomer = await ctx.runQuery(
        internal.stripe.getStripeCustomer,
        {
          customerId,
        }
      );
      if (stripeCustomer) {
        const user = await ctx.runQuery(internal.users.getUserByClerkId, {
          clerkId: stripeCustomer.userId,
        });
        if (user) {
          await ctx.runMutation(internal.users.updateUser, {
            userId: user._id,
            data: { subscriptionTier: "free" },
          });
        }
      }
      return;
    }

    // If a user can have multiple subscriptions, that's your problem
    const subscription = subscriptions[0];
    if (!subscription) {
      console.error("[STRIPE SYNC] No subscription found despite having data", {
        customerId,
      });
      throw new Error("No subscription found");
    }

    console.log("[STRIPE SYNC] Processing subscription data", {
      subscriptionId: subscription.id,
      status: subscription.status,
    });

    // Map price IDs to tiers
    const tierMap: Record<string, "starter" | "pro"> = {
      [process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!]: "starter",
      [process.env.STRIPE_STARTER_YEARLY_PRICE_ID!]: "starter",
      [process.env.STRIPE_PRO_MONTHLY_PRICE_ID!]: "pro",
      [process.env.STRIPE_PRO_YEARLY_PRICE_ID!]: "pro",
    };

    // Store complete subscription state
    const subData = {
      subscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id,
      currentPeriodEnd: subscription.items.data[0]?.current_period_end,
      currentPeriodStart: subscription.items.data[0]?.current_period_start,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      paymentMethod:
        subscription.default_payment_method &&
        typeof subscription.default_payment_method !== "string"
          ? {
              brand:
                subscription.default_payment_method.card?.brand ?? undefined,
              last4:
                subscription.default_payment_method.card?.last4 ?? undefined,
            }
          : undefined,
    };

    console.log("[STRIPE SYNC] Updating customer with subscription data", {
      customerId,
      subscriptionId: subData.subscriptionId,
      status: subData.status,
    });

    // Update the customer in Convex
    await ctx.runAction(internal.stripe.updateCustomerData, {
      customerId,
      data: subData,
    });

    // Update user's subscription tier
    const stripeCustomer = await ctx.runQuery(
      internal.stripe.getStripeCustomer,
      {
        customerId,
      }
    );
    if (stripeCustomer) {
      const user = await ctx.runQuery(internal.users.getUserByClerkId, {
        clerkId: stripeCustomer.userId,
      });
      if (user) {
        const tier = subData.priceId
          ? (tierMap[subData.priceId] ?? "free")
          : "free";
        await ctx.runMutation(internal.users.updateUser, {
          userId: user._id,
          data: { subscriptionTier: tier },
        });
      }
    }

    return subData;
  },
});

// Internal action to fetch subscription data
export const fetchLatestSubscriptionFromStripe = internalAction({
  args: { customerId: v.string() },
  handler: async (ctx, { customerId }): Promise<Stripe.Subscription[]> => {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: "all",
        expand: ["data.default_payment_method"],
      });
      return subscriptions.data;
    } catch (err) {
      console.error("[STRIPE SYNC] Error fetching latest subscription", err);
      throw new Error("Error fetching latest subscription");
    }
  },
});

// Internal action to update customer data
export const updateCustomerData = internalAction({
  args: {
    customerId: v.string(),
    data: v.object({
      status: v.string(),
      subscriptionId: v.optional(v.string()),
      priceId: v.optional(v.string()),
      currentPeriodEnd: v.optional(v.number()),
      currentPeriodStart: v.optional(v.number()),
      cancelAtPeriodEnd: v.optional(v.boolean()),
      paymentMethod: v.optional(
        v.object({
          brand: v.optional(v.string()),
          last4: v.optional(v.string()),
        })
      ),
    }),
  },
  handler: async (ctx, { customerId, data }) => {
    const stripeCustomer = await ctx.runQuery(
      internal.stripe.getStripeCustomer,
      {
        customerId,
      }
    );

    if (!stripeCustomer) {
      throw new Error(`No stripe customer found for customerId: ${customerId}`);
    }

    await ctx.runMutation(internal.stripe.updateStripeCustomer, {
      customerId: stripeCustomer._id,
      data,
    });
    return data;
  },
});

// Internal query to get stripe customer
export const getStripeCustomer = internalQuery({
  args: { customerId: v.string() },
  handler: async (
    ctx,
    { customerId }
  ): Promise<{
    _id: Id<"stripeCustomers">;
    _creationTime: number;
    userId: string;
    stripeCustomerId: string;
    status?: string;
    subscriptionId?: string;
    priceId?: string;
    currentPeriodEnd?: number;
    currentPeriodStart?: number;
    cancelAtPeriodEnd?: boolean;
    paymentMethod?: {
      brand?: string;
      last4?: string;
    };
  } | null> => {
    return await ctx.db
      .query("stripeCustomers")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", customerId)
      )
      .first();
  },
});

export const getStripeCustomerByUserId = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const customer = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return customer;
  },
});

export const createStripeCustomer = internalMutation({
  args: {
    userId: v.string(),
    customerId: v.string(),
  },
  handler: async (ctx, { userId, customerId }) => {
    await ctx.db.insert("stripeCustomers", {
      userId,
      stripeCustomerId: customerId,
    });
  },
});

// Internal mutation to update stripe customer
export const updateStripeCustomer = internalMutation({
  args: {
    customerId: v.id("stripeCustomers"),
    data: v.object({
      status: v.string(),
      subscriptionId: v.optional(v.string()),
      priceId: v.optional(v.string()),
      currentPeriodEnd: v.optional(v.number()),
      currentPeriodStart: v.optional(v.number()),
      cancelAtPeriodEnd: v.optional(v.boolean()),
      paymentMethod: v.optional(
        v.object({
          brand: v.optional(v.string()),
          last4: v.optional(v.string()),
        })
      ),
    }),
  },
  handler: async (ctx, { customerId, data }) => {
    await ctx.db.patch(customerId, data);
    return data;
  },
});

// Query to get subscription status
export const getSubscriptionStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw createAppError({ message: "Not authenticated" });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw createAppError({ message: "User not found" });
    }

    const stripeCustomer = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!stripeCustomer) {
      return {
        status: "none",
        tier: "none",
        priceId: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    // Map price IDs to tiers
    const tierMap: Record<string, "starter" | "pro"> = {
      [process.env.STRIPE_STARTER_PRICE_ID!]: "starter",
      [process.env.STRIPE_PRO_PRICE_ID!]: "pro",
    };

    return {
      status: stripeCustomer.status,
      tier: stripeCustomer.priceId
        ? (tierMap[stripeCustomer.priceId] ?? "none")
        : "none",
      priceId: stripeCustomer.priceId,
      currentPeriodEnd: stripeCustomer.currentPeriodEnd,
      cancelAtPeriodEnd: stripeCustomer.cancelAtPeriodEnd,
      paymentMethod: stripeCustomer.paymentMethod,
    };
  },
});
