/**
 * Offline tests for the chat widget's client code (src/chat/): the SSE parser,
 * the stream client against a fake fetch, and the knowledge-id → page-anchor map.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, describe, it } from 'node:test';
import { sourceAnchors, sourceLinks } from '../src/chat/sources.ts';
import { ChatHttpError, createSseParser, CUT_OFF_MESSAGE, streamChat, type StreamHandlers } from '../src/chat/stream.ts';

describe('createSseParser', () => {
  it('parses events split across arbitrary chunks', () => {
    const events: [string, string][] = [];
    const parser = createSseParser((event, data) => events.push([event, data]));
    const raw = 'event: sources\ndata: []\n\nevent: token\ndata: {"text":"Hi"}\n\nevent: done\ndata: {"grounded":true}\n\n';
    for (const char of raw) parser.push(char);
    parser.end();
    assert.deepEqual(events, [
      ['sources', '[]'],
      ['token', '{"text":"Hi"}'],
      ['done', '{"grounded":true}'],
    ]);
  });

  it('handles CRLF, comments, multi-line data and a trailing event without a blank line', () => {
    const events: [string, string][] = [];
    const parser = createSseParser((event, data) => events.push([event, data]));
    parser.push(': keep-alive\r\n\r\nevent: token\r\ndata: a\r\ndata: b\r\n\r\nevent: done\ndata: {}');
    parser.end();
    assert.deepEqual(events, [
      ['token', 'a\nb'],
      ['done', '{}'],
    ]);
  });
});

describe('streamChat', () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  const respondWith = (response: Response) => {
    globalThis.fetch = async () => response;
  };

  const recorder = () => {
    const calls: [string, unknown][] = [];
    const handlers: StreamHandlers = {
      sources: (s) => calls.push(['sources', s]),
      token: (t) => calls.push(['token', t]),
      done: (g) => calls.push(['done', g]),
      error: (e) => calls.push(['error', e]),
    };
    return { calls, handlers };
  };

  const sse = (body: string) =>
    new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });

  it('streams sources, tokens and done', async () => {
    respondWith(
      sse(
        'event: sources\ndata: [{"id":"faq/x","title":"X","file":"faq.md","score":0.8}]\n\n' +
          'event: token\ndata: {"text":"Hello "}\n\nevent: token\ndata: {"text":"there"}\n\n' +
          'event: done\ndata: {"grounded":true}\n\n',
      ),
    );
    const { calls, handlers } = recorder();
    await streamChat([{ role: 'user', content: 'Hi' }], handlers);
    assert.deepEqual(calls, [
      ['sources', [{ id: 'faq/x', title: 'X', file: 'faq.md', score: 0.8 }]],
      ['token', 'Hello '],
      ['token', 'there'],
      ['done', true],
    ]);
  });

  it('passes a stream error through', async () => {
    respondWith(sse('event: sources\ndata: []\n\nevent: error\ndata: {"error":"Busy."}\n\n'));
    const { calls, handlers } = recorder();
    await streamChat([{ role: 'user', content: 'Hi' }], handlers);
    assert.deepEqual(calls.at(-1), ['error', 'Busy.']);
  });

  it('reports a stream that ends without done as cut off', async () => {
    respondWith(sse('event: token\ndata: {"text":"Half an"}\n\n'));
    const { calls, handlers } = recorder();
    await streamChat([{ role: 'user', content: 'Hi' }], handlers);
    assert.deepEqual(calls.at(-1), ['error', CUT_OFF_MESSAGE]);
  });

  it('throws ChatHttpError with Retry-After on 429', async () => {
    respondWith(
      new Response(JSON.stringify({ error: 'Too many.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '120' },
      }),
    );
    const { handlers } = recorder();
    await assert.rejects(streamChat([{ role: 'user', content: 'Hi' }], handlers), (error: unknown) => {
      assert.ok(error instanceof ChatHttpError);
      assert.equal(error.status, 429);
      assert.equal(error.retryAfter, 120);
      assert.equal(error.message, 'Too many.');
      return true;
    });
  });
});

describe('sourceAnchors', () => {
  const index = JSON.parse(readFileSync(new URL('../api/_data/embeddings.json', import.meta.url), 'utf8')) as {
    chunks: { id: string }[];
  };

  it('maps every knowledge chunk to a page anchor', () => {
    const missing = index.chunks.map((chunk) => chunk.id).filter((id) => !sourceAnchors[id]);
    assert.deepEqual(missing, [], `Add these chunk ids to src/chat/sources.ts: ${missing.join(', ')}`);
  });

  it('only points at anchors that exist in the page components', () => {
    const components = ['About', 'Projects', 'Experience', 'TechStack', 'Credentials', 'Contact']
      .map((name) => readFileSync(new URL(`../src/components/${name}.tsx`, import.meta.url), 'utf8'))
      .join('\n');
    const content = readFileSync(new URL('../src/content.ts', import.meta.url), 'utf8');
    for (const { href } of Object.values(sourceAnchors)) {
      const id = href.slice(1);
      const projectId = id.endsWith('-title') ? id.slice(0, -'-title'.length) : null;
      const found = components.includes(`id="${id}"`) || (projectId !== null && content.includes(`id: '${projectId}'`));
      assert.ok(found, `${href} is not an id on the page`);
    }
  });

  it('dedupes links by section, best score first, and skips unknown ids', () => {
    const links = sourceLinks([
      { id: 'skills/machine-learning-nlp-and-llm-skills', title: '', file: '', score: 0.7 },
      { id: 'faq/has-sheheen-fine-tuned-or-trained-models', title: '', file: '', score: 0.9 },
      { id: 'skills/data-automation-infrastructure-and-tools', title: '', file: '', score: 0.65 },
      { id: 'unknown/chunk', title: '', file: '', score: 0.99 },
    ]);
    assert.deepEqual(
      links.map((link) => link.href),
      ['#nmt-title', '#skills'],
    );
  });
});
