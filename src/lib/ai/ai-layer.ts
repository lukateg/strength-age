import { generateObject } from "ai";
import { generatedTestSchema } from "../schemas";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";

import { withTracing } from "@posthog/ai";
import { openai } from "@ai-sdk/openai";
import { PostHog } from "posthog-node";
import { auth } from "@clerk/nextjs/server";
import { generateWithOptionalChunking } from "./ai-utils";

import { MAX_GEMINI_TOKENS, MAX_HAIKU_TOKENS } from "./ai-constants";

export const phClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});
export const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const generateTestWithLLM = async (prompt: string) => {
  try {
    return await generateTestWithGemini15Flash(prompt);
  } catch (primaryError) {
    console.error(
      "Primary model [GEMINI 1.5 FLASH] failed, attempting fallback:",
      primaryError
    );
    try {
      console.log("Attempting fallback model [CLAUDE 3 HAiku]");
      return await generateTestWithAnthropic(prompt);
    } catch (fallbackError) {
      console.error(
        "Fallback model [CLAUDE 3 HAiku] also failed:",
        fallbackError
      );
      try {
        console.log("Attempting second fallback model [GEMINI 1.5 PRO]");
        return await generateTestWithGemini15Pro(prompt);
      } catch (anthropicError) {
        console.error(
          "Second fallback model [GEMINI 1.5 PRO] also failed:",
          anthropicError
        );
        throw primaryError;
      }
    }
  }
};

export const generateTestWithGemini15Flash = async (prompt: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const tracedGeminiModel = withTracing(
    googleAI.chat("gemini-1.5-flash"),
    phClient,
    {
      posthogDistinctId: userId,
    }
  );

  const parsedData = await generateWithOptionalChunking({
    model: tracedGeminiModel,
    prompt,
    schema: generatedTestSchema,
    maxTokens: MAX_GEMINI_TOKENS,
  });

  if (!parsedData) {
    throw new Error("Gemini model did not return a valid quiz.");
  }
  return parsedData;
};

export const generateTestWithAnthropic = async (prompt: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const tracedAnthropicModel = withTracing(
    anthropic("claude-3-haiku-20240307"),
    phClient,
    {
      posthogDistinctId: userId,
    }
  );

  return await generateWithOptionalChunking({
    prompt,
    model: tracedAnthropicModel,
    schema: generatedTestSchema,
    maxTokens: MAX_HAIKU_TOKENS,
  });
};

export const generateTestWithGemini15Pro = async (prompt: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const tracedGeminiModel = withTracing(
    googleAI.chat("gemini-1.5-pro"),
    phClient,
    {
      posthogDistinctId: userId,
    }
  );

  const parsedData = await generateWithOptionalChunking({
    model: tracedGeminiModel,
    prompt,
    schema: generatedTestSchema,
    maxTokens: MAX_GEMINI_TOKENS,
  });

  if (!parsedData) {
    throw new Error("Gemini model did not return a valid quiz.");
  }
  return parsedData;
};

// NOT USED
export const generateTestWithOpenAI = async (prompt: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const tracedOpenAIModel = withTracing(openai("gpt-4-turbo"), phClient, {
    posthogDistinctId: userId,
  });

  const { object: parsedData } = await generateObject({
    model: tracedOpenAIModel,
    prompt,
    schema: generatedTestSchema,
  });

  if (!parsedData) {
    throw new Error("OpenAI model did not return a valid quiz.");
  }
  return parsedData;
};
