/**
 * Anonymous question log. One entry per request, kept 90 days.
 * Never stores IP addresses or user agents.
 *
 *   log:index      sorted set, member = entry id, score = timestamp (ms)
 *   log:{id}       JSON QuestionLogEntry, 90-day TTL
 *
 * Without Upstash, entries go to the function log (console) instead.
 */
import { randomUUID } from 'node:crypto';
import type { KV } from './kv.ts';

export const LOG_TTL_SECONDS = 90 * 24 * 60 * 60;
export const LOG_INDEX_KEY = 'log:index';

export type QuestionLogEntry = {
  ts: string;
  question: string;
  answer: string | null;
  sources: { id: string; title: string }[];
  cached: boolean;
  cacheMatch?: 'exact' | 'semantic';
  /** Chat model that produced the answer (for cache hits, the model that originally did). null on errors. */
  model: string | null;
  /** Request start → last event sent. */
  latencyMs: number;
  /** Request start → first answer text sent to the client. null when no text was sent. */
  firstTokenMs: number | null;
  answeredFromContext: boolean;
  error?: string;
};

export async function logQuestion(kv: KV | null, entry: QuestionLogEntry): Promise<void> {
  if (!kv) {
    console.info('[chat-log]', JSON.stringify(entry));
    return;
  }
  const id = `${Date.parse(entry.ts)}-${randomUUID().slice(0, 8)}`;
  // Independent writes: send them in parallel (one round trip instead of three).
  await Promise.all([
    kv.set(`log:${id}`, JSON.stringify(entry), LOG_TTL_SECONDS),
    kv.zadd(LOG_INDEX_KEY, Date.parse(entry.ts), id),
    kv.zremRangeByScore(LOG_INDEX_KEY, 0, Date.now() - LOG_TTL_SECONDS * 1000),
  ]);
}

export async function readLog(kv: KV, sinceMs: number): Promise<QuestionLogEntry[]> {
  const ids = await kv.zrangeByScore(LOG_INDEX_KEY, sinceMs, Date.now());
  const entries: QuestionLogEntry[] = [];
  for (let i = 0; i < ids.length; i += 100) {
    const raws = await kv.mget(ids.slice(i, i + 100).map((id) => `log:${id}`));
    for (const raw of raws) {
      if (!raw) continue;
      try {
        entries.push(JSON.parse(raw) as QuestionLogEntry);
      } catch {
        /* skip corrupt entries */
      }
    }
  }
  return entries;
}
