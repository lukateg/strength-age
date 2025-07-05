"use server";

import { auth } from "@clerk/nextjs/server";

import { type TestFormValues } from "@/components/generate-test-form/generate-test-form";
import { type testSchema, type TestReview } from "@/lib/schemas";
import { type z } from "zod";
import { type Doc } from "convex/_generated/dataModel";

export type GeneratedTest = z.infer<typeof testSchema> & { tokensUsed: number };

export async function generateTest(
  formData: TestFormValues
): Promise<GeneratedTest> {
  try {
    const isSingleLesson = formData.lessons.length === 1;
    const endpoint = isSingleLesson
      ? "/api/generateTestFromLesson"
      : "/api/generateTestFromLessons";

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      throw new Error("Base URL is not defined");
    }
    const requestBody = {
      lessonIds: formData.lessons.map((lesson) => lesson.lessonId),
      questionAmount: formData.questionAmount,
      questionTypes: formData.questionTypes,
      difficulty: formData.difficulty,
      testName: formData.testName,
      description: formData.description,
      additionalInstructions: formData.additionalInstructions,
      ...(isSingleLesson
        ? {}
        : { questionDistribution: formData.distribution }),
    };
    const { getToken } = await auth();

    const authToken = await getToken();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      throw new Error(errorData.error ?? response.statusText);
    }

    const { response: generatedTest } = (await response.json()) as {
      response: GeneratedTest;
    };
    // Only return the fields that are expected by the Convex mutation
    return {
      title: generatedTest.title,
      description: generatedTest.description,
      questions: generatedTest.questions,
      classId: formData.classId,
      difficulty: formData.difficulty,
      questionTypes: formData.questionTypes,
      questionAmount: formData.questionAmount,
      lessons: formData.lessons.map((lesson) => ({
        lessonId: lesson.lessonId,
        lessonTitle: lesson.lessonTitle,
      })),
      additionalInstructions: formData.additionalInstructions,
      tokensUsed: generatedTest.tokensUsed,
    };
  } catch (error) {
    console.error("Error generating test:", error);
    throw error;
  }
}

export async function reviewTest(requestBody: {
  test: Doc<"tests">;
  answers: Record<string, string[]>;
}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error("Base URL is not defined");
    }
    console.log(baseUrl);
    const response = await fetch(`${baseUrl}/api/reviewTest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      throw new Error(errorData.error ?? response.statusText);
    }
    const { response: responseData } = (await response.json()) as {
      response: TestReview;
    };

    return responseData;
  } catch (error) {
    console.error("Error reviewing test:", error);
    throw error;
  }
}
