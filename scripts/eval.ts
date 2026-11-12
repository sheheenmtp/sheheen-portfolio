/**
 * Live answer-quality eval: asks the real assistant every case in scripts/eval-cases.json
 * and checks the answers (see eval-lib.ts for the checks).
 *
 *   npm run eval                       # all cases
 *   npm run eval -- --only <id>        # one case (repeatable)
 *   npm run eval -- --json out.json    # also write the results as JSON
 *
 * - Calls the pipeline directly (no HTTP, no rate limit), with the answer cache bypassed
 *   and the question log off, so eval runs never show up in `npm run logs`.
 * - Waits ≥ 6 s between requests to stay well under the free tier's 15 requests a minute.
 * - A request that errors (models busy, timeout, broken stream) is retried once after a
 *   pause. Still erroring, the case counts as errored, not failed.
 * - Exits with 1 when any case fails or errors.
 */
import { writeFile } from 'node:fs/promises';
import { productionDeps } from '../api/_lib/deps.ts';
import { runChat, type ChatResult, type Deps, type Sink } from '../api/_lib/pipeline.ts';
import type { ChatMessage } from '../api/_lib/rag.ts';
import { checkAnswer, loadCases, type EvalCase } from './eval-lib.ts';

const GAP_MS = 6_000;
const RETRY_PAUSE_MS = 20_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseArgs(argv: string[]) {
  const only: string[] = [];
  let json: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--only' && argv[i + 1]) only.push(argv[++i]);
    else if (argv[i] === '--json' && argv[i + 1]) json = argv[++i];
    else {
      console.error('Usage: npm run eval -- [--only <case id>]... [--json <file>]');
      process.exit(1);
    }
  }
  return { only, json };
}

const silentSink: Sink = { sources() {}, token() {}, done() {}, error() {}, closed: () => false };

let lastRequestAt = 0;
async function ask(messages: ChatMessage[], deps: Deps): Promise<ChatResult> {
  for (let attempt = 1; ; attempt++) {
    const wait = lastRequestAt + GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequestAt = Date.now();
    const result = await runChat(messages, silentSink, deps, { useCache: false });
    if (!result.error || attempt === 2) return result;
    console.log(`    … ${result.error}, retrying in ${RETRY_PAUSE_MS / 1000} s`);
    await sleep(RETRY_PAUSE_MS);
  }
}

type CaseResult = {
  id: string;
  status: 'pass' | 'fail' | 'error';
  question: string;
  answer: string | null;
  grounded: boolean;
  sources: string[];
  model: string | null;
  firstTokenMs: number | null;
  problems: string[];
};

async function runCase(c: EvalCase, deps: Deps): Promise<CaseResult> {
  const history: ChatMessage[] = [];
  for (const previous of c.previousQuestions ?? []) {
    history.push({ role: 'user', content: previous });
    const result = await ask(history, deps);
    if (result.error || !result.answer) {
      return { id: c.id, status: 'error', question: c.question, answer: null, grounded: false, sources: [], model: null, firstTokenMs: null, problems: [`previous question "${previous}" errored: ${result.error ?? 'empty answer'}`] };
    }
    history.push({ role: 'assistant', content: result.answer });
  }
  history.push({ role: 'user', content: c.question });
  const result = await ask(history, deps);
  const base = {
    id: c.id,
    question: c.question,
    answer: result.answer,
    grounded: result.grounded,
    sources: result.sources.map((s) => s.id),
    model: result.model,
    firstTokenMs: result.firstTokenMs,
  };
  if (result.error || !result.answer) return { ...base, status: 'error', problems: [result.error ?? 'empty answer'] };
  const problems = checkAnswer(c, { answer: result.answer, grounded: result.grounded, sourceIds: base.sources });
  return { ...base, status: problems.length ? 'fail' : 'pass', problems };
}

const indent = (text: string) => text.trim().split('\n').map((line) => `      ${line}`).join('\n');

async function main() {
  const { only, json } = parseArgs(process.argv.slice(2));
  const all = await loadCases();
  const unknown = only.filter((id) => !all.some((c) => c.id === id));
  if (unknown.length) throw new Error(`Unknown case id(s): ${unknown.join(', ')}`);
  const cases = only.length ? all.filter((c) => only.includes(c.id)) : all;

  // Same Gemini wiring as production, minus the cache and the question log.
  const deps: Deps = { ...productionDeps(), cache: null, log: async () => {} };

  const requests = cases.reduce((n, c) => n + 1 + (c.previousQuestions?.length ?? 0), 0);
  console.log(`Chat eval: ${cases.length} case(s), ${requests} request(s), about ${Math.ceil((requests * GAP_MS) / 60_000)} min\n`);

  const results: CaseResult[] = [];
  for (const c of cases) {
    const r = await runCase(c, deps);
    results.push(r);
    const mark = { pass: '✓', fail: '✗', error: '⚠' }[r.status];
    const timing = r.firstTokenMs === null ? '' : `, first token ${(r.firstTokenMs / 1000).toFixed(1)} s`;
    console.log(`${mark} ${r.id} (${r.model ?? 'no model'}${timing})`);
    if (r.status !== 'pass') {
      for (const problem of r.problems) console.log(`    - ${problem}`);
      if (r.answer) console.log(`    Q: ${r.question}\n    A:\n${indent(r.answer)}`);
    }
  }

  const count = (status: CaseResult['status']) => results.filter((r) => r.status === status).length;
  console.log(`\n${count('pass')} passed, ${count('fail')} failed, ${count('error')} errored`);
  if (json) {
    await writeFile(json, JSON.stringify({ ranAt: new Date().toISOString(), results }, null, 2));
    console.log(`Results written to ${json}`);
  }
  if (count('fail') || count('error')) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
