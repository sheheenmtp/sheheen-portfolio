/**
 * Embedding settings shared by the indexer (scripts/build-index.ts) and the chat API.
 * If you change the model or dimensions, rebuild the index: the API refuses to run
 * against an index built with different settings.
 */
import type { GoogleGenAI } from '@google/genai';

export const EMBED_MODEL = 'gemini-embedding-2';
export const EMBED_DIMS = 768;

/** gemini-embedding-2 has no taskType option; the task goes into the text as a prefix. */
export const documentText = (title: string, body: string) => `title: ${title} | text: ${body}`;
export const queryText = (question: string) => `task: question answering | query: ${question}`;

export type IndexChunk = {
  id: string;
  file: string;
  title: string;
  type: string;
  period: string;
  tags: string[];
  text: string;
  /** sha256 of model + dims + the exact embedded text; unchanged hash → vector reused. */
  hash: string;
  embedding: number[];
};

/** Starter-chip questions with precomputed query embeddings (no embedding call at runtime). */
/**
 * A starter-chip question. `sources` pins its retrieval to these chunk ids (from
 * src/chat/starters.json), so the chip always answers from the same sections.
 */
export type IndexStarter = { question: string; sources: string[]; hash: string; embedding: number[] };

export type EmbeddingIndex = {
  model: string;
  dims: number;
  /** Hash of model, dims, chunks and starters (not builtAt). Changes only when content changes. */
  indexVersion: string;
  builtAt: string;
  chunks: IndexChunk[];
  starters: IndexStarter[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function statusOf(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: unknown }).status;
    return typeof status === 'number' ? status : undefined;
  }
  return undefined;
}

/**
 * Embeds ONE text. Do not pass several strings in one call: gemini-embedding-2
 * returns a single aggregated embedding for multiple inputs.
 * Retries 429 and 5xx with exponential backoff and jitter.
 */
export async function embedText(
  ai: GoogleGenAI,
  text: string,
  { retries = 5, baseDelayMs = 1000 }: { retries?: number; baseDelayMs?: number } = {},
): Promise<number[]> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await ai.models.embedContent({
        model: EMBED_MODEL,
        contents: text,
        config: { outputDimensionality: EMBED_DIMS },
      });
      const values = response.embeddings?.[0]?.values;
      if (!values || values.length !== EMBED_DIMS) {
        throw new Error(`Expected a ${EMBED_DIMS}-dim embedding, got ${values?.length ?? 'none'}.`);
      }
      return values;
    } catch (error) {
      const status = statusOf(error);
      const retryable = status === 429 || (status !== undefined && status >= 500);
      if (!retryable || attempt >= retries) throw error;
      const delay = baseDelayMs * 2 ** attempt + Math.random() * 250;
      console.warn(`Embedding request failed with ${status}; retrying in ${Math.round(delay)} ms (${attempt + 1}/${retries}).`);
      await sleep(delay);
    }
  }
}

export function dot(a: readonly number[], b: readonly number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}
