import { generateObject, type LanguageModelV1 } from "ai";
import { type generatedTestSchema } from "../schemas";

const TOKEN_CHAR_RATIO = 4; // rough estimate ~4 chars per token

const approxTokenCount = (text: string) =>
  Math.ceil(text.length / TOKEN_CHAR_RATIO);

// Helper to split long strings into smaller chunks based on character length
const splitStringByLength = (str: string, maxLen: number): string[] => {
  const parts: string[] = [];
  for (let i = 0; i < str.length; i += maxLen) {
    parts.push(str.slice(i, i + maxLen));
  }
  return parts;
};

interface ChunkedGenerationOptions<T extends { questions: unknown[] }> {
  prompt: string;
  model: LanguageModelV1;
  schema: typeof generatedTestSchema;
  maxTokens: number;
  headerMarker?: string; // defaults to "**Lesson Materials:**"
}

/**
 * Generate a schema-validated result while keeping the input within the model's
 * context window.
 *
 * 1. If the prompt's estimated token count ≤ maxTokens –> call the model once.
 *    • Example: prompt ≈ 150 000 tokens, limit = 200 000 –> single call.
 *
 * 2. If the prompt is longer –> split the portion _after_ `headerMarker` into
 *    character-length chunks so that each chunk + header stays ≤ maxTokens.
 *    • Example: prompt ≈ 600 000 tokens, limit 200 000.
 *      → header ≈ 10 000 tokens, remaining materials ≈ 590 000 tokens.
 *      → available per chunk ≈ 190 000 tokens.
 *      → number of chunks ≈ ceil(590 000 / 190 000) = **4** chunks.
 *      → We make 4 model calls and merge their `questions` arrays.
 *
 * The helper is **universal**: pass any LanguageModelV1 implementation (Gemini,
 * Claude, OpenAI…) plus its max context size and schema. Only assumption: the
 * schema has a `questions` field (array) so we can merge chunked results.
 */
export const generateWithOptionalChunking = async <
  T extends { questions: unknown[] },
>({
  prompt,
  model,
  schema,
  maxTokens,
  headerMarker = "**Lesson Materials:**",
}: ChunkedGenerationOptions<T>): Promise<T> => {
  // Fast path – prompt fits into the context window
  if (approxTokenCount(prompt) <= maxTokens) {
    const { object } = await generateObject({ model, prompt, schema });
    if (!object) throw new Error("Model did not return a valid object");
    return object as unknown as T;
  }

  // Slow path – chunk the materials section
  const markerIdx = prompt.indexOf(headerMarker);

  const header =
    markerIdx !== -1 ? prompt.slice(0, markerIdx + headerMarker.length) : "";
  const materials =
    markerIdx !== -1 ? prompt.slice(markerIdx + headerMarker.length) : prompt;

  const maxChunkChars = maxTokens * TOKEN_CHAR_RATIO - header.length;
  if (maxChunkChars <= 0) {
    throw new Error("Header alone exceeds model context window.");
  }

  const materialChunks = splitStringByLength(materials, maxChunkChars);

  const partialObjects: T[] = await Promise.all(
    materialChunks.map(async (piece, idx) => {
      const partPrompt = `${header}${piece}`;
      const { object } = await generateObject({
        model,
        prompt: partPrompt,
        schema,
      });
      if (!object) {
        throw new Error(`Chunk ${idx + 1} did not return a valid object`);
      }
      return object as unknown as T;
    })
  );

  // Merge by concatenating the questions arrays (assumes same structure)
  const merged: T = {
    ...(partialObjects[0] as unknown as Record<string, unknown>),
    questions: partialObjects.flatMap((p) => p.questions ?? []),
  } as T;

  return merged;
};
