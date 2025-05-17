import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { toast } from "sonner";
import { isAppError } from "convex/utils";

import { type Id } from "convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toastError = (error: unknown, message: string) => {
  let errorData = message;
  if (isAppError(error)) {
    errorData = error.data.message;
  }
  toast.error(errorData);
};

// Extract prompt creation logic
export function createQuizPrompt(
  successfulTexts: string,
  questionTypes: string[],
  difficulty: number,
  questionAmount: number,
  testName?: string,
  description?: string
) {
  const outputExample = {
    title: "Generated or user-provided title",
    description: "Generated or user-provided description",
    questions: questionTypes.map((type) => getFormatForType(type)),
  };
  // Multiple Choice (Multiple Correct Answers): Each question must include 4 answer options. If there are 2 correct answers, include both correct answers and one incorrect option. The fourth option should be either "All of the above" or "None of the above" if appropriate. If "All of the above" is used, it must not be marked as correct unless all three preceding options are correct. If there are 3 correct answers, the fourth option must be "All of the above" and it should be marked as the correct answer. If none of the first three options are correct, the fourth option must be "None of the above" and it should be marked as correct. Every question must have at least 2 correct answers unless "None of the above" is the correct answer. Ensure "All of the above" or "None of the above" are used logically and only when appropriate.

  return `
    You are an AI designed to create quizzes in JSON format.
    Your task is to generate a quiz based on the provided lesson materials, ensuring the quiz adheres strictly to a predefined JSON schema.

    **Instructions:**
    1.  **Difficulty Level:** On a scale of 0% to 100%, the quiz should be at the difficulty level of ${difficulty}%.
    2.  **Question Types:** The quiz should only include the following question types: ${questionTypes.join(
      ", "
    )}.
    3.  **Question Count:** Generate exactly ${questionAmount} questions.
    4.  **Multiple Choice:** Each question must include 4 answer options. If there are 2 correct answers, include both correct answers and one incorrect option. The fourth option should be either "All of the above" or "None of the above" if appropriate. If "All of the above" is used, it must not be marked as correct unless all three preceding options are correct. If there are 3 correct answers, the fourth option must be "All of the above" and it should be marked as the correct answer. If none of the first three options are correct, the fourth option must be "None of the above" and it should be marked as correct. Every question must have at least 2 correct answers unless "None of the above" is the correct answer. Ensure "All of the above" or "None of the above" are used logically and only when appropriate.
    5.  **True/False:**  For true/false questions, use "True" and "False" as the only answer options.
    6.  **Content:** The quiz questions must be based on the lesson material provided.
    6.  **Title**  ${testName ? `Test name should be: "${testName}"` : "Generate a relevant title"}
    7.  **Description**  ${description ? `Description should be: "${description}"` : "Generate a relevant description"}

    **Example Output:**

    ${JSON.stringify(outputExample, null, 2)}

    **Lesson Materials:**

    "${successfulTexts}"
    `;
}

export const getFormatForType = (type: string) => {
  if (type === "multiple_choice") {
    return {
      questionText: "Actual question text",
      questionType: "multiple_choice",
      availableAnswers: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: ["Option A", "Option C"], // Always an array
    };
  }
  if (type === "true_false") {
    return {
      questionText: "Actual question text",
      questionType: "true_false",
      availableAnswers: ["True", "False"],
      correctAnswer: ["True"], // Always an array
    };
  }
  if (type === "short_answer") {
    return {
      questionText: "Actual question text",
      questionType: "short_answer",
      correctAnswer: ["A short sentence explaining the correct answer"],
    };
  }
  return null;
};

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

// Extracted function to calculate questions per lesson
export function calculateProportionalQuestionsPerLesson(
  questionAmount: number,
  lessonIds: Id<"lessons">[],
  filteredTexts: string[][],
  questionDistribution: "equal" | "proportional"
) {
  let questionsPerLesson: number[] = [];
  if (questionDistribution === "proportional") {
    const allTexts = filteredTexts.map((lessonTexts) =>
      lessonTexts.join("\n\n")
    );
    const totalLength = allTexts.reduce((sum, text) => sum + text.length, 0);
    questionsPerLesson = allTexts.map((text) => {
      const proportion = text.length / totalLength;
      return Math.round(questionAmount * proportion);
    });
    const totalAllocated = questionsPerLesson.reduce(
      (sum, num) => sum + num,
      0
    );
    const difference = questionAmount - totalAllocated;
    if (difference !== 0) {
      const longestLessonIndex = allTexts.findIndex(
        (text) => text.length === Math.max(...allTexts.map((t) => t.length))
      );
      if (
        longestLessonIndex !== -1 &&
        questionsPerLesson[longestLessonIndex] !== undefined
      ) {
        questionsPerLesson[longestLessonIndex] += difference;
      } else if (
        questionsPerLesson.length > 0 &&
        questionsPerLesson[0] !== undefined
      ) {
        questionsPerLesson[0] += difference;
      } else {
        console.error(
          "Unable to allocate remaining questions - invalid array state"
        );
      }
    }
  } else {
    const baseQuestionsPerLesson = Math.floor(
      questionAmount / lessonIds.length
    );
    const remainingQuestions = questionAmount % lessonIds.length;
    questionsPerLesson = lessonIds.map((_, index) =>
      index < remainingQuestions
        ? baseQuestionsPerLesson + 1
        : baseQuestionsPerLesson
    );
  }
  return questionsPerLesson;
}
