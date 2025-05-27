import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

import { type NextRequest } from "next/server";
import { type Id } from "convex/_generated/dataModel";

import { auth } from "@clerk/nextjs/server";
import { convertPDFToText, generateQuizForLesson } from "@/lib/server-utils";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// Initialize with API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      lessonIds,
      questionAmount,
      questionTypes,
      difficulty,
      testName,
      description,
      additionalInstructions,
    } = (await req.json()) as {
      lessonIds?: Id<"lessons">[];
      questionAmount?: number;
      questionTypes: string[];
      difficulty: number;
      testName: string;
      description: string;
      additionalInstructions?: string;
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

    const extractionPromises = pdfs.map((pdf) =>
      convertPDFToText({ fileUrl: pdf.fileUrl, _id: pdf._id })
    );
    const extractedTexts = await Promise.all(extractionPromises);

    const successfulTexts = extractedTexts.filter(
      (result): result is string => typeof result === "string"
    );

    if (!successfulTexts) {
      return Response.json(
        { error: "Failed to extract text from PDFs" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
        // TODO: add schema type
        // responseSchema: testSchema,
      },
    });
    console.log("API: Generating quiz...", testName, description);
    const quiz = await generateQuizForLesson(
      model,
      successfulTexts,
      questionTypes,
      difficulty,
      questionAmount,
      testName,
      description,
      additionalInstructions
    );
    console.log("API: Quiz generated:", quiz);

    console.log("API: Quiz generated:", quiz);
    return Response.json({ response: quiz });
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
