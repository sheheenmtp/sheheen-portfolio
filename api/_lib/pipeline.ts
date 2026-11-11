/**
 * One chat request, end to end:
 *   1. First question only: exact cache lookup (no Gemini calls on a hit)
 *   2. Query embedding (precomputed for starter chips, otherwise one embedding call)
 *   3. First question only: semantic cache lookup with that same embedding
 *   4. Retrieval → `sources` → generation with model fallback → `token`s → `done`
 *   5. Store the answer in the cache (first questions, completed answers only)
 *   6. Log the request (always)
 * Dependencies are injected so tests and the eval can swap them.
 */
import type { AnswerCache, CacheHit } from './cache.js';
import { streamWithFallback, type OpenModel } from './generate.js';
import type { QuestionLogEntry } from './log.js';
import {
  buildSystemPrompt,
  isFirstQuestion,
  isNoAnswer,
  pinnedHits,
  rank,
  retrievalQuery,
  selectHits,
  starterVector,
  toSources,
  type ChatMessage,
  type Retrieved,
  type Source,
} from './rag.js';

export const BUSY_MESSAGE = 'The assistant is busy, try again shortly.';
export const INTERRUPTED_MESSAGE = 'The answer was interrupted. Please try again.';

export type Sink = {
  sources(sources: Source[]): void;
  token(text: string): void;
  done(data: { grounded: boolean }): void;
  error(message: string): void;
  /** True once the client has gone away. */
  closed(): boolean;
};

export type Deps = {
  embedQuery(text: string): Promise<number[]>;
  open: OpenModel;
  cache: AnswerCache | null;
  log(entry: QuestionLogEntry): Promise<void>;
  now?: () => number;
  models?: readonly string[];
  firstTokenTimeoutMs?: number;
};

export type ChatResult = {
  answer: string | null;
  sources: Source[];
  grounded: boolean;
  model: string | null;
  cached: false | 'exact' | 'semantic';
  latencyMs: number;
  firstTokenMs: number | null;
  error?: string;
  finishReason?: string;
  usedStarterVector?: boolean;
  /** Full ranking (eval only); empty on cache hits. */
  ranked: Retrieved[];
};

const warn = (what: string, error: unknown) =>
  console.warn(`[chat] ${what} failed: ${error instanceof Error ? error.message.slice(0, 200) : error}`);

async function safe<T>(what: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    warn(what, error); // the cache is an optimisation; never fail a request because of it
    return null;
  }
}

export async function runChat(messages: ChatMessage[], sink: Sink, deps: Deps, { useCache = true } = {}): Promise<ChatResult> {
  const now = deps.now ?? Date.now;
  const started = now();
  const question = messages[messages.length - 1].content;
  const cache = useCache && isFirstQuestion(messages) ? deps.cache : null;
  let firstTokenAt: number | null = null;
  const emit = (text: string) => {
    firstTokenAt ??= now();
    sink.token(text);
  };

  const finish = async (result: Omit<ChatResult, 'latencyMs' | 'firstTokenMs'>): Promise<ChatResult> => {
    const full = { ...result, latencyMs: now() - started, firstTokenMs: firstTokenAt === null ? null : firstTokenAt - started };
    const entry: QuestionLogEntry = {
      ts: new Date(started).toISOString(),
      question,
      answer: full.answer,
      sources: full.sources.map(({ id, title }) => ({ id, title })),
      cached: Boolean(full.cached),
      ...(full.cached ? { cacheMatch: full.cached } : {}),
      model: full.model,
      latencyMs: full.latencyMs,
      firstTokenMs: full.firstTokenMs,
      answeredFromContext: full.grounded,
      ...(full.error ? { error: full.error } : {}),
    };
    await safe('question log', () => deps.log(entry));
    return full;
  };

  const replay = (hit: CacheHit) => {
    sink.sources(hit.entry.sources);
    emit(hit.entry.answer);
    sink.done({ grounded: hit.entry.grounded });
    return finish({
      answer: hit.entry.answer,
      sources: hit.entry.sources,
      grounded: hit.entry.grounded,
      model: hit.entry.model,
      cached: hit.match,
      ranked: [],
    });
  };

  // 1. Exact cache match: zero Gemini calls.
  if (cache) {
    const hit = await safe('cache lookup', () => cache.getExact(question));
    if (hit) return replay(hit);
  }

  // 2. Query embedding.
  const query = retrievalQuery(messages);
  const precomputed = starterVector(query);
  let vector: number[];
  try {
    vector = precomputed ?? (await deps.embedQuery(query));
  } catch (error) {
    warn('query embedding', error);
    sink.error(BUSY_MESSAGE);
    return finish({ answer: null, sources: [], grounded: false, model: null, cached: false, error: 'embedding', ranked: [] });
  }

  // 3. Semantic cache match, reusing the same embedding. Starter chips skip it: their
  //    answers come from pinned chunks, so a paraphrase answered by normal retrieval
  //    must not be replayed for them (their own exact-match entry still is).
  const pinned = pinnedHits(query);
  if (cache && !pinned) {
    const hit = await safe('semantic cache lookup', () => cache.getSemantic(vector));
    if (hit) return replay(hit);
  }

  // 4. Retrieval and generation.
  const ranked = rank(vector);
  const hits = pinned ?? selectHits(ranked);
  const sources = toSources(hits);
  sink.sources(sources);

  let stream;
  try {
    stream = await streamWithFallback(deps.open, buildSystemPrompt(hits), messages, {
      models: deps.models,
      firstTokenTimeoutMs: deps.firstTokenTimeoutMs,
    });
  } catch (error) {
    warn('generation', error);
    sink.error(BUSY_MESSAGE);
    return finish({ answer: null, sources, grounded: false, model: null, cached: false, error: 'all-models-failed', ranked });
  }

  let text = '';
  try {
    for await (const token of stream.tokens) {
      if (sink.closed()) {
        stream.abort();
        break;
      }
      text += token;
      emit(token);
    }
  } catch (error) {
    warn(`streaming from ${stream.model}`, error);
    if (!sink.closed()) sink.error(INTERRUPTED_MESSAGE);
    return finish({ answer: text || null, sources, grounded: false, model: stream.model, cached: false, error: 'interrupted', ranked });
  }

  const grounded = hits.length > 0 && !isNoAnswer(text);
  const finishReason = stream.finishReason();
  if (!sink.closed()) sink.done({ grounded });

  // 5. Cache only complete answers to first questions.
  if (cache && !sink.closed() && finishReason === 'STOP' && text.trim()) {
    await safe('cache store', () =>
      cache.put({ question, answer: text, sources, grounded, model: stream.model, createdAt: new Date().toISOString() }, vector),
    );
  }

  return finish({
    answer: text,
    sources,
    grounded,
    model: stream.model,
    cached: false,
    finishReason,
    usedStarterVector: Boolean(precomputed),
    ranked,
  });
}
