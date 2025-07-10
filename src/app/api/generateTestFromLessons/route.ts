import { api } from "../../../../convex/_generated/api";
import { getConvexToken } from "@/lib/server-utils";

import { fetchQuery } from "convex/nextjs";
import {
  calculateProportionalQuestionsPerLesson,
  shuffleArray,
  generateQuizForLesson,
  convertManyMaterialsToText,
  type MaterialWithMeta,
} from "../generate-test-utils";

import { type NextRequest } from "next/server";
import { type Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

interface RequestBody {
  lessonIds?: Id<"lessons">[];
  questionAmount?: number;
  questionTypes: string[];
  difficulty: number;
  questionDistribution: "equal" | "proportional";
  testName: string;
  description: string;
  additionalInstructions?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const {
      lessonIds,
      questionAmount,
      questionTypes,
      difficulty,
      questionDistribution,
      testName,
      description,
      additionalInstructions,
    } = (await req.json()) as RequestBody;

    if (!lessonIds?.length || !questionAmount) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Authenticate request
    const token = await getConvexToken();

    const { materialsByLesson, canGenerateTest } = await fetchQuery(
      api.tests.getGenerateTestFromLessonsDataQuery,
      { lessonIds },
      { token }
    );

    if (!canGenerateTest) {
      return Response.json(
        { error: "You need to upgrade to generate tests." },
        { status: 403 }
      );
    }

    const extractedTexts = await convertManyMaterialsToText(
      materialsByLesson as MaterialWithMeta[][]
    );
    if (!extractedTexts.length) {
      return Response.json(
        { error: "Failed to extract text from materials" },
        { status: 500 }
      );
    }

    // Filter and validate extracted text
    const filteredTexts = extractedTexts
      .map((lessonTexts) =>
        lessonTexts.filter(
          (text): text is string => typeof text === "string" && text.length > 0
        )
      )
      .filter((lessonTexts) => lessonTexts.length > 0);

    if (!filteredTexts.length) {
      return Response.json(
        { error: "No valid text content found in materials" },
        { status: 500 }
      );
    }

    // Calculate questions per lesson
    const questionsPerLesson = calculateProportionalQuestionsPerLesson(
      questionAmount,
      lessonIds,
      filteredTexts,
      questionDistribution
    );

    // Generate quizzes for each lesson
    const aiResponses = await Promise.all(
      filteredTexts.map((lessonTexts, index) => {
        const questionCount = questionsPerLesson[index];
        if (!questionCount) return null;

        return generateQuizForLesson(
          lessonTexts,
          questionTypes,
          difficulty,
          questionCount,
          testName,
          description,
          additionalInstructions
        );
      })
    );

    const successfulResponses = aiResponses.filter(
      (response): response is NonNullable<typeof response> => response !== null
    );

    // Sum token usage from all successful responses
    const totalTokensUsed = successfulResponses.reduce((sum, resp) => {
      return sum + ((resp as { tokensUsed?: number }).tokensUsed ?? 0);
    }, 0);

    if (!successfulResponses.length) {
      return Response.json(
        { error: "Failed to generate any valid quizzes" },
        { status: 500 }
      );
    }

    // Combine and shuffle questions
    const allQuestions = successfulResponses.flatMap(
      (response) => response?.questions ?? []
    );

    const combinedTest = {
      title: testName,
      description: description,
      questions: shuffleArray(allQuestions),
      tokensUsed: totalTokensUsed,
    };

    return Response.json({ response: combinedTest });
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
