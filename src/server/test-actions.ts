"use server";
import { type TestFormValues } from "@/components/generate-test-form/generate-test-form";
import { type testSchema, type TestReview } from "@/lib/schemas";
import { type z } from "zod";
import { type Doc } from "convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";

export type GeneratedTest = z.infer<typeof testSchema>;

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
      lessonIds: formData.lessons,
      questionAmount: formData.questionAmount,
      questionTypes: formData.questionTypes,
      difficulty: formData.difficulty,
      ...(isSingleLesson
        ? {}
        : { questionDistribution: formData.distribution }),
    };
    // console.log("Request body:", requestBody);
    const { getToken } = await auth();
    const authToken = await getToken();
    // console.log("Token:", authToken);
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

    return generatedTest;
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
