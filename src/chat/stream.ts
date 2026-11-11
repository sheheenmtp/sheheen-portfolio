/**
 * Client for POST /api/chat. The protocol is documented at the top of api/chat.ts:
 * JSON errors (400/405/429/500) before streaming, otherwise SSE
 *   sources → token… → done { grounded } | error { error }.
 *
 * Kept free of DOM-only types so the offline tests can run it under Node.
 */

export type ChatRole = 'user' | 'assistant';
export type ChatMessage = { role: ChatRole; content: string };
export type ChatSource = { id: string; title: string; file: string; score: number };

export type StreamHandlers = {
  sources: (sources: ChatSource[]) => void;
  token: (text: string) => void;
  done: (grounded: boolean) => void;
  error: (message: string) => void;
};

export const MAX_QUESTION_LENGTH = 500;
export const CUT_OFF_MESSAGE = 'The answer was cut off. Please try again.';
const NETWORK_MESSAGE = 'Could not reach the assistant. Check your connection and try again.';

/** A JSON error returned before the stream started. */
export class ChatHttpError extends Error {
  readonly status: number;
  /** Seconds to wait, from the Retry-After header (429 only). */
  readonly retryAfter: number | null;

  constructor(status: number, message: string, retryAfter: number | null) {
    super(message);
    this.name = 'ChatHttpError';
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

/**
 * Incremental Server-Sent Events parser. Feed it decoded text in arbitrary chunks;
 * it calls `onEvent` once per complete event (blank-line terminated).
 */
export function createSseParser(onEvent: (event: string, data: string) => void) {
  let buffer = '';

  const dispatch = (block: string) => {
    let event = 'message';
    const data: string[] = [];
    for (const line of block.split('\n')) {
      if (!line || line.startsWith(':')) continue;
      const colon = line.indexOf(':');
      const field = colon === -1 ? line : line.slice(0, colon);
      let value = colon === -1 ? '' : line.slice(colon + 1);
      if (value.startsWith(' ')) value = value.slice(1);
      if (field === 'event') event = value;
      else if (field === 'data') data.push(value);
    }
    if (data.length) onEvent(event, data.join('\n'));
  };

  return {
    push(chunk: string) {
      buffer += chunk.replace(/\r\n?/g, '\n');
      let end = buffer.indexOf('\n\n');
      while (end !== -1) {
        dispatch(buffer.slice(0, end));
        buffer = buffer.slice(end + 2);
        end = buffer.indexOf('\n\n');
      }
    },
    /** Flushes a final event that was not followed by a blank line. */
    end() {
      if (buffer.trim()) dispatch(buffer);
      buffer = '';
    },
  };
}

/**
 * Sends the conversation and streams the reply into `handlers`. Resolves when the
 * stream ends; exactly one of `done` or `error` is called unless the request is
 * aborted. Throws ChatHttpError for JSON errors and AbortError when aborted.
 */
export async function streamChat(
  messages: ChatMessage[],
  handlers: StreamHandlers,
  signal?: AbortSignal,
  endpoint = '/api/chat',
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    handlers.error(NETWORK_MESSAGE);
    return;
  }

  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    const retry = Number(response.headers.get('Retry-After'));
    throw new ChatHttpError(
      response.status,
      body.error ?? 'Something went wrong on our side. Please try again.',
      Number.isFinite(retry) && retry > 0 ? retry : null,
    );
  }

  let finished = false;
  const parser = createSseParser((event, raw) => {
    if (finished) return;
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    if (event === 'sources' && Array.isArray(data)) handlers.sources(data as ChatSource[]);
    else if (event === 'token') handlers.token(String((data as { text?: unknown }).text ?? ''));
    else if (event === 'done') {
      finished = true;
      handlers.done(Boolean((data as { grounded?: unknown }).grounded));
    } else if (event === 'error') {
      finished = true;
      handlers.error(String((data as { error?: unknown }).error ?? CUT_OFF_MESSAGE));
    }
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      parser.push(decoder.decode(value, { stream: true }));
    }
    parser.push(decoder.decode());
    parser.end();
  } catch (error) {
    if (signal?.aborted) throw error;
  }
  if (!finished) handlers.error(CUT_OFF_MESSAGE);
}
