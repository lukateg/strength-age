import { type NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import axios from "axios";
import pdfParse from "pdf-parse";
import { type Id } from "convex/_generated/dataModel";
import { testSchema } from "@/lib/schemas";

const getFormatForType = (type: string) => {
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

// const selectedTypes = ["multiple_choice", "true_false"]; // Example from user input
// TODO: check if needed / Add this to use Node.js runtime
export const runtime = "nodejs";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// Initialize with API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { lessonId, questionAmount, questionTypes, difficulty } =
      (await req.json()) as {
        lessonId?: Id<"lessons">;
        questionAmount?: number;
        questionTypes: string[];
        difficulty: number;
      };

    if (!lessonId || !questionAmount) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pdfs = await fetchQuery(api.lessons.getPDFsByLessonId, {
      lessonId,
    });

    if (!pdfs.length) {
      return Response.json(
        { error: "No PDFs found for this lesson" },
        { status: 404 }
      );
    }

    const extractionPromises = pdfs.map(async (pdf) => {
      try {
        const response = await axios.get(pdf.fileUrl, {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf",
          },
        });

        const buffer = Buffer.from(new Uint8Array(response.data));
        if (buffer.toString("ascii", 0, 4) !== "%PDF") {
          throw new Error("Invalid PDF format");
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
    });

    const extractedTexts = await Promise.all(extractionPromises);

    // Filter out failed extractions and combine successful ones
    const successfulTexts = extractedTexts
      .filter((result): result is string => typeof result === "string")
      .join("\n\n");

    if (!successfulTexts) {
      return Response.json(
        { error: "Failed to extract text from PDFs" },
        { status: 500 }
      );
    }

    const outputExample = {
      title: "Generated or user-provided title",
      description: "Generated or user-provided description",
      questions: questionTypes.map((type) => getFormatForType(type)),
    };
    const prompt = `
    You are an AI designed to create quizzes in JSON format.
    Your task is to generate a quiz based on the provided lesson materials, ensuring the quiz adheres strictly to a predefined JSON schema.

    **Instructions:**
    1.  **Difficulty Level:** On a scale of 0 to 100, the quiz should be at the difficulty level of ${difficulty}%.
    2.  **Question Types:** The quiz should only include the following question types: ${questionTypes.join(
      ", "
    )}.
    3.  **Multiple Choice:** For multiple-choice questions, provide 4 answer options, with at least one and potentially multiple correct answers.
    4.  **True/False:**  For true/false questions, use "True" and "False" as the only answer options.
    5.  **Content:** The quiz questions must be based on the lesson content provided.
    6.  **Title and Description:**  If the user hasn't provided a title or description, generate a relevant title and description for the quiz.
    7.  **Question Count:** Generate exactly ${questionAmount} questions.

    **Example Output:**

    ${JSON.stringify(outputExample, null, 2)}

    **Lesson Materials:**

    "${successfulTexts}"
    `;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
        // TODO: add schema type
        // responseSchema: testSchema,
      },
    });

    // Generate test using Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const parsedData = JSON.parse(responseText) as Record<string, unknown>;
      const validatedData = testSchema.parse(parsedData); // Validate the parsed JSON

      return Response.json({ response: validatedData }); // Return validated data
    } catch (parseError) {
      console.error("Error parsing or validating JSON:", parseError);
      return Response.json(
        {
          error: "Failed to parse or validate the test data",
          details:
            parseError instanceof Error ? parseError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating test:", error);
    return Response.json(
      {
        error: "Failed to generate test",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
