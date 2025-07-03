import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";

import { type NextRequest } from "next/server";
import { type Test } from "@/lib/schemas";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { test, answers } = (await req.json()) as {
      test: Test;
      answers: Record<string, string[]>;
    };

    if (!test || !answers) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
    You are an AI designed to review test answers.
    Please evaluate the following test answers and determine if each answer is correct.
    Questions and answers are in the same order, so you can match them by index.
    Return the exact same test object structure but add a "isCorrect" boolean property to each question indicating if it was answered correctly.
    If the answer is incorrect, add a "feedback" property to the question object with a short explanation of why it is incorrect.
    Add the answer property to the question object with the student's answer.

    For multiple choice questions: All correct answers must be selected and no incorrect answers should be selected.
    For true/false questions: The selected answer must match the correct answer exactly.
    For short answer questions: The answer should contain the key concepts from the correct answer, but doesn't need to match exactly.

    Test Questions and Correct Answers:
    ${JSON.stringify(test.questions, null, 2)}

    Student's Answers:
    ${JSON.stringify(answers, null, 2)}
    `;

    const model = googleAI.chat("gemini-2.0-flash-lite");

    const { object: reviewedQuestions } = await generateObject({
      model,
      prompt,
      output: "no-schema",
      mode: "json",
    });

    if (!reviewedQuestions) {
      return Response.json(
        { error: "Model did not return a valid review" },
        { status: 500 }
      );
    }

    return Response.json({
      response: { ...test, questions: reviewedQuestions },
    });
  } catch (error) {
    console.error("Error reviewing test:", error);
    return Response.json(
      {
        error: "Failed to review test",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
