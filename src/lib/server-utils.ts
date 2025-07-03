import axios from "axios";
import pdfParse from "pdf-parse";
import { generateObject } from "ai";
import { type LanguageModelV1 } from "@ai-sdk/provider";
import { createOpenAI } from "@ai-sdk/openai";

import { createQuizPrompt } from "./utils";
import { generatedTestSchema } from "./schemas";
import { ConvexError } from "convex/values";
import { auth } from "@clerk/nextjs/server";

type LessonPdf = {
  fileUrl: string;
  _id: string;
};

/**
 * Helper function to get a Convex token for server-side operations
 * @returns The Convex token or throws an error if not available
 *
 * @example
 * ```typescript
 * // Before (repeated boilerplate):
 * const { getToken } = await auth();
 * const token = await getToken({ template: "convex" });
 * if (!token) {
 *   throw new ConvexError({ message: "No Convex token available" });
 * }
 *
 * // After (clean and simple):
 * const token = await getConvexToken();
 * ```
 */
export async function getConvexToken(): Promise<string> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });

  if (!token) {
    throw new ConvexError({ message: "No Convex token available" });
  }

  return token;
}

/**
 * Helper function to get a Convex token and return null if not available
 * Useful for cases where you want to handle the missing token gracefully
 * @returns The Convex token or null if not available
 *
 * @example
 * ```typescript
 * // For cases where you want to handle missing token gracefully:
 * const token = await getConvexTokenOrNull();
 * if (!token) {
 *   return Response.json({ error: "Unauthorized" }, { status: 401 });
 * }
 * ```
 */
export async function getConvexTokenOrNull(): Promise<string | null> {
  const { getToken } = await auth();
  return await getToken({ template: "convex" });
}

// Extract PDF processing logic
export async function convertPDFToText(pdf: { fileUrl: string; _id: string }) {
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

// Extracted function to process PDFs
export async function convertPdfsToText(lessonPdfs: LessonPdf[][]) {
  return Promise.all(
    lessonPdfs.map(async (lessonPdfArray) => {
      const lessonTexts = await Promise.all(
        lessonPdfArray.map(async (pdf) => convertPDFToText(pdf))
      );
      return lessonTexts;
    })
  );
}

export async function generateQuizForLesson(
  model: LanguageModelV1,
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

  const tryGenerate = async (lm: LanguageModelV1) => {
    const { object: parsedData } = await generateObject({
      model: lm,
      prompt,
      schema: generatedTestSchema,
    });

    if (!parsedData) {
      throw new Error("Model did not return a valid quiz");
    }
    return parsedData;
  };

  try {
    // Attempt with the primary model (Gemini).
    return await tryGenerate(model);
  } catch (primaryError) {
    console.error("Primary model failed, attempting fallback:", primaryError);

    // Fallback to OpenAI GPT-3.5-turbo if API key is set.
    if (!process.env.OPENAI_API_KEY) {
      throw primaryError;
    }

    try {
      const openaiProvider = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const fallbackModel = openaiProvider.chat("gpt-3.5-turbo");
      return await tryGenerate(fallbackModel);
    } catch (fallbackError) {
      console.error("Fallback model also failed:", fallbackError);
      // Throw the original error to preserve context.
      throw primaryError;
    }
  }
}
