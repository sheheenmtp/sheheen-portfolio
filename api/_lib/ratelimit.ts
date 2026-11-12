/**
 * 20 requests per hour per IP.
 * Uses Upstash Redis when its credentials are set (see env.ts).
 * Otherwise falls back to an in-memory limiter, which is best-effort only: each
 * serverless instance has its own memory, and it resets on cold starts.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { upstashCredentials } from './env.js';

export const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

export type LimitResult = { success: boolean; remaining: number; reset: number };

let upstash: Ratelimit | null | undefined;
let warned = false;
const memory = new Map<string, number[]>();

function getUpstash(): Ratelimit | null {
  if (upstash !== undefined) return upstash;
  const creds = upstashCredentials();
  upstash =
    creds
      ? new Ratelimit({
          redis: new Redis(creds),
          limiter: Ratelimit.slidingWindow(LIMIT, '1 h'),
          prefix: 'portfolio-chat',
        })
      : null;
  return upstash;
}

function memoryLimit(key: string): LimitResult {
  if (!warned) {
    console.warn('Upstash env vars are not set; using a best-effort in-memory rate limiter.');
    warned = true;
  }
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const success = recent.length < LIMIT;
  if (success) recent.push(now);
  memory.set(key, recent);
  if (memory.size > 5000) {
    // Keep memory bounded: drop the oldest keys.
    for (const k of Array.from(memory.keys()).slice(0, 1000)) memory.delete(k);
  }
  return { success, remaining: Math.max(0, LIMIT - recent.length), reset: (recent[0] ?? now) + WINDOW_MS };
}

export async function limit(ip: string): Promise<LimitResult> {
  const limiter = getUpstash();
  if (!limiter) return memoryLimit(ip);
  try {
    const { success, remaining, reset } = await limiter.limit(ip);
    return { success, remaining, reset };
  } catch (error) {
    // Do not take the assistant down if Redis is unreachable.
    console.error('Upstash rate limit failed; falling back to memory:', error instanceof Error ? error.message : error);
    return memoryLimit(ip);
  }
}
