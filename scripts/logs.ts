/**
 * Summarises the anonymous question log stored in Upstash.
 *
 *   npm run logs            # last 7 days
 *   npm run logs -- 30      # last 30 days (the log keeps 90)
 */
import { getKV } from '../api/_lib/kv.ts';
import { readLog, type QuestionLogEntry } from '../api/_lib/log.ts';
import { normalizeQuestion } from '../api/_lib/text.ts';

const days = Number(process.argv[2] ?? 7);
if (!Number.isFinite(days) || days <= 0) {
  console.error('Usage: npm run logs -- [days]');
  process.exit(1);
}

const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : '–');

function countBy<T>(items: T[], key: (item: T) => string) {
  const counts = new Map<string, { count: number; example: T }>();
  for (const item of items) {
    const k = key(item);
    const current = counts.get(k);
    counts.set(k, { count: (current?.count ?? 0) + 1, example: current?.example ?? item });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

async function main() {
  const kv = getKV();
  if (!kv) throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set (see .env.example).');

  const entries = await readLog(kv, Date.now() - days * 24 * 60 * 60 * 1000);
  console.log(`Question log, last ${days} day(s): ${entries.length} request(s)\n`);
  if (entries.length === 0) return;

  console.log('Top questions');
  for (const { count, example } of countBy(entries, (e) => normalizeQuestion(e.question)).slice(0, 15)) {
    console.log(`  ${String(count).padStart(4)}  ${example.question}`);
  }

  const unanswered = entries.filter((e) => !e.answeredFromContext && !e.error);
  console.log(`\nCould not answer from the knowledge base: ${unanswered.length} (${pct(unanswered.length, entries.length)})`);
  for (const { count, example } of countBy(unanswered, (e) => normalizeQuestion(e.question)).slice(0, 20)) {
    console.log(`  ${String(count).padStart(4)}  ${example.question}`);
  }

  const errors = entries.filter((e) => e.error);
  if (errors.length) {
    console.log(`\nErrors: ${errors.length}`);
    for (const { count, example } of countBy(errors, (e) => e.error!)) console.log(`  ${String(count).padStart(4)}  ${example.error}`);
  }

  const cached = entries.filter((e) => e.cached);
  const exact = cached.filter((e) => e.cacheMatch === 'exact').length;
  console.log(`\nCache hit rate: ${pct(cached.length, entries.length)} (${exact} exact, ${cached.length - exact} semantic)`);

  console.log('\nRequests per model (cache hits counted separately)');
  const byModel = countBy(entries, (e: QuestionLogEntry) => (e.cached ? 'cache' : (e.model ?? 'none (error)')));
  for (const { count, example } of byModel) {
    const label = example.cached ? 'cache' : (example.model ?? 'none (error)');
    console.log(`  ${String(count).padStart(4)}  ${label}`);
  }

  const percentiles = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const p = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
    return `median ${p(0.5)} ms, p90 ${p(0.9)} ms (n=${sorted.length})`;
  };
  const timed = (pick: (e: QuestionLogEntry) => boolean) => entries.filter((e) => pick(e) && !e.error);
  const uncached = timed((e) => !e.cached);
  const hits = timed((e) => e.cached);
  // Older entries (before firstTokenMs was logged) are skipped for that metric.
  const ttft = (list: QuestionLogEntry[]) => list.map((e) => e.firstTokenMs).filter((v): v is number => typeof v === 'number');
  console.log('\nLatency');
  if (uncached.length) {
    if (ttft(uncached).length) console.log(`  uncached, time to first token: ${percentiles(ttft(uncached))}`);
    console.log(`  uncached, total:               ${percentiles(uncached.map((e) => e.latencyMs))}`);
  }
  if (hits.length) {
    if (ttft(hits).length) console.log(`  cache hit, time to first token: ${percentiles(ttft(hits))}`);
    console.log(`  cache hit, total:              ${percentiles(hits.map((e) => e.latencyMs))}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
