/** Production dependencies for runChat (Gemini + Upstash when configured). */
import { GoogleGenAI } from '@google/genai';
import { AnswerCache } from './cache.ts';
import { embedText, queryText } from './embeddings.ts';
import { geminiOpenModel } from './generate.ts';
import { getKV } from './kv.ts';
import { logQuestion } from './log.ts';
import type { Deps } from './pipeline.ts';
import { HttpError, index } from './rag.ts';

let deps: Deps | undefined;

export function productionDeps(): Deps {
  if (deps) return deps;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new HttpError(500, 'The assistant is not configured (GEMINI_API_KEY is missing).');
  const ai = new GoogleGenAI({ apiKey });
  const kv = getKV();
  if (!kv) console.warn('[chat] Upstash env vars are not set: answer cache off, questions logged to the console.');
  deps = {
    embedQuery: (text) => embedText(ai, queryText(text), { retries: 2, baseDelayMs: 400 }),
    open: geminiOpenModel(apiKey),
    cache: kv ? new AnswerCache(kv, index.indexVersion) : null,
    log: (entry) => logQuestion(kv, entry),
  };
  return deps;
}
