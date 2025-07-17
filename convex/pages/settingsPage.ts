import { AuthenticationRequired, createAppError } from "convex/utils";
import { query } from "../_generated/server";
import { userByClerkId } from "../models/userModel";
import { stripeCustomerByUserId } from "convex/models/stripeModel";

export const getSubscriptionPageData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const user = await userByClerkId(ctx, userId);
    const stripeCustomer = await stripeCustomerByUserId(ctx, userId);

    return {
      user,
      stripeCustomer,
    };
  },
});

export const getTestSettingsPageData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const user = await userByClerkId(ctx, userId);

    if (!user) {
      throw createAppError({
        message: "User not found",
        statusCode: "NOT_FOUND",
      });
    }

    return { userPreferences: user.userPreferences };
  },
});
