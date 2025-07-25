import { internal } from "convex/_generated/api";
import { type ActionCtx } from "convex/_generated/server";
import { type Id } from "convex/_generated/dataModel";

export const syncLemonSqueezyDataToConvex = async ({
  ctx,
  userId,
  customerId,
  clerkId,
}: {
  ctx: ActionCtx;
  userId: Id<"users">;
  customerId: number;
  clerkId: string;
}) => {
  return await ctx.runAction(
    internal.lemonSqueezy.subscriptions
      .syncLemonSqueezyDataToConvexInternalAction,
    { userId, customerId, clerkId }
  );
};

export const processWebhookSubscriptionData = async ({
  ctx,
  data,
}: {
  ctx: ActionCtx;
  data: {
    userId: Id<"users">;
    customerId: number;
    clerkId: string;
    subscriptionId?: string;
    status?: string;
    variantId?: number;
    cardBrand?: string;
    cardLastFour?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}) => {
  return await ctx.runAction(
    internal.lemonSqueezy.subscriptions.processWebhookSubscription,
    {
      ...data,
    }
  );
};

export const updateLemonSqueezyCustomerData = async ({
  ctx,
  data,
}: {
  ctx: ActionCtx;
  data: {
    userId: Id<"users">;
    customerId: number;
    clerkId: string;
    status: string;
    variantId?: number;
    subscriptionId?: string;
    subscriptionTier?: "free" | "starter" | "pro";
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    paymentMethod?: {
      brand?: string;
      last4?: string;
    };
  };
}) => {
  return await ctx.runAction(
    internal.lemonSqueezy.subscriptions
      .updateLemonSqueezyCustomerDataInternalAction,
    {
      ...data,
    }
  );
};
