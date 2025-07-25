import { AuthenticationRequired, createAppError } from "convex/utils";
import { query } from "../_generated/server";
import { userByClerkId } from "../models/userModel";
import { getCustomerByUserId } from "convex/models/lemonModel";

export const getSubscriptionPageData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    const user = await userByClerkId(ctx, userId);
    const customer = await getCustomerByUserId(ctx, userId);

    return {
      user,
      customer,
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
