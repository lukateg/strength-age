import { type TestQuestion } from "@/app/app/tests/[testId]/page";
import { type Id, type Doc } from "convex/_generated/dataModel";
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

export const addLessonMaterialsSchema = (showExistingMaterials: boolean) =>
  z.object({
    lessonId: z.custom<Id<"lessons">>(),
    materialsToAdd: showExistingMaterials
      ? z
          .array(z.custom<Id<"pdfs">>())
          .min(1, "Please select at least one material")
      : z.array(z.custom<Id<"pdfs">>()),
    materialsToUpload: !showExistingMaterials
      ? z.array(z.instanceof(File)).min(1, "Please upload at least one file")
      : z.array(z.instanceof(File)),
  });

export const createLessonSchema = z.object({
  title: z
    .string()
    .min(1, "Lesson title is required")
    .max(50, "Lesson title cannot be longer than 50 characters"),
  description: z
    .string()
    .max(200, "Lesson description cannot be longer than 200 characters")
    .optional(),
  materialsToUpload: z.array(z.instanceof(File)),
  materialsToAdd: z.array(z.custom<Id<"pdfs">>()),
  showExistingMaterials: z.boolean(),
});

export const generatedTestSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema).min(1), // Ensure at least one question
});

export const testSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema).min(1), // Ensure at least one question
  classId: z.custom<Id<"classes">>((val) => val !== undefined && val !== ""),
  difficulty: z.number().min(0).max(100),
  questionTypes: z
    .array(z.enum(["multiple_choice", "true_false", "short_answer"]))
    .min(1, "Select at least one question type"),
  lessons: z
    .array(
      z.object({
        lessonId: z.custom<Id<"lessons">>(
          (val) => val !== undefined && val !== ""
        ),
        lessonTitle: z.string(),
      })
    )
    .min(1, "Select at least one lesson"),
  questionAmount: z.number().min(1),
  additionalInstructions: z.string().optional(),
});

export const testReviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(reviewQuestionSchema).min(1), // Using review question schema
  testId: z.custom<Id<"tests">>((val) => val !== undefined && val !== ""),
});

export const testFormSchema = z.object({
  testName: z.string(),
  description: z.string(),
  classId: z.custom<Id<"classes">>((val) => val !== undefined && val !== ""),
  scope: z.enum(["single", "multiple", "whole"]),
  distribution: z.enum(["equal", "proportional"]),
  questionAmount: z.number().min(1),
  difficulty: z.number().min(0).max(100),
  additionalInstructions: z.string().optional(),
  questionTypes: z
    .array(z.enum(["multiple_choice", "true_false", "short_answer"]))
    .min(1, "Select at least one question type"),
  lessons: z
    .array(
      z.object({
        lessonId: z.custom<Id<"lessons">>(
          (val) => val !== undefined && val !== ""
        ),
        lessonTitle: z.string(),
      })
    )
    .min(1, "Select at least one lesson"),
});

export const createAnswerSchema = (test: Doc<"tests"> | undefined | null) => {
  if (!test) return z.object({});

  const answerFields: Record<string, z.ZodTypeAny> = {};

  test.questions.forEach((question: TestQuestion, index: number) => {
    switch (question.questionType) {
      case "true_false":
      case "short_answer":
        answerFields[`question-${index}`] = z
          .string({
            required_error: "Answer is required",
          })
          .min(1, { message: "Answer is required" });
        break;
      case "multiple_choice":
        answerFields[`question-${index}`] = z
          .array(z.string(), {
            required_error: "Select at least one answer",
          })
          .min(1, { message: "Select at least one answer" });
        break;
    }
  });

  return z.object(answerFields);
};

export type Test = z.infer<typeof testSchema>;
export type Question = z.infer<typeof questionSchema>;
export type TestReview = z.infer<typeof testReviewSchema>;
