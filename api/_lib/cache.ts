/**
 * Answer cache for FIRST questions only (follow-ups always run full RAG).
 *
 * Keys (all scoped by indexVersion and promptVersion, so rebuilding the index with new
 * content or editing the system prompt retires old answers; they expire on their TTL):
 *   cache:{iv}:{pv}:{sha256(normalised question)}  → JSON CachedAnswer, 30-day TTL
 *   cache:{iv}:{pv}:vectors                        → hash of sha256 → base64 float32 question embedding
 *
 * Exact match costs no Gemini calls. Semantic match reuses the query embedding that
 * retrieval computes anyway, and counts as a hit at similarity ≥ SEMANTIC_MIN_SCORE.
 */
import type { KV } from './kv.js';
import type { Source } from './rag.js';
import { dot } from './embeddings.js';
import { normalizeQuestion, sha256 } from './text.js';

export const SEMANTIC_MIN_SCORE = 0.95;
const TTL_SECONDS = 30 * 24 * 60 * 60;
const MAX_VECTORS = 500; // bounds the per-request semantic scan
const VECTOR_REFRESH_MS = 60_000;

export type CachedAnswer = {
  question: string;
  answer: string;
  sources: Source[];
  grounded: boolean;
  model: string;
  createdAt: string;
};

export type CacheHit = { entry: CachedAnswer; match: 'exact' | 'semantic'; score?: number };

const encodeVector = (vector: readonly number[]) => Buffer.from(new Float32Array(vector).buffer).toString('base64');
function decodeVector(encoded: string): number[] {
  const buf = Buffer.from(encoded, 'base64');
  return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4));
}

export const questionHash = (question: string) => sha256(normalizeQuestion(question));

export class AnswerCache {
  private readonly kv: KV;
  private readonly version: string;
  private vectors: { hash: string; vector: number[] }[] | null = null;
  private loadedAt = 0;

  constructor(kv: KV, indexVersion: string, promptVersion: string) {
    this.kv = kv;
    this.version = `${indexVersion}:${promptVersion}`;
  }

  private answerKey = (hash: string) => `cache:${this.version}:${hash}`;
  private get vectorsKey() {
    return `cache:${this.version}:vectors`;
  }

  private async read(hash: string): Promise<CachedAnswer | null> {
    const raw = await this.kv.get(this.answerKey(hash));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CachedAnswer;
    } catch {
      return null;
    }
  }

  async getExact(question: string): Promise<CacheHit | null> {
    const entry = await this.read(questionHash(question));
    return entry ? { entry, match: 'exact' } : null;
  }

  private async loadVectors(now = Date.now()) {
    if (this.vectors && now - this.loadedAt < VECTOR_REFRESH_MS) return this.vectors;
    const all = await this.kv.hgetall(this.vectorsKey);
    this.vectors = Object.entries(all).map(([hash, encoded]) => ({ hash, vector: decodeVector(encoded) }));
    this.loadedAt = now;
    return this.vectors;
  }

  async getSemantic(vector: readonly number[], minScore = SEMANTIC_MIN_SCORE): Promise<CacheHit | null> {
    const vectors = await this.loadVectors();
    let best: { hash: string; score: number } | null = null;
    for (const item of vectors) {
      const score = dot(vector, item.vector);
      if (score >= minScore && (!best || score > best.score)) best = { hash: item.hash, score };
    }
    if (!best) return null;
    const entry = await this.read(best.hash);
    if (!entry) {
      // The answer expired; drop its vector so we stop matching it.
      await this.kv.hdel(this.vectorsKey, best.hash);
      this.vectors = vectors.filter((item) => item.hash !== best.hash);
      return null;
    }
    return { entry, match: 'semantic', score: best.score };
  }

  async put(entry: CachedAnswer, vector: readonly number[]): Promise<void> {
    const hash = questionHash(entry.question);
    await this.kv.set(this.answerKey(hash), JSON.stringify(entry), TTL_SECONDS);
    if ((await this.kv.hlen(this.vectorsKey)) < MAX_VECTORS) {
      await this.kv.hset(this.vectorsKey, hash, encodeVector(vector));
      await this.kv.expire(this.vectorsKey, TTL_SECONDS);
      this.vectors?.push({ hash, vector: [...vector] });
    }
  }
}
