import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

import {
  calculateProportionalQuestionsPerLesson,
  shuffleArray,
} from "@/lib/utils";
import { convertPdfsToText, generateQuizForLesson } from "@/lib/server-utils";
import { getConvexToken } from "@/lib/server-utils";

import { type NextRequest } from "next/server";
import { type Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

export const runtime = "nodejs";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const { pdfsByLesson, canGenerateTest } = await fetchQuery(
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

    const extractedTexts = await convertPdfsToText(pdfsByLesson);
    if (!extractedTexts.length) {
      return Response.json(
        { error: "Failed to extract text from PDFs" },
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
        { error: "No valid text content found in PDFs" },
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Generate quizzes for each lesson
    const aiResponses = await Promise.all(
      filteredTexts.map((lessonTexts, index) => {
        const questionCount = questionsPerLesson[index];
        if (!questionCount) return null;

        return generateQuizForLesson(
          model,
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
