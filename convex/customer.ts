import { internal } from "./_generated/api";
import { type ActionCtx } from "./_generated/server";
import { type Id } from "./_generated/dataModel";

export const getLemonSqueezyCustomerByCustomerId = async ({
  ctx,
  customerId,
}: {
  ctx: ActionCtx;
  customerId: number;
}) => {
  return await ctx.runQuery(
    internal.lemonSqueezy.subscriptions
      .getLemonSqueezyCustomerByCustomerIdInternalQuery,
    {
      customerId,
    }
  );
};

export const getLemonSqueezyCustomerByUserId = async ({
  ctx,
  userId,
}: {
  ctx: ActionCtx;
  userId: Id<"users">;
}) => {
  return await ctx.runQuery(
    internal.lemonSqueezy.subscriptions
      .getLemonSqueezyCustomerByUserIdInternalQuery,
    {
      userId,
    }
  );
};

export const createLemonSqueezyCustomer = async ({
  ctx,
  data,
}: {
  ctx: ActionCtx;
  data: {
    userId: Id<"users">;
    clerkId: string;
    customerId: number;
    status: string;
    subscriptionId?: string;
    variantId?: number;
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
  return await ctx.runMutation(
    internal.lemonSqueezy.subscriptions
      .createLemonSqueezyCustomerInternalMutation,
    {
      ...data,
    }
  );
};

export const updateLemonSqueezyCustomer = async ({
  ctx,
  data,
}: {
  ctx: ActionCtx;
  data: {
    _id: Id<"lemonSqueezyCustomers">;
    status: string;
    subscriptionId?: string;
    variantId?: number;
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
  await ctx.runMutation(
    internal.lemonSqueezy.subscriptions
      .updateLemonSqueezyCustomerInternalMutation,
    {
      ...data,
    }
  );
};
