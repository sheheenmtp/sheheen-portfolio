import { createHash } from 'node:crypto';

export const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

/**
 * Normalises a question for exact cache matching and starter lookup:
 * lowercase, trim, collapse whitespace, strip trailing punctuation.
 */
export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s?!.,;:…]+$/u, '');
}
