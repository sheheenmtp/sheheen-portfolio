/**
 * Builds api/_data/embeddings.json from knowledge/*.md and src/chat/starters.json.
 *
 *   npm run build:index
 *
 * Each `## ` heading is one chunk. The first line under it must be the metadata line:
 *   Type: <...> · Period: <...> · Tags: <comma-separated>
 *
 * - Chunks whose text is unchanged (same sha256) reuse their existing vector, so a
 *   rebuild only spends embedding quota on what you edited.
 * - Starter-chip questions get precomputed query embeddings, so chips cost no
 *   embedding call at runtime.
 * - Calls are throttled to ≤ 60 per minute (free tier allows 100 RPM / 1,000 RPD).
 *
 * Run this locally after editing knowledge/ and commit the JSON. It is deliberately
 * not part of the Vercel build, so deploys never depend on Gemini quota.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import {
  EMBED_DIMS,
  EMBED_MODEL,
  documentText,
  embedText,
  queryText,
  type EmbeddingIndex,
  type IndexChunk,
  type IndexStarter,
} from '../api/_lib/embeddings.ts';
import { sha256 } from '../api/_lib/text.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const KNOWLEDGE_DIR = path.join(ROOT, 'knowledge');
const STARTERS_FILE = path.join(ROOT, 'src', 'chat', 'starters.json');
const OUT_FILE = path.join(ROOT, 'api', '_data', 'embeddings.json');
const MAX_WORDS = 500;
const MAX_CALLS_PER_MINUTE = 60;
const MAX_SLUG = 64;

type Section = Omit<IndexChunk, 'embedding' | 'hash'>;

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** The hash covers everything that affects the vector. */
const vectorHash = (embeddedText: string) => sha256(`${EMBED_MODEL}|${EMBED_DIMS}|${embeddedText}`);

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= MAX_SLUG) return slug;
  // Cut at the last word boundary that fits, so ids never end mid-word.
  const cut = slug.slice(0, MAX_SLUG + 1);
  return cut.slice(0, cut.lastIndexOf('-'));
}

function parseMetadata(line: string): { type: string; period: string; tags: string[] } | null {
  if (!/^Type:/.test(line)) return null;
  const fields = new Map<string, string>();
  for (const part of line.split('·')) {
    const match = part.trim().match(/^(\w+):\s*(.*)$/);
    if (match) fields.set(match[1].toLowerCase(), match[2].trim());
  }
  return {
    type: fields.get('type') ?? '',
    period: fields.get('period') ?? '',
    tags: (fields.get('tags') ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

function parseFile(file: string, source: string, warnings: string[]): Section[] {
  const base = path.basename(file, '.md');
  // Everything before the first `## ` (the file's `# ` title) is not a chunk.
  const parts = source.split(/^## /m).slice(1);
  const seen = new Set<string>();
  return parts.map((part) => {
    const lines = part.split('\n');
    const title = lines[0].trim();
    const firstContent = lines.findIndex((line, i) => i > 0 && line.trim() !== '');
    const metadata = firstContent > 0 ? parseMetadata(lines[firstContent].trim()) : null;
    const bodyStart = metadata ? firstContent + 1 : 1;
    const text = lines.slice(bodyStart).join('\n').trim();

    let id = `${base}/${slugify(title)}`;
    for (let n = 2; seen.has(id); n++) id = `${base}/${slugify(title)}-${n}`;
    seen.add(id);

    if (!metadata) warnings.push(`${file} › "${title}": missing metadata line (Type: … · Period: … · Tags: …).`);
    const count = words(text);
    if (count > MAX_WORDS) warnings.push(`${file} › "${title}": ${count} words (over ~${MAX_WORDS}); consider splitting it.`);
    if (count === 0) warnings.push(`${file} › "${title}": empty body.`);

    return { id, file, title, type: metadata?.type ?? '', period: metadata?.period ?? '', tags: metadata?.tags ?? [], text };
  });
}

/** Spaces call starts evenly so we never exceed MAX_CALLS_PER_MINUTE. */
function throttle(perMinute: number) {
  const gap = 60_000 / perMinute;
  let next = 0;
  return async () => {
    const wait = next - Date.now();
    if (wait > 0) await sleep(wait);
    next = Math.max(Date.now(), next) + gap;
  };
}

async function loadPrevious(): Promise<Map<string, number[]>> {
  const vectors = new Map<string, number[]>();
  try {
    const previous = JSON.parse(await readFile(OUT_FILE, 'utf8')) as Partial<EmbeddingIndex>;
    if (previous.model !== EMBED_MODEL || previous.dims !== EMBED_DIMS) return vectors;
    for (const item of [...(previous.chunks ?? []), ...(previous.starters ?? [])]) {
      if (item.hash && item.embedding?.length === EMBED_DIMS) vectors.set(item.hash, item.embedding);
    }
  } catch {
    /* no previous index: embed everything */
  }
  return vectors;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set. Add it to .env (see .env.example).');

  let files: string[];
  try {
    files = (await readdir(KNOWLEDGE_DIR)).filter((name) => name.endsWith('.md')).sort();
  } catch {
    throw new Error(`No knowledge/ directory at ${KNOWLEDGE_DIR}.`);
  }
  if (files.length === 0) throw new Error('knowledge/ has no .md files.');

  const warnings: string[] = [];
  const sections: Section[] = [];
  for (const file of files) {
    sections.push(...parseFile(file, await readFile(path.join(KNOWLEDGE_DIR, file), 'utf8'), warnings));
  }
  const starterQuestions = JSON.parse(await readFile(STARTERS_FILE, 'utf8')) as { question: string; sources: string[] }[];
  const sectionIds = new Set(sections.map((section) => section.id));
  for (const { question, sources } of starterQuestions) {
    if (!sources?.length) throw new Error(`Starter "${question}" in src/chat/starters.json has no pinned sources.`);
    const unknown = sources.filter((id) => !sectionIds.has(id));
    if (unknown.length) throw new Error(`Starter "${question}" pins unknown chunk ids: ${unknown.join(', ')}`);
  }

  const previous = await loadPrevious();
  const ai = new GoogleGenAI({ apiKey });
  const wait = throttle(MAX_CALLS_PER_MINUTE);
  let embedded = 0;
  let reused = 0;

  const vectorFor = async (text: string, label: string) => {
    const hash = vectorHash(text);
    const cached = previous.get(hash);
    if (cached) {
      reused++;
      return { hash, embedding: cached };
    }
    await wait();
    const values = await embedText(ai, text);
    const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
    if (Math.abs(norm - 1) > 0.01) warnings.push(`${label}: embedding norm is ${norm.toFixed(4)}, expected ~1.`);
    embedded++;
    console.log(`  embedded ${label}`);
    // 6 decimals keeps the file small without changing rankings.
    return { hash, embedding: values.map((v) => Math.round(v * 1e6) / 1e6) };
  };

  console.log(`Indexing ${sections.length} chunks and ${starterQuestions.length} starter questions with ${EMBED_MODEL} (${EMBED_DIMS} dims)…`);
  const chunks: IndexChunk[] = [];
  for (const section of sections) {
    chunks.push({ ...section, ...(await vectorFor(documentText(section.title, section.text), section.id)) });
  }
  const starters: IndexStarter[] = [];
  for (const { question, sources } of starterQuestions) {
    starters.push({ question, sources, ...(await vectorFor(queryText(question), `starter "${question}"`)) });
  }

  // indexVersion excludes builtAt, so it changes only when the content does.
  const indexVersion = sha256(JSON.stringify({ model: EMBED_MODEL, dims: EMBED_DIMS, chunks, starters })).slice(0, 16);
  const index: EmbeddingIndex = { model: EMBED_MODEL, dims: EMBED_DIMS, indexVersion, builtAt: new Date().toISOString(), chunks, starters };
  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(index) + '\n');

  const perFile = new Map<string, number>();
  for (const chunk of chunks) perFile.set(chunk.file, (perFile.get(chunk.file) ?? 0) + 1);
  const lengths = chunks.map((chunk) => words(chunk.text));
  const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);

  console.log(`\nWrote ${path.relative(ROOT, OUT_FILE)} (indexVersion ${indexVersion})`);
  console.log(`Chunks: ${chunks.length}`);
  for (const [file, count] of perFile) console.log(`  ${file.padEnd(16)} ${count}`);
  console.log(`Starters: ${starters.length}`);
  console.log(`Average length: ${avg} words (min ${Math.min(...lengths)}, max ${Math.max(...lengths)})`);
  console.log(`Embedding calls: ${embedded} (reused ${reused} unchanged vectors)`);
  if (warnings.length) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const warning of warnings) console.warn(`  ! ${warning}`);
  } else {
    console.log('No warnings.');
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
