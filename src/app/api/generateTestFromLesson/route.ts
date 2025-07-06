import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

import { type NextRequest } from "next/server";
import { type Id } from "convex/_generated/dataModel";

import { getConvexToken } from "@/lib/server-utils";
import {
  convertMaterialToText,
  generateQuizForLesson,
  type MaterialWithMeta,
} from "../generate-test-utils";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

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

    const token = await getConvexToken();

    const data = await fetchQuery(
      api.tests.getGenerateTestFromLessonsDataQuery,
      {
        lessonIds: [lessonIds[0]!],
      },
      { token }
    );

    if (!data.canGenerateTest) {
      return Response.json(
        { error: "Not authorized to generate test" },
        { status: 403 }
      );
    }

    if (!data.materialsByLesson[0]?.length) {
      return Response.json(
        { error: "No materials found for this lesson" },
        { status: 404 }
      );
    }

    const extractionPromises = data.materialsByLesson[0].map((material) =>
      convertMaterialToText(material as MaterialWithMeta)
    );
    const extractedTexts = await Promise.all(extractionPromises);

    const successfulTexts = extractedTexts.filter(
      (result): result is string => typeof result === "string"
    );

    if (!successfulTexts) {
      return Response.json(
        { error: "Failed to extract text from materials" },
        { status: 500 }
      );
    }

    const quiz = await generateQuizForLesson(
      successfulTexts,
      questionTypes,
      difficulty,
      questionAmount,
      testName,
      description,
      additionalInstructions
    );

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
