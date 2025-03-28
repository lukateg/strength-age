import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createTest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    userId: v.string(),
    classId: v.string(),
    questions: v.array(
      v.object({
        questionText: v.string(),
        questionType: v.string(),
        availableAnswers: v.array(v.string()),
        correctAnswer: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const testId = await ctx.db.insert("tests", {
      title: args.title,
      description: args.description,
      questions: args.questions,
      userId: args.userId,
      classId: args.classId,
    });
    return testId;
  },
});
