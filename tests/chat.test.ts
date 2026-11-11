/**
 * Offline tests for the chat pipeline: no network, no env vars.
 *   npm test
 */
import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import { AnswerCache } from '../api/_lib/cache.ts';
import type { OpenModel, Piece } from '../api/_lib/generate.ts';
import { memoryKV } from '../api/_lib/kv.ts';
import type { QuestionLogEntry } from '../api/_lib/log.ts';
import { BUSY_MESSAGE, runChat, type Deps, type Sink } from '../api/_lib/pipeline.ts';
import { index, type ChatMessage } from '../api/_lib/rag.ts';
import { normalizeQuestion } from '../api/_lib/text.ts';

const PRIMARY = 'primary-model';
const FALLBACK = 'fallback-model';
// A real document vector, so retrieval returns hits above the threshold.
const VECTOR = index.chunks.find((c) => c.id.startsWith('faq/has-sheheen-fine-tuned'))!.embedding;

type Recorded = { events: [string, unknown][]; sink: Sink };
function recorder(): Recorded {
  const events: [string, unknown][] = [];
  return {
    events,
    sink: {
      sources: (s) => events.push(['sources', s]),
      token: (t) => events.push(['token', t]),
      done: (d) => events.push(['done', d]),
      error: (m) => events.push(['error', m]),
      closed: () => false,
    },
  };
}

const textOf = (r: Recorded) => r.events.filter(([e]) => e === 'token').map(([, t]) => t).join('');
const user = (content: string): ChatMessage[] => [{ role: 'user', content }];

function streamOf(pieces: Piece[]): AsyncIterable<Piece> {
  return (async function* () {
    for (const piece of pieces) yield piece;
  })();
}

type Fakes = Deps & { calls: { embed: number; open: string[] }; logs: QuestionLogEntry[] };
function fakes(overrides: Partial<Deps> = {}, kv = memoryKV()): Fakes {
  const calls = { embed: 0, open: [] as string[] };
  const logs: QuestionLogEntry[] = [];
  const open: OpenModel = async (model) => {
    calls.open.push(model);
    return streamOf([{ text: 'He fine-tuned ' }, { text: 'NLLB-200.', finishReason: 'STOP' }]);
  };
  return {
    calls,
    logs,
    embedQuery: async () => {
      calls.embed++;
      return VECTOR;
    },
    open,
    cache: new AnswerCache(kv, index.indexVersion),
    log: async (entry) => void logs.push(entry),
    models: [PRIMARY, FALLBACK],
    firstTokenTimeoutMs: 200,
    ...overrides,
  };
}

describe('normalizeQuestion', () => {
  it('lowercases, trims, collapses spaces and strips trailing punctuation', () => {
    assert.equal(normalizeQuestion('  What   did Sheheen BUILD at ICFOSS?!  '), 'what did sheheen build at icfoss');
    assert.equal(normalizeQuestion('Where is he based...'), 'where is he based');
    assert.equal(normalizeQuestion('Where is he based …'), 'where is he based');
  });
  it('treats curly and straight apostrophes the same', () => {
    assert.equal(normalizeQuestion('What’s his stack?'), normalizeQuestion("what's his stack"));
  });
  it('keeps punctuation inside the question', () => {
    assert.equal(normalizeQuestion('Node.js or Python?'), 'node.js or python');
  });
});

describe('answer cache', () => {
  let kv: ReturnType<typeof memoryKV>;
  beforeEach(() => {
    kv = memoryKV();
  });

  it('serves an exact repeat with no embedding or model calls', async () => {
    const first = fakes({}, kv);
    const a = recorder();
    const r1 = await runChat(user('Has he fine-tuned a model?'), a.sink, first);
    assert.equal(r1.cached, false);
    assert.equal(first.calls.embed, 1);

    const second = fakes({}, kv);
    const b = recorder();
    const r2 = await runChat(user('  has he FINE-TUNED a model  '), b.sink, second);
    assert.equal(r2.cached, 'exact');
    assert.equal(second.calls.embed, 0, 'no embedding call');
    assert.deepEqual(second.calls.open, [], 'no model call');
    assert.equal(textOf(b), 'He fine-tuned NLLB-200.');
    assert.deepEqual(b.events.map(([e]) => e), ['sources', 'token', 'done']);
    assert.equal(second.logs[0].cached, true);
    assert.equal(second.logs[0].cacheMatch, 'exact');
    assert.equal(second.logs[0].model, PRIMARY, 'logs the model that originally answered');
  });

  it('serves a paraphrase via the semantic match, reusing the retrieval embedding', async () => {
    await runChat(user('Has he fine-tuned a model?'), recorder().sink, fakes({}, kv));
    const second = fakes({}, kv); // embedQuery returns the same vector → similarity 1.0
    const r = await runChat(user('Did Sheheen ever fine-tune a model'), recorder().sink, second);
    assert.equal(r.cached, 'semantic');
    assert.equal(second.calls.embed, 1, 'exactly one embedding call (the one retrieval needs anyway)');
    assert.deepEqual(second.calls.open, []);
  });

  it('does not count a dissimilar question as a semantic hit', async () => {
    await runChat(user('Has he fine-tuned a model?'), recorder().sink, fakes({}, kv));
    const other = index.chunks.find((c) => c.id.startsWith('faq/what-are-sheheen-s-salary'))!.embedding;
    const second = fakes({ embedQuery: async () => other }, kv);
    const r = await runChat(user('What salary does he expect?'), recorder().sink, second);
    assert.equal(r.cached, false);
    assert.deepEqual(second.calls.open, [PRIMARY]);
  });

  it('bypasses the cache for follow-ups, even for a cached question', async () => {
    await runChat(user('Has he fine-tuned a model?'), recorder().sink, fakes({}, kv));
    const followUp = fakes({}, kv);
    const messages: ChatMessage[] = [
      { role: 'user', content: 'What did he do at ICFOSS?' },
      { role: 'assistant', content: 'He was an AI Engineer.' },
      { role: 'user', content: 'Has he fine-tuned a model?' },
    ];
    const r = await runChat(messages, recorder().sink, followUp);
    assert.equal(r.cached, false);
    assert.deepEqual(followUp.calls.open, [PRIMARY], 'full RAG ran');
    const answerKeys = [...kv.dump().keys()].filter((key) => !key.endsWith(':vectors'));
    assert.equal(answerKeys.length, 1, 'only the first-question answer is cached; the follow-up is not');
  });

  it('does not cache answers cut off by the token limit', async () => {
    const truncated = fakes({ open: async () => streamOf([{ text: 'He fine-tuned', finishReason: 'MAX_TOKENS' }]) }, kv);
    await runChat(user('Has he fine-tuned a model?'), recorder().sink, truncated);
    const again = fakes({}, kv);
    const r = await runChat(user('Has he fine-tuned a model?'), recorder().sink, again);
    assert.equal(r.cached, false);
  });

  it('can be bypassed (eval runs)', async () => {
    await runChat(user('Has he fine-tuned a model?'), recorder().sink, fakes({}, kv));
    const r = await runChat(user('Has he fine-tuned a model?'), recorder().sink, fakes({}, kv), { useCache: false });
    assert.equal(r.cached, false);
  });

  it('uses the precomputed vector for starter chips (no embedding call)', async () => {
    const deps = fakes({}, kv);
    const r = await runChat(user(index.starters[0].question), recorder().sink, deps);
    assert.equal(deps.calls.embed, 0);
    assert.equal(r.usedStarterVector, true);
  });

  it('answers starter chips from their pinned chunks only', async () => {
    for (const starter of index.starters) {
      const rec = recorder();
      await runChat(user(starter.question), rec.sink, fakes({ cache: null }));
      const sources = rec.events.find(([event]) => event === 'sources')![1] as { id: string }[];
      assert.deepEqual(sources.map((s) => s.id), starter.sources, starter.question);
    }
  });

  it('does not replay a semantic cache hit for a starter chip', async () => {
    const starter = index.starters[0];
    // A paraphrase answered by normal retrieval, cached with the starter's own vector (similarity 1.0).
    await runChat(user('Tell me something about this person'), recorder().sink, fakes({ embedQuery: async () => starter.embedding }, kv));
    const chip = fakes({}, kv);
    const r = await runChat(user(starter.question), recorder().sink, chip);
    assert.equal(r.cached, false);
    assert.deepEqual(chip.calls.open, [PRIMARY], 'generated from the pinned chunks');
  });
});

describe('model fallback', () => {
  const failing = (status: number): never => {
    throw Object.assign(new Error(`HTTP ${status}`), { status });
  };

  for (const [label, primary] of [
    ['429', async () => failing(429)],
    ['503', async () => failing(503)],
    ['timeout', async () => (async function* () { await new Promise((r) => setTimeout(r, 1000)); yield { text: 'late' }; })()],
    ['error mid-handshake', async () => (async function* () { yield failing(500); })()],
  ] as [string, () => Promise<AsyncIterable<Piece>>][]) {
    it(`falls back to the second model on ${label}`, async () => {
      const opened: string[] = [];
      const deps = fakes({
        cache: null,
        open: async (model) => {
          opened.push(model);
          return model === PRIMARY ? primary() : streamOf([{ text: 'Fallback answer.', finishReason: 'STOP' }]);
        },
      });
      const rec = recorder();
      const r = await runChat(user('Has he fine-tuned a model?'), rec.sink, deps);
      assert.deepEqual(opened, [PRIMARY, FALLBACK]);
      assert.equal(r.model, FALLBACK);
      assert.equal(textOf(rec), 'Fallback answer.');
      assert.equal(deps.logs[0].model, FALLBACK);
    });
  }

  it('sends the busy error event when both models fail', async () => {
    const deps = fakes({ cache: null, open: async () => failing(429) });
    const rec = recorder();
    const r = await runChat(user('Has he fine-tuned a model?'), rec.sink, deps);
    assert.deepEqual(rec.events.map(([e]) => e), ['sources', 'error']);
    assert.equal(rec.events[1][1], BUSY_MESSAGE);
    assert.equal(r.model, null);
    assert.equal(deps.logs[0].error, 'all-models-failed');
  });

  it('sends the busy error event when the query embedding fails', async () => {
    const deps = fakes({ cache: null, embedQuery: async () => failing(429) });
    const rec = recorder();
    await runChat(user('Some brand new question about him'), rec.sink, deps);
    assert.deepEqual(rec.events, [['error', BUSY_MESSAGE]]);
  });
});

describe('question log', () => {
  it('logs every request without IPs or user agents', async () => {
    const deps = fakes();
    await runChat(user('Has he fine-tuned a model?'), recorder().sink, deps);
    const [entry] = deps.logs;
    assert.deepEqual(Object.keys(entry).sort(), ['answer', 'answeredFromContext', 'cached', 'firstTokenMs', 'latencyMs', 'model', 'question', 'sources', 'ts']);
    assert.equal(entry.answeredFromContext, true);
    assert.equal(typeof entry.firstTokenMs, 'number');
    assert.ok(entry.firstTokenMs! <= entry.latencyMs);
  });

  it('marks "not in my knowledge base" replies as not answered from context', async () => {
    const deps = fakes({ cache: null, open: async () => streamOf([{ text: "That isn't in my knowledge base about Sheheen.", finishReason: 'STOP' }]) });
    const rec = recorder();
    await runChat(user('Does he know Rust?'), rec.sink, deps);
    assert.equal(deps.logs[0].answeredFromContext, false);
    assert.deepEqual(rec.events.at(-1), ['done', { grounded: false }]);
  });
});

describe('question log writes', () => {
  it('sends the three Redis writes in parallel', async () => {
    const { logQuestion } = await import('../api/_lib/log.ts');
    const kv = memoryKV();
    let inFlight = 0;
    let maxInFlight = 0;
    const slow = <T>(fn: () => Promise<T>) => async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((r) => setTimeout(r, 20));
      inFlight--;
      return fn();
    };
    const tracked = {
      ...kv,
      set: (k: string, v: string, t: number) => slow(() => kv.set(k, v, t))(),
      zadd: (k: string, s: number, m: string) => slow(() => kv.zadd(k, s, m))(),
      zremRangeByScore: (k: string, a: number, b: number) => slow(() => kv.zremRangeByScore(k, a, b))(),
    };
    await logQuestion(tracked, {
      ts: new Date().toISOString(), question: 'q', answer: 'a', sources: [], cached: false,
      model: 'm', latencyMs: 1, firstTokenMs: 1, answeredFromContext: true,
    });
    assert.equal(maxInFlight, 3);
  });
});
