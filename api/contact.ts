/**
 * Contact form endpoint, deployed by Vercel as a serverless function at /api/contact.
 *
 * Required environment variables (Vercel → Project → Settings → Environment Variables):
 *   EMAIL_USER  Gmail address that sends and receives the messages
 *   EMAIL_PASS  a Gmail App Password (not the account password)
 * Optional:
 *   CONTACT_TO  where messages are delivered (defaults to EMAIL_USER)
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';

type Req = IncomingMessage & { body?: unknown };
type Res = ServerResponse;

export type ContactInput = { name: string; email: string; message: string; company?: string; startedAt?: number };
export type Address = { name: string; address: string };
export type Mail = { from: Address; to: string; replyTo: Address; subject: string; text: string; html: string };
export type SendMail = (mail: Mail) => Promise<unknown>;

const LIMITS = { name: 100, email: 254, message: 5000 };
const MIN_FILL_MS = 3000; // humans take longer than 3 s to fill the form
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best effort: each warm serverless instance keeps its own counter.
const hits = new Map<string, number[]>();

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Returns an error message, or null when the input is acceptable. */
export function validate(input: ContactInput): string | null {
  if (!input.name || !input.email || !input.message) return 'Please fill in your name, email and message.';
  if (input.name.length > LIMITS.name) return 'That name is too long.';
  if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email)) return 'Please enter a valid email address.';
  if (input.message.length < 10) return 'Please write a little more in your message.';
  if (input.message.length > LIMITS.message) return `Please keep your message under ${LIMITS.message} characters.`;
  if (/[\r\n]/.test(input.name) || /[\r\n]/.test(input.email)) return 'Please enter a valid name and email.';
  return null;
}

/** Honeypot field filled, or the form was submitted implausibly fast. */
export function looksLikeBot(input: ContactInput, now = Date.now()): boolean {
  if (input.company && input.company.trim() !== '') return true;
  if (typeof input.startedAt === 'number' && now - input.startedAt < MIN_FILL_MS) return true;
  return false;
}

export function rateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export function buildMail(input: ContactInput, from: string, to: string): Mail {
  const name = input.name.trim();
  const text = `New message from your portfolio\n\nName: ${name}\nEmail: ${input.email}\n\n${input.message}\n`;
  const html =
    `<p><strong>New message from your portfolio</strong></p>` +
    `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(input.email)}</p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`;
  return {
    from: { name: 'Portfolio contact', address: from },
    to,
    replyTo: { name, address: input.email },
    subject: `Portfolio: message from ${name}`,
    text,
    html,
  };
}

function clean(body: unknown): ContactInput {
  const b = (typeof body === 'string' ? safeJson(body) : body) as Record<string, unknown> | null;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  return {
    name: str(b?.name),
    email: str(b?.email),
    message: str(b?.message),
    company: str(b?.company),
    startedAt: typeof b?.startedAt === 'number' ? b.startedAt : undefined,
  };
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function send(res: Res, status: number, payload: { success: boolean; message: string }) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function clientKey(req: Req): string {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

function gmailSender(): SendMail | null {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;
  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  return (mail) => transport.sendMail(mail);
}

export function createHandler(getSender: () => SendMail | null = gmailSender) {
  return async function handler(req: Req, res: Res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { success: false, message: 'Use POST.' });
    }
    const input = clean(req.body);

    // Pretend success to bots so they do not retry.
    if (looksLikeBot(input)) return send(res, 200, { success: true, message: 'Message sent.' });

    const problem = validate(input);
    if (problem) return send(res, 400, { success: false, message: problem });

    if (rateLimited(clientKey(req))) {
      return send(res, 429, { success: false, message: 'Too many messages in a short time. Please try again later.' });
    }

    const sender = getSender();
    const from = process.env.EMAIL_USER ?? '';
    if (!sender || !from) {
      return send(res, 503, { success: false, message: 'The contact form is not set up yet.' });
    }

    try {
      await sender(buildMail(input, from, process.env.CONTACT_TO || from));
      return send(res, 200, { success: true, message: 'Message sent.' });
    } catch (error) {
      console.error('contact: send failed', error);
      return send(res, 502, { success: false, message: 'The message could not be sent right now.' });
    }
  };
}

export default createHandler();
