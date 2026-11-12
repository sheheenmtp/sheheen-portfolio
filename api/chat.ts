/**
 * POST /api/chat — the "Ask about Sheheen" assistant.
 *
 * Request:  { "messages": [{ "role": "user" | "assistant", "content": string }, ...] }
 *           The last message must be from the user (1–500 characters). Only the last
 *           6 messages are used.
 *
 * Errors before streaming starts are JSON { "error": string } with status
 *   400 invalid request · 405 wrong method · 429 rate limited (Retry-After header)
 *   500 server misconfiguration
 *
 * Otherwise the response is a Server-Sent Events stream (text/event-stream):
 *   event: sources  data: [{ "id", "title", "file", "score" }]   (may be [])
 *   event: token    data: { "text": string }                      (one or more)
 *   event: done     data: { "grounded": boolean }
 * or, if the models are busy/unavailable or the answer breaks off, instead of `done`:
 *   event: error    data: { "error": string }
 * `grounded` is false for "not in my knowledge base" / off-topic replies and when no
 * source passed the similarity threshold; the widget then hides the Sources row.
 * Cached answers use the same events (a single `token` with the whole answer).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { productionDeps } from './_lib/deps.js';
import { runChat } from './_lib/pipeline.js';
import { HttpError, parseMessages } from './_lib/rag.js';
import { LIMIT, limit } from './_lib/ratelimit.js';

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }

  let messages;
  let deps;
  try {
    messages = parseMessages(req.body);
    deps = productionDeps();
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.status).json({ error: error.message });
    console.error('[chat] setup failed:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
  }

  // The IP is used only as the rate-limit key; it is never logged or stored with questions.
  const rate = await limit(clientIp(req));
  if (!rate.success) {
    res.setHeader('Retry-After', String(Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000))));
    return res.status(429).json({ error: `You have reached the limit of ${LIMIT} questions an hour. Please try again later.` });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  let closed = false;
  res.on('close', () => {
    if (!res.writableFinished) closed = true;
  });
  const send = (event: string, data: unknown) => {
    if (!closed) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  await runChat(messages, {
    sources: (sources) => send('sources', sources),
    token: (text) => send('token', { text }),
    done: (data) => send('done', data),
    error: (message) => send('error', { error: message }),
    closed: () => closed,
  }, deps);
  res.end();
}
