import { type GenericMutationCtx, type GenericQueryCtx } from "convex/server";
import { type DataModel, type Doc } from "../_generated/dataModel";

export const getMonthlyUsageRecord = async (
  ctx: GenericQueryCtx<DataModel>,
  userId: string
) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const usageRecord = await ctx.db
    .query("userTokenUsage")
    .withIndex("by_user_month", (q) =>
      q.eq("userId", userId).eq("month", currentMonth)
    )
    .unique();

  return usageRecord;
};

export const incrementMonthlyUsageRecord = async (
  ctx: GenericMutationCtx<DataModel>,
  monthlyRecord: Doc<"userTokenUsage">,
  tokensUsed: number
) => {
  await ctx.db.patch(monthlyRecord._id, {
    monthlyTokensUsed: monthlyRecord.monthlyTokensUsed + tokensUsed,
  });
};

export const createMonthlyUsageRecord = async (
  ctx: GenericMutationCtx<DataModel>,
  userId: string,
  tokensUsed: number
) => {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`; // YYYY-MM format

  await ctx.db.insert("userTokenUsage", {
    userId,
    monthlyTokensUsed: tokensUsed,
    month,
  });
};

export const handleLLMTokenUsageUpdating = async (
  ctx: GenericMutationCtx<DataModel>,
  tokensUsed: number,
  userId: string
) => {
  const monthlyRecord = await getMonthlyUsageRecord(ctx, userId);

  if (monthlyRecord) {
    await incrementMonthlyUsageRecord(ctx, monthlyRecord, tokensUsed);
  } else {
    await createMonthlyUsageRecord(ctx, userId, tokensUsed);
  }
};
