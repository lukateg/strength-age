import { GoogleGenerativeAI } from "@google/generative-ai";

import { type NextRequest } from "next/server";
import { type Test } from "@/lib/schemas";
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    console.log(prompt, "prompt");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log(responseText, "response text");

    try {
      const reviewedTest = JSON.parse(responseText) as Record<string, unknown>;
      // TODO: add schema validation
      console.log(reviewedTest, "reviewed test");
      return Response.json({
        response: { ...test, questions: reviewedTest },
      });
    } catch (parseError) {
      console.error("Error parsing review results:", parseError);
      return Response.json(
        {
          error: "Failed to parse the review results",
          details:
            parseError instanceof Error ? parseError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
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
