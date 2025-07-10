import { type Id } from "convex/_generated/dataModel";
import axios from "axios";
import pdfParse from "pdf-parse";
import { ConvexError } from "convex/values";
import { generateTestWithLLM } from "@/lib/ai/ai-layer";
// import { countTokens } from "@anthropic-ai/tokenizer";

const TOKEN_CHAR_RATIO = 4; // rough estimate ~4 chars per token

const approxTokenCount = (text: string) =>
  Math.ceil(text.length / TOKEN_CHAR_RATIO);

export async function generateQuizForLesson(
  lessonTexts: string[],
  questionTypes: string[],
  difficulty: number,
  questionCount: number,
  testName: string,
  description: string,
  additionalInstructions?: string
) {
  const combinedText = lessonTexts.join("\n\n");
  const prompt = createQuizPrompt(
    combinedText,
    questionTypes,
    difficulty,
    questionCount,
    testName,
    description,
    additionalInstructions
  );

  const quiz = await generateTestWithLLM(prompt);

  // Estimate token usage from prompt and model output
  const tokensUsed = approxTokenCount(prompt);

  // Return quiz data along with token usage
  return { ...quiz, tokensUsed } as typeof quiz & { tokensUsed: number };
}

// Extract prompt creation logic
export function createQuizPrompt(
  successfulTexts: string,
  questionTypes: string[],
  difficulty: number,
  questionAmount: number,
  testName?: string,
  description?: string,
  additionalInstructions?: string
) {
  // Calculate expected distribution for example
  const exampleQuestions: ReturnType<typeof getFormatForType>[] = [];
  questionTypes.forEach((type, index) => {
    const baseQuestions = Math.floor(questionAmount / questionTypes.length);
    const extraQuestion = index < questionAmount % questionTypes.length ? 1 : 0;
    const totalQuestions = baseQuestions + extraQuestion;

    for (let i = 0; i < totalQuestions; i++) {
      const questionFormat = getFormatForType(type);
      if (questionFormat) {
        exampleQuestions.push(questionFormat);
      }
    }
  });

  const outputExample = {
    title: "Generated or user-provided title",
    description: "Generated or user-provided description",
    questions: exampleQuestions,
  };
  // Multiple Choice (Multiple Correct Answers): Each question must include 4 answer options. If there are 2 correct answers, include both correct answers and one incorrect option. The fourth option should be either "All of the above" or "None of the above" if appropriate. If "All of the above" is used, it must not be marked as correct unless all three preceding options are correct. If there are 3 correct answers, the fourth option must be "All of the above" and it should be marked as the correct answer. If none of the first three options are correct, the fourth option must be "None of the above" and it should be marked as correct. Every question must have at least 2 correct answers unless "None of the above" is the correct answer. Ensure "All of the above" or "None of the above" are used logically and only when appropriate.

  // Calculate distribution for clear instruction
  const distributionInstructions = questionTypes
    .map((type, index) => {
      const baseQuestions = Math.floor(questionAmount / questionTypes.length);
      const extraQuestion =
        index < questionAmount % questionTypes.length ? 1 : 0;
      const totalQuestions = baseQuestions + extraQuestion;
      return `${totalQuestions} ${type} questions`;
    })
    .join(", ");

  return `
      Create a quiz with exactly ${questionAmount} questions total.
      
      QUESTION TYPE DISTRIBUTION REQUIREMENT:
      You must create exactly: ${distributionInstructions}
      
      This distribution is mandatory. Do not create more or fewer questions of any type.
      
      Instructions:
      1. Generate exactly ${questionAmount} questions total
      2. Use only these question types: ${questionTypes.join(", ")}
      3. Follow the exact distribution above: ${distributionInstructions}
      4. Difficulty level: ${difficulty}%
      5. Multiple Choice: Each question must include 4 answer options. If there are 2 correct answers, include both correct answers and one incorrect option. The fourth option should be either "All of the above" or "None of the above" if appropriate. If "All of the above" is used, it must not be marked as correct unless all three preceding options are correct. If there are 3 correct answers, the fourth option must be "All of the above" and it should be marked as the correct answer. If none of the first three options are correct, the fourth option must be "None of the above" and it should be marked as correct. Every question must have at least 2 correct answers unless "None of the above" is the correct answer. Ensure "All of the above" or "None of the above" are used logically and only when appropriate.
      6. True/False: Use "True" and "False" as the only answer options
      7. Base questions on the lesson material provided
      8. Title: ${testName ? `"${testName}"` : "Generate a relevant title"}
      9. Description: ${description ? `"${description}"` : "Generate a relevant description"}
      ${additionalInstructions ? `10. Additional instructions: ${additionalInstructions}` : ""}
  
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

// Extract PDF processing logic
export async function convertPdfToText(pdf: { fileUrl: string; _id: string }) {
  try {
    const response = await axios.get(pdf.fileUrl, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });

    const buffer = Buffer.from(new Uint8Array(response.data));
    if (buffer.toString("ascii", 0, 4) !== "%PDF") {
      throw new ConvexError({ message: "Invalid PDF format" });
    }

    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error(`Error processing PDF ${pdf._id}:`, error);
    return {
      pdfId: pdf._id,
      text: "",
      error: "Failed to process PDF",
    };
  }
}

// Utility to fetch text from a TXT file URL
async function fetchTxtFile(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        Accept: "text/plain",
      },
    });

    // Convert ArrayBuffer to UTF-8 string
    return Buffer.from(response.data).toString("utf8");
  } catch (error) {
    console.error(`Error fetching TXT file ${url}:`, error);
    return "";
  }
}

export type MaterialWithMeta = {
  _id: string;
  fileUrl: string;
  fileType: "pdf" | "txt";
};

// Refactor: generic converter that understands the material type
export async function convertMaterialToText(material: MaterialWithMeta) {
  if (material.fileType === "txt") {
    return fetchTxtFile(material.fileUrl);
  }
  // Default / pdf case
  return convertPdfToText({ fileUrl: material.fileUrl, _id: material._id });
}

// Batch converter preserving original lesson grouping
export async function convertManyMaterialsToText(
  lessonMaterials: MaterialWithMeta[][]
) {
  return Promise.all(
    lessonMaterials.map(async (materialsForLesson) => {
      const texts = await Promise.all(
        materialsForLesson.map((m) => convertMaterialToText(m))
      );
      return texts;
    })
  );
}

// Extracted function to process PDFs
export async function convertManyPdfsToText(
  lessonPdfs: {
    fileUrl: string;
    _id: string;
  }[][]
) {
  // Preserve backwards compatibility by delegating to the new generic implementation
  const mapped: MaterialWithMeta[][] = lessonPdfs.map((lessonPdfArray) =>
    lessonPdfArray.map((pdf) => ({
      ...pdf,
      fileType: "pdf",
    }))
  );
  return convertManyMaterialsToText(mapped);
}
