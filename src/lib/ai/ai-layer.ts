import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";

import { withTracing } from "@posthog/ai";
import { openai } from "@ai-sdk/openai";
import { PostHog } from "posthog-node";
import { auth } from "@clerk/nextjs/server";

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

export const generateJSONWithLLM = async (prompt: string) => {
  try {
    console.log("Attempting primary model [GEMINI 1.5 FLASH]");
    return await generateJSONWithGemini15Flash(prompt);
  } catch (primaryError) {
    console.error(
      "Primary model [GEMINI 1.5 FLASH] failed, attempting fallback:",
      primaryError
    );
    try {
      console.log("Attempting fallback model [CLAUDE 3 HAiku]");
      return await generateJSONWithAnthropic(prompt);
    } catch (fallbackError) {
      console.error(
        "Fallback model [CLAUDE 3 HAiku] also failed:",
        fallbackError
      );
      try {
        console.log("Attempting fallback model [GEMINI 1.5 PRO]");
        return await generateJSONWithGemini15Pro(prompt);
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

export const generateJSONWithGemini15Flash = async (prompt: string) => {
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

  const parsedData = await generateObject({
    model: tracedGeminiModel,
    prompt,
    output: "no-schema",
    maxTokens: MAX_GEMINI_TOKENS,
  });

  if (!parsedData) {
    throw new Error("Gemini model did not return a valid quiz.");
  }
  return parsedData;
};

export const generateJSONWithAnthropic = async (prompt: string) => {
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

  return await generateObject({
    prompt,
    model: tracedAnthropicModel,
    output: "no-schema",
    maxTokens: MAX_HAIKU_TOKENS,
  });
};

export const generateJSONWithGemini15Pro = async (prompt: string) => {
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

  const parsedData = await generateObject({
    model: tracedGeminiModel,
    prompt,
    output: "no-schema",
    maxTokens: MAX_GEMINI_TOKENS,
  });

  if (!parsedData) {
    throw new Error("Gemini model did not return a valid quiz.");
  }
  return parsedData;
};

export const generateJSONWithOpenAI = async (prompt: string) => {
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
    output: "no-schema",
  });

  if (!parsedData) {
    throw new Error("OpenAI model did not return a valid quiz.");
  }
  return parsedData;
};
