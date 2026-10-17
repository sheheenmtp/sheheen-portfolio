# Sheheen Portfolio

Personal portfolio for Muhammed Sheheen M T P, Applied AI engineer in the UAE specialising in AI automation. It is a React single-page site on Vercel, with a serverless function that emails contact-form messages.

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
| Quality | TypeScript strict mode, ESLint (typescript-eslint, react-hooks) |
| Contact form | Vercel serverless function (`api/contact.ts`), Nodemailer over Gmail |
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
│   │   └── site.css             # Component styles
│   ├── hooks/useReveal.ts       # Scroll reveals via IntersectionObserver
│   ├── components/
│   │   ├── ui/                  # Button, Input, Textarea, HandLine, Todo
│   │   ├── Navbar.tsx, SocialRail.tsx, TalkBadge.tsx
│   │   ├── Hero.tsx, About.tsx, Projects.tsx
│   │   ├── Experience.tsx       # "Path" timeline (work and education)
│   │   ├── TechStack.tsx        # Skills
│   │   ├── Credentials.tsx      # Certificates
│   │   └── Contact.tsx
│   ├── App.tsx
│   └── main.tsx
├── api/contact.ts               # Contact form endpoint (Vercel function)
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

Vite serves the site at `http://localhost:3000`. The contact form posts to `/api/contact`, which only exists on Vercel; locally it shows a "not sent, email me directly" message. To run the function locally too, use the Vercel CLI: `npx vercel dev`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production bundle in `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run typecheck` | Type-check with TypeScript |
| `npm run lint` | Lint with ESLint (warnings fail) |
| `npm run check` | Typecheck, lint and build in one go |

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

## Production build and deployment

Push to GitHub; Vercel builds the Vite site into `dist/` and deploys `api/contact.ts` as a function automatically.

## Content updates

All text lives in [`src/content.ts`](src/content.ts). Edit it there rather than in the components. Items with a `todo` field render a visible "TODO:" note on the page until they are filled in. Only add real projects, roles and numbers.

The hero portrait is `src/assets/portrait-cutout.webp`: a black-and-white cutout with a transparent background, 720 × 1040 px. Replace it with another cutout of the same proportions.

## Attributions

Fonts: Bricolage Grotesque, Atkinson Hyperlegible, Kalam and Manjari (SIL Open Font License). Icons: Lucide (ISC). See [`src/Attributions.md`](src/Attributions.md).
