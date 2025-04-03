import { z } from "zod";

// Zod schemas for data validation
export const multipleChoiceSchema = z.object({
  questionText: z.string(),
  questionType: z.literal("multiple_choice"),
  availableAnswers: z.array(z.string()).min(2), // Ensure at least two options
  correctAnswer: z.array(z.string()).min(1), // Ensure at least one correct answer
});

export const trueFalseSchema = z.object({
  questionText: z.string(),
  questionType: z.literal("true_false"),
  availableAnswers: z.array(z.literal("True").or(z.literal("False"))).length(2), // Exactly two options: "True" and "False"
  correctAnswer: z.array(z.literal("True").or(z.literal("False"))).min(1), // At least one correct answer, either "True" or "False"
});

export const shortAnswerSchema = z.object({
  questionText: z.string(),
  questionType: z.literal("short_answer"),
  correctAnswer: z.array(z.string()).length(1), //  Exactly one correct answer
});

export const questionSchema = z.union([
  multipleChoiceSchema,
  trueFalseSchema,
  shortAnswerSchema,
]);

export const testSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema).min(1), // Ensure at least one question
});
