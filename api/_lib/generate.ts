/**
 * Streaming generation with model fallback.
 * Primary gemini-3.5-flash-lite, fallback gemini-3.1-flash-lite (separate free-tier quotas).
 * Fallback happens only before the first token is sent; a failure mid-answer is reported
 * to the visitor as an error, because half an answer cannot be "retried" invisibly.
 */
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { ChatMessage } from './rag.ts';

export const CHAT_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'] as const;
export const FIRST_TOKEN_TIMEOUT_MS = 12_000;
const MAX_OUTPUT_TOKENS = 500;

export type Piece = { text: string; finishReason?: string };
/** Opens a stream for one model. `signal` aborts it. */
export type OpenModel = (model: string, system: string, messages: ChatMessage[], signal: AbortSignal) => Promise<AsyncIterable<Piece>>;

export class AllModelsFailedError extends Error {
  readonly causes: unknown[];
  constructor(causes: unknown[]) {
    super('All chat models failed.');
    this.causes = causes;
  }
}

class TimeoutError extends Error {}

/** Gemini implementation of OpenModel. Thought parts are dropped and never leave the server. */
export function geminiOpenModel(apiKey: string): OpenModel {
  const ai = new GoogleGenAI({ apiKey });
  return async (model, system, messages, signal) => {
    const stream = await ai.models.generateContentStream({
      model,
      contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      config: {
        systemInstruction: system,
        temperature: 0.2,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        abortSignal: signal,
      },
    });
    return (async function* () {
      for await (const chunk of stream) {
        const candidate = chunk.candidates?.[0];
        const text = (candidate?.content?.parts ?? [])
          .filter((part) => !part.thought)
          .map((part) => part.text ?? '')
          .join('');
        yield { text, finishReason: candidate?.finishReason };
      }
    })();
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new TimeoutError(`No response within ${ms} ms.`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

export type ModelStream = {
  model: string;
  /** Yields answer text; read `finishReason` after it ends. */
  tokens: AsyncGenerator<string>;
  finishReason: () => string | undefined;
  abort: () => void;
};

/**
 * Tries each model in turn until one produces its first piece of text (or finishes)
 * within the timeout. Throws AllModelsFailedError if none do.
 */
export async function streamWithFallback(
  open: OpenModel,
  system: string,
  messages: ChatMessage[],
  { models = CHAT_MODELS as readonly string[], firstTokenTimeoutMs = FIRST_TOKEN_TIMEOUT_MS } = {},
): Promise<ModelStream> {
  const causes: unknown[] = [];
  for (const model of models) {
    const controller = new AbortController();
    try {
      const iterator = (await withTimeout(open(model, system, messages, controller.signal), firstTokenTimeoutMs))[Symbol.asyncIterator]();
      // Wait for the first piece with text (or the end of the stream).
      const buffered: Piece[] = [];
      const first = await withTimeout(
        (async () => {
          for (;;) {
            const next = await iterator.next();
            if (next.done) return null;
            buffered.push(next.value);
            if (next.value.text) return next.value;
          }
        })(),
        firstTokenTimeoutMs,
      );
      let finishReason = buffered.findLast((p) => p.finishReason)?.finishReason;
      const tokens = (async function* () {
        for (const piece of buffered) if (piece.text) yield piece.text;
        if (first === null) return;
        for (;;) {
          const next = await iterator.next();
          if (next.done) return;
          if (next.value.finishReason) finishReason = next.value.finishReason;
          if (next.value.text) yield next.value.text;
        }
      })();
      return { model, tokens, finishReason: () => finishReason, abort: () => controller.abort() };
    } catch (error) {
      controller.abort();
      causes.push(error);
      console.warn(`[chat] ${model} failed before its first token: ${error instanceof Error ? error.message.slice(0, 200) : error}`);
    }
  }
  throw new AllModelsFailedError(causes);
}
