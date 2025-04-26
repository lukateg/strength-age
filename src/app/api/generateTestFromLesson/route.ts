import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { testSchema } from "@/lib/schemas";

import { type NextRequest } from "next/server";
import { type Id } from "convex/_generated/dataModel";

import { auth } from "@clerk/nextjs/server";
import { createQuizPrompt } from "@/lib/utils";
import { convertPDFToText } from "@/lib/server-utils";

// TODO: check if needed / Add this to use Node.js runtime
// export const runtime = "nodejs";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// Initialize with API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { lessonIds, questionAmount, questionTypes, difficulty } =
      (await req.json()) as {
        lessonIds?: Id<"lessons">[];
        questionAmount?: number;
        questionTypes: string[];
        difficulty: number;
      };

    if (!lessonIds || !questionAmount) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pdfs = await fetchQuery(
      api.lessons.getPDFsByLessonId,
      {
        lessonId: lessonIds[0]!,
      },
      { token }
    );

    if (!pdfs.length) {
      return Response.json(
        { error: "No PDFs found for this lesson" },
        { status: 404 }
      );
    }

    const extractionPromises = pdfs.map((pdf) => convertPDFToText(pdf));
    const extractedTexts = await Promise.all(extractionPromises);

    const successfulTexts = extractedTexts
      .filter((result): result is string => typeof result === "string")
      .join("\n\n");

    if (!successfulTexts) {
      return Response.json(
        { error: "Failed to extract text from PDFs" },
        { status: 500 }
      );
    }

    const prompt = createQuizPrompt(
      successfulTexts,
      questionTypes,
      difficulty,
      questionAmount
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
        // TODO: add schema type
        // responseSchema: testSchema,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const parsedData = JSON.parse(responseText) as Record<string, unknown>;
      const validatedData = testSchema.parse(parsedData);

      return Response.json({ response: validatedData });
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
