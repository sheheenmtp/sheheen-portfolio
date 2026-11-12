/**
 * Case format and answer checks for the chat eval (scripts/eval.ts). Pure functions, so
 * tests/chat.test.ts can check them offline.
 */
import { readFile } from 'node:fs/promises';

export type EvalCase = {
  id: string;
  question: string;
  /** Asked first, in order; their real answers become the conversation history. */
  previousQuestions?: string[];
  /** Expected `grounded` flag of the final answer. */
  grounded?: boolean;
  /** Every regex must match the answer (case-insensitive). */
  mustMatch?: string[];
  /** No regex may match the answer (case-insensitive). */
  mustNotMatch?: string[];
  /** Each regex may occur at most this many times (case-insensitive). */
  maxCount?: Record<string, number>;
  /** Every chunk id must be among the retrieved sources (checks retrieval, not wording). */
  expectSources?: string[];
};

export type Outcome = { answer: string; grounded: boolean; sourceIds: string[] };

export const CASES_FILE = new URL('./eval-cases.json', import.meta.url);

export async function loadCases(file: URL | string = CASES_FILE): Promise<EvalCase[]> {
  const { cases } = JSON.parse(await readFile(file, 'utf8')) as { cases: EvalCase[] };
  return cases;
}

/** Returns why the outcome fails the case; an empty list means it passes. */
export function checkAnswer(c: EvalCase, outcome: Outcome): string[] {
  const answer = outcome.answer.trim();
  const problems: string[] = [];
  if (c.grounded !== undefined && outcome.grounded !== c.grounded) {
    problems.push(`grounded was ${outcome.grounded}, expected ${c.grounded}`);
  }
  for (const pattern of c.mustMatch ?? []) {
    if (!new RegExp(pattern, 'i').test(answer)) problems.push(`missing /${pattern}/`);
  }
  for (const pattern of c.mustNotMatch ?? []) {
    const match = answer.match(new RegExp(pattern, 'i'));
    if (match) problems.push(`contains /${pattern}/ ("${match[0]}")`);
  }
  for (const [pattern, max] of Object.entries(c.maxCount ?? {})) {
    const count = answer.match(new RegExp(pattern, 'gi'))?.length ?? 0;
    if (count > max) problems.push(`/${pattern}/ occurs ${count}×, at most ${max} allowed`);
  }
  for (const id of c.expectSources ?? []) {
    if (!outcome.sourceIds.includes(id)) problems.push(`source ${id} was not retrieved`);
  }
  return problems;
}
