# Sheheen Portfolio

Personal portfolio for Muhammed Sheheen M T P, Applied AI engineer in the UAE specialising in AI automation. It is a React single-page site on Vercel, with two serverless functions: one emails contact-form messages, the other powers **Ask about Sheheen**, a chat assistant that answers visitors' questions from a small knowledge base (retrieval-augmented generation on Gemini).

[View the live site](https://sheheenmtp.vercel.app/)

## Design: "Margin Notes"

A light, notebook-like layout: off-white paper with grain, a black-and-white portrait in an arch, a hand-drawn sage line that draws itself around it, handwritten margin notes, and a rotating "let's talk" badge in English and Malayalam.

- **Tokens:** every colour, font, size, space, radius, shadow and timing is defined once in [`src/styles/tokens.css`](src/styles/tokens.css). [`src/styles/site.css`](src/styles/site.css) only references those variables.
- **Type:** Bricolage Grotesque (headings), Atkinson Hyperlegible (body), Kalam (handwritten notes) and Manjari (Malayalam), all self-hosted through Fontsource.
- **Motion:** mostly CSS. One hero entrance (text rises, the line draws itself), a slowly rotating badge, and gentle scroll reveals. On scroll, handwritten notes write themselves, the project pipeline diagrams build one step at a time, and the Path timeline fills as you read (`src/hooks/useTimelineProgress.ts`). Everything is visible without JavaScript and all motion is off under `prefers-reduced-motion`.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 6 |
| Styling | Plain CSS with design tokens, Fontsource fonts, Lucide icons |
| Quality | TypeScript strict mode, ESLint (typescript-eslint, react-hooks), Node's built-in test runner (`node:test`) |
| Contact form | Vercel serverless function (`api/contact.ts`), Nodemailer over Gmail |
| Chat assistant | Vercel serverless function (`api/chat.ts`), Gemini (`gemini-3.5-flash-lite`, falling back to `gemini-3.1-flash-lite`), `gemini-embedding-2` embeddings, Upstash Redis (rate limit, answer cache, question log) |
| Monitoring | Vercel Analytics, Vercel Speed Insights |

## Repository structure

```text
.
├── public/
│   ├── Sheheen_Resume.pdf       # Downloadable résumé
│   ├── favicon.svg, apple-touch-icon.png, og-image.png
├── src/
│   ├── content.ts               # All copy: profile, projects, path, skills, certificates
│   ├── styles/
│   │   ├── tokens.css           # Design tokens (the only place values are defined)
│   │   ├── site.css             # Component styles
│   │   └── chat.css             # Chat widget styles (uses the same tokens)
│   ├── hooks/useReveal.ts       # Scroll reveals via IntersectionObserver
│   ├── chat/
│   │   ├── starters.json        # Starter chips and the chunks each one answers from
│   │   ├── stream.ts            # Client for the /api/chat SSE stream
│   │   ├── sources.ts           # Knowledge chunk id → page anchor for the Sources row
│   │   └── useSmoothText.ts     # Smooths the reveal of streamed text
│   ├── components/
│   │   ├── ui/                  # Button, Input, Textarea, HandLine, Todo
│   │   ├── Navbar.tsx, SocialRail.tsx, TalkBadge.tsx
│   │   ├── Hero.tsx, About.tsx, Projects.tsx
│   │   ├── Experience.tsx       # "Path" timeline (work and education)
│   │   ├── TechStack.tsx        # Skills
│   │   ├── Credentials.tsx      # Certificates
│   │   ├── Contact.tsx
│   │   ├── ChatAssistant.tsx    # Chat launcher (main bundle)
│   │   └── chat/ChatPanel.tsx   # Chat panel (lazy-loaded on first open)
│   ├── App.tsx
│   └── main.tsx
├── api/
│   ├── contact.ts               # Contact form endpoint (Vercel function)
│   ├── chat.ts                  # Chat endpoint; the SSE protocol is documented at the top
│   ├── _data/embeddings.json    # Built search index (generated, committed)
│   └── _lib/
│       ├── pipeline.ts          # One request end to end: cache → retrieval → generation → log
│       ├── rag.ts               # Validation, retrieval, system prompt
│       ├── generate.ts          # Streaming generation with model fallback
│       ├── embeddings.ts        # Embedding model, index types
│       ├── cache.ts             # Exact and semantic answer cache
│       ├── ratelimit.ts         # 20 questions an hour per IP
│       ├── log.ts               # Anonymous question log
│       ├── kv.ts, env.ts        # Upstash client and credentials
│       ├── deps.ts              # Production wiring
│       └── text.ts              # Normalising and hashing helpers
├── knowledge/                   # Chat knowledge base (Markdown, one chunk per ## section)
├── scripts/
│   ├── build-index.ts           # Embeds knowledge/ into api/_data/embeddings.json
│   ├── logs.ts                  # Summarises the question log
│   ├── eval.ts, eval-lib.ts     # Live answer-quality eval and its checks
│   └── eval-cases.json          # Eval cases
├── tests/                       # Backend and widget-client tests
├── index.html                   # Meta tags, structured data, no-JS fallback
└── vite.config.ts
```

## Local development

```bash
git clone https://github.com/sheheenmtp/sheheen-portfolio.git
cd sheheen-portfolio
npm install
npm run dev
```

Vite serves the site at `http://localhost:3000`. The contact form and the chat post to `/api/contact` and `/api/chat`, which only exist on Vercel; under `npm run dev` the form shows a "not sent, email me directly" message and the chat shows an error. To run the functions locally too, use the Vercel CLI: `npx vercel dev`.

For the chat, copy `.env.example` to `.env` and paste in `GEMINI_API_KEY` (and the Upstash variables, if you want the cache and log locally). Don't run `vercel env pull`: it overwrites `.env` and would wipe values pasted in by hand.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production bundle in `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run typecheck` | Type-check with TypeScript |
| `npm run lint` | Lint with ESLint (warnings fail) |
| `npm test` | Run the tests in `tests/` (no network or API keys needed) |
| `npm run check` | Typecheck, lint, test and build in one go |
| `npm run build:index` | Rebuild the chat search index after editing `knowledge/` (needs `GEMINI_API_KEY`) |
| `npm run logs` | Summarise the chat question log for the last 7 days; `npm run logs -- 30` for 30 (needs Upstash) |
| `npm run eval` | Run the live answer-quality eval against Gemini (needs `GEMINI_API_KEY`, uses quota) |

## Contact form

`api/contact.ts` is deployed by Vercel as `POST /api/contact`. It validates the input, escapes it before putting it in the email, rate-limits each IP (best effort, per serverless instance), silently drops bot submissions (a hidden honeypot field and a minimum fill time), and emails the message through Gmail with the visitor as Reply-To.

### Setup (once)

1. In your Google Account, turn on 2-Step Verification, then create an **App password** (Security → App passwords). Google shows a 16-character password.
2. In Vercel → Project → Settings → Environment Variables, add for Production (and Preview if you want it there too):

| Variable | Required | Purpose |
| --- | --- | --- |
| `EMAIL_USER` | Yes | Gmail address that sends the messages |
| `EMAIL_PASS` | Yes | The Gmail App password (never your normal password) |
| `CONTACT_TO` | No | Where messages are delivered; defaults to `EMAIL_USER` |

3. Redeploy. Until the variables are set the endpoint answers `503` and the form tells visitors to email directly.

Never commit `.env` files or credentials.

### Responses

| Status | Meaning |
| --- | --- |
| 200 | Sent (bots also get 200 so they do not retry) |
| 400 | Missing or invalid name, email or message |
| 405 | Not a POST |
| 429 | Too many messages from one IP in 10 minutes |
| 502 | Gmail refused or failed to send |
| 503 | `EMAIL_USER` / `EMAIL_PASS` not set |

## Chat assistant: "Ask about Sheheen"

A launcher in the bottom corner opens a chat panel. Visitors ask about Sheheen's work, skills and experience, and the answers come only from the Markdown files in [`knowledge/`](knowledge). It runs on the Gemini free tier, so the design keeps model calls to a minimum.

### How a question is answered

[`api/_lib/pipeline.ts`](api/_lib/pipeline.ts) handles one request end to end:

1. **Validate.** The last message must come from the visitor (1–500 characters). Only the last 6 messages are used.
2. **Rate limit.** 20 questions an hour per IP, in a sliding window (Upstash). Over the limit, the endpoint returns `429` with `Retry-After`.
3. **Exact cache** (first question in a conversation only). A normalised copy of the question is looked up, and a hit costs no Gemini calls.
4. **Embed the question.** This takes one `gemini-embedding-2` call. Starter chips use embeddings precomputed in the index. Short follow-ups (under 6 words) are combined with the previous question, so "what stack?" still finds the right project.
5. **Semantic cache** (first question only). The same embedding is compared with cached questions. A similarity of at least 0.95 counts as a hit. The threshold is high on purpose: "Where is Sheheen from originally?" scores 0.935 against "Where is Sheheen based?" and needs a different answer.
6. **Retrieve.** The 5 closest chunks with a similarity of at least 0.6 go into the system prompt as context.
7. **Generate.** `gemini-3.5-flash-lite` streams the answer (temperature 0.2, at most 500 output tokens, minimal thinking). If it fails or sends nothing within 12 seconds, `gemini-3.1-flash-lite`, which has its own free-tier quota, takes over. Fallback happens only before the first token; if an answer breaks off midway, the visitor sees an error rather than a spliced answer.
8. **Cache and log.** Complete answers to first questions are cached for 30 days. Every request gets an entry in the anonymous question log.

The system prompt in [`api/_lib/rag.ts`](api/_lib/rag.ts) limits the model to the retrieved context. When the context doesn't cover a question, the answer starts with "That isn't in my knowledge base about Sheheen." and points to the contact section. Unrelated requests get "I can only answer questions about Sheheen." Visitor messages are treated as questions, not instructions. Start date, salary and visa are each covered only when asked about directly.

**Starter chips.** The questions in [`src/chat/starters.json`](src/chat/starters.json) each name the chunks they answer from (`sources`), instead of using search. That way "Who is Sheheen?" always gets the profile overview. Chips skip the semantic cache, so a paraphrase answered by normal search is never replayed for them.

### Editing the knowledge base

Each `## ` heading in `knowledge/*.md` is one chunk (at most 500 words). Its id is `<file>/<heading slug>`. The first line under the heading must be the metadata line:

```markdown
## AI Tutor Platform (adaptive coding practice with LLM hints)
Type: project · Period: Aug 2025 – Aug 2026 · Tags: AI Tutor, FastAPI, PostgreSQL

The AI Tutor Platform is a full-stack coding-practice application. …
```

After editing:

1. Run `npm run build:index`. Only chunks whose text changed are re-embedded, and calls are throttled to 60 a minute. Starter-chip questions are embedded too.
2. If you added a chunk, map its id to a page anchor in [`src/chat/sources.ts`](src/chat/sources.ts). `npm test` fails until every chunk has one.
3. Commit `api/_data/embeddings.json` together with the Markdown.

The index is built locally and committed, not built on Vercel, so a deploy never depends on Gemini quota. Cache keys include the index version and a hash of the system prompt, so new content or a prompt change retires old cached answers automatically.

### API

`POST /api/chat` with `{ "messages": [{ "role": "user" | "assistant", "content": string }, …] }`. Errors that happen before streaming starts come back as JSON `{ "error": string }`. Otherwise the response is a Server-Sent Events stream:

| Event | Data | When |
| --- | --- | --- |
| `sources` | `[{ id, title, file, score }]` (may be empty) | First |
| `token` | `{ text }` | One or more times |
| `done` | `{ grounded }` | The answer finished |
| `error` | `{ error }` | Instead of `done`: models busy, or the answer broke off |

`grounded` is false for "not in my knowledge base" and off-topic replies, and when no chunk passed the similarity threshold. The widget then hides the Sources row. Cached answers use the same events, with the whole answer in a single `token`. The full contract is in the header comment of [`api/chat.ts`](api/chat.ts).

| Status | Meaning |
| --- | --- |
| 200 | SSE stream (check for an `error` event) |
| 400 | Invalid body, empty question, over 500 characters, or the last message isn't from the user |
| 405 | Not a POST |
| 429 | Over 20 questions an hour (`Retry-After` gives the seconds) |
| 500 | `GEMINI_API_KEY` not set, or another server error |

### Setup (once)

In Vercel → Project → Settings → Environment Variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Chat and embeddings ([Google AI Studio](https://aistudio.google.com/apikey)) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | No | Rate limit, answer cache and question log |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | No | The same, under the names the Vercel Marketplace Upstash integration creates; either pair works |

Without Upstash the assistant still works: the rate limiter falls back to memory (best effort, per serverless instance), the cache is off, and questions go to the function log instead.

### Privacy

The line under the input says "Questions are saved anonymously to improve answers." Each log entry holds the question, the answer, the source titles, the model, the timings and whether it was cached. It never holds an IP address or user agent. The IP is used only as the rate-limit key. Entries expire after 90 days.

### The widget

Only a small launcher is in the main bundle. The panel is lazy-loaded the first time it opens, and prefetched on hover or focus. Gemini streams in a few large chunks, so the text reveal is smoothed on the client (instant under `prefers-reduced-motion`). Sources appear only after a grounded answer finishes, and each one links to its section of the page. The panel shows loading, error and rate-limit states and has a reset button. It works from the keyboard (focus trap, Esc closes), announces replies through `aria-live`, and fits a 360 px screen.

### Testing and monitoring

- `npm test` covers the answer cache (exact, semantic, follow-ups, prompt versioning), starter chips, model fallback, the question log, the eval-case format, the `.js` import specifiers Vercel needs, the client's SSE parser and the anchor map. It uses fakes, so it needs no keys or network.
- `npm run logs` lists recent questions, cache hit rates, ungrounded answers and errors, so you can see what the knowledge base is missing.
- `npm run eval` asks the real assistant every case in [`scripts/eval-cases.json`](scripts/eval-cases.json) and checks the answers: the expected `grounded` flag, regexes the answer must and must not match, how often a phrase may occur, and which chunks retrieval must find. It bypasses the cache, doesn't write to the question log, waits 6 s between questions to stay within the free tier, and retries a busy or timed-out request once. Run it after changing the prompt or the knowledge base; `--only <id>` runs one case and `--json <file>` saves the results. It needs `GEMINI_API_KEY` and uses real quota, so it is not part of `npm run check`.

## Production build and deployment

Push to GitHub; Vercel builds the Vite site into `dist/` and deploys `api/contact.ts` and `api/chat.ts` as functions automatically. The chat index (`api/_data/embeddings.json`) is committed, so the build makes no Gemini calls.

## Content updates

All text lives in [`src/content.ts`](src/content.ts). Edit it there rather than in the components. Items with a `todo` field render a visible "TODO:" note on the page until they are filled in. Only add real projects, roles and numbers.

The hero portrait is `src/assets/portrait-cutout.webp`: a black-and-white cutout with a transparent background, 720 × 1040 px. Replace it with another cutout of the same proportions.

## Attributions

Fonts: Bricolage Grotesque, Atkinson Hyperlegible, Kalam and Manjari (SIL Open Font License). Icons: Lucide (ISC). See [`src/Attributions.md`](src/Attributions.md).
