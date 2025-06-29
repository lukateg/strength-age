import { AuthenticationRequired, createAppError } from "convex/utils";
import { query } from "../_generated/server";
import { userByClerkId } from "../models/userModel";
import { stripeCustomerByUserId } from "convex/models/stripeModel";
import { hasPermission } from "convex/models/permissionsModel";

export const getSubscriptionPageData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const user = await userByClerkId(ctx, userId);

    const stripeCustomer = await stripeCustomerByUserId(ctx, userId);

    if (!stripeCustomer) {
      throw createAppError({
        message: "Stripe customer not found",
        statusCode: "NOT_FOUND",
      });
    }

    const canViewStripeCustomer = await hasPermission(
      ctx,
      userId,
      "stripeCustomers",
      "view",
      stripeCustomer
    );

    if (!canViewStripeCustomer) {
      throw createAppError({
        message: "You are not authorized to view this stripe customer",
        statusCode: "PERMISSION_DENIED",
      });
    }

    return {
      user,
      stripeCustomer,
    };
  },
});
