/**
 * The small slice of Redis the cache and question log need. Upstash implements it in
 * production; tests use an in-memory fake. Values are plain strings (JSON-encoded by callers).
 */
import { Redis } from '@upstash/redis';
import { upstashCredentials } from './env.ts';

export interface KV {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  hgetall(key: string): Promise<Record<string, string>>;
  hset(key: string, field: string, value: string): Promise<void>;
  hdel(key: string, field: string): Promise<void>;
  hlen(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<void>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zrangeByScore(key: string, min: number, max: number): Promise<string[]>;
  zremRangeByScore(key: string, min: number, max: number): Promise<void>;
  mget(keys: string[]): Promise<(string | null)[]>;
}

let redis: Redis | null | undefined;

/** The shared Upstash client, or null when the env vars are not set. */
export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const creds = upstashCredentials();
  redis = creds ? new Redis({ ...creds, automaticDeserialization: false }) : null;
  return redis;
}

let kv: KV | null | undefined;

export function getKV(): KV | null {
  if (kv !== undefined) return kv;
  const r = getRedis();
  kv = r
    ? {
        get: (key) => r.get<string>(key),
        set: async (key, value, ttl) => void (await r.set(key, value, { ex: ttl })),
        del: async (key) => void (await r.del(key)),
        hgetall: async (key) => (await r.hgetall<Record<string, string>>(key)) ?? {},
        hset: async (key, field, value) => void (await r.hset(key, { [field]: value })),
        hdel: async (key, field) => void (await r.hdel(key, field)),
        hlen: (key) => r.hlen(key),
        expire: async (key, ttl) => void (await r.expire(key, ttl)),
        zadd: async (key, score, member) => void (await r.zadd(key, { score, member })),
        zrangeByScore: (key, min, max) => r.zrange<string[]>(key, min, max, { byScore: true }),
        zremRangeByScore: async (key, min, max) => void (await r.zremrangebyscore(key, min, max)),
        mget: (keys) => (keys.length ? r.mget<(string | null)[]>(...keys) : Promise.resolve([])),
      }
    : null;
  return kv;
}

/** In-memory KV for tests (and anything else that wants Redis semantics without Redis). */
export function memoryKV(): KV & { dump(): Map<string, unknown> } {
  const strings = new Map<string, string>();
  const hashes = new Map<string, Map<string, string>>();
  const zsets = new Map<string, Map<string, number>>();
  return {
    dump: () => new Map<string, unknown>([...strings, ...hashes, ...zsets]),
    get: async (key) => strings.get(key) ?? null,
    set: async (key, value) => void strings.set(key, value),
    del: async (key) => void strings.delete(key),
    hgetall: async (key) => Object.fromEntries(hashes.get(key) ?? []),
    hset: async (key, field, value) => {
      if (!hashes.has(key)) hashes.set(key, new Map());
      hashes.get(key)!.set(field, value);
    },
    hdel: async (key, field) => void hashes.get(key)?.delete(field),
    hlen: async (key) => hashes.get(key)?.size ?? 0,
    expire: async () => {},
    zadd: async (key, score, member) => {
      if (!zsets.has(key)) zsets.set(key, new Map());
      zsets.get(key)!.set(member, score);
    },
    zrangeByScore: async (key, min, max) =>
      [...(zsets.get(key) ?? [])].filter(([, s]) => s >= min && s <= max).sort((a, b) => a[1] - b[1]).map(([m]) => m),
    zremRangeByScore: async (key, min, max) => {
      const z = zsets.get(key);
      if (z) for (const [m, s] of z) if (s >= min && s <= max) z.delete(m);
    },
    mget: async (keys) => keys.map((key) => strings.get(key) ?? null),
  };
}
