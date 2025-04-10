import { Id } from "convex/_generated/dataModel";
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

// Add review-specific fields to each question type
export const reviewMultipleChoiceSchema = multipleChoiceSchema.extend({
  isCorrect: z.boolean(),
  answer: z.array(z.string()),
  feedback: z.string().optional(),
});

export const reviewTrueFalseSchema = trueFalseSchema.extend({
  isCorrect: z.boolean(),
  answer: z.array(z.string()),
  feedback: z.string().optional(),
});

export const reviewShortAnswerSchema = shortAnswerSchema.extend({
  isCorrect: z.boolean(),
  answer: z.array(z.string()),
  feedback: z.string().optional(),
});

export const reviewQuestionSchema = z.union([
  reviewMultipleChoiceSchema,
  reviewTrueFalseSchema,
  reviewShortAnswerSchema,
]);

export const testSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema).min(1), // Ensure at least one question
});

export const testReviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(reviewQuestionSchema).min(1), // Using review question schema
  testId: z.string(),
});

export const testFormSchema = z.object({
  testName: z.string(),
  description: z.string(),
  classId: z.custom<Id<"classes">>((val) => val !== undefined && val !== ""),
  scope: z.enum(["single", "multiple", "whole"]),
  distribution: z.enum(["equal", "proportional"]),
  questionAmount: z.number().min(1),
  difficulty: z.number().min(0).max(100),
  questionTypes: z
    .array(z.string())
    .min(1, "Select at least one question type"),
  lessonQuestions: z.record(z.string(), z.number()),
  lessons: z.array(z.string()).min(1, "Select at least one lesson"),
});

export type Test = z.infer<typeof testSchema>;
export type Question = z.infer<typeof questionSchema>;
export type TestReview = z.infer<typeof testReviewSchema>;
