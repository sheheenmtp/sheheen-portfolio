# Sheheen Portfolio

Personal portfolio for Muhammed Sheheen M T P, Applied AI engineer in the UAE specialising in AI automation. It is a React single-page site with an optional Express service for contact-form email.

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
| Backend | Node.js, Express, Nodemailer (optional) |
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
├── backend/                     # Optional contact API
├── index.html                   # Meta tags, structured data, no-JS fallback
└── vite.config.ts
```

## Prerequisites

- Node.js 18 or newer
- npm
- A Gmail account with two-factor authentication and an app password, if the contact form should send email

## Local development

The frontend and backend use separate dependency trees and run as separate processes.

### 1. Install the frontend

```bash
git clone https://github.com/sheheenmtp/sheheen-portfolio.git
cd sheheen-portfolio
npm install
npm run dev
```

Vite serves the site at `http://localhost:3000` and opens it in the default browser.

### 2. Configure and start the contact API

In a second terminal:

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with real credentials:

```dotenv
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=3001
```

Then start the API:

```bash
npm run dev
```

The contact form only appears when `VITE_API_URL` is set for the frontend. For local testing create `.env.local` in the repository root with `VITE_API_URL=http://localhost:3001`.

### Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `EMAIL_USER` | Yes, for email | None | Gmail address used as sender and recipient |
| `EMAIL_PASS` | Yes, for email | None | Gmail app password; do not use the account password |
| `PORT` | No | `3001` | Backend HTTP port |

Never commit `.env` or real email credentials.

## Available scripts

From the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production bundle in `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run typecheck` | Type-check with TypeScript |
| `npm run lint` | Lint with ESLint (warnings fail) |
| `npm run check` | Typecheck, lint and build in one go |

From `backend/`:

| Command | Description |
| --- | --- |
| `npm start` | Start the API with Node.js |
| `npm run dev` | Start the API with Nodemon and reload on changes |
| `npm test` | Run the endpoint smoke test against a running API |

The backend smoke test attempts to send a real message when valid credentials are configured.

## Contact API

### Health check

```http
GET /
```

Successful response:

```json
{
  "message": "Portfolio backend server is running!"
}
```

### Send a message

```http
POST /send-email
Content-Type: application/json
```

Request body:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "message": "Hello from the portfolio."
}
```

Successful response (`200`):

```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

Invalid or missing input returns `400`; mail transport failures return `500`.

To exercise the validation path without sending mail:

```bash
curl -X POST http://localhost:3001/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"invalid","message":"Hello"}'
```

## Production build and deployment

Build the frontend with:

```bash
npm run build
```

The static output is written to `dist/`. It can be deployed to Vercel or any static host that supports a Vite single-page application.

The Express API must be deployed separately to a Node.js host such as Render or Railway, with `EMAIL_USER` and `EMAIL_PASS` configured in the host's secret manager. Then set `VITE_API_URL` to the deployed backend URL in the Vercel project settings; without it the site shows email, phone and profile links only.

## Content updates

All text lives in [`src/content.ts`](src/content.ts). Edit it there rather than in the components. Items with a `todo` field render a visible "TODO:" note on the page until they are filled in. Only add real projects, roles and numbers.

The hero portrait is `src/assets/portrait-cutout.webp`: a black-and-white cutout with a transparent background, 720 × 1040 px. Replace it with another cutout of the same proportions.

## Backend notes

- CORS currently allows requests from any origin. Restrict it to the deployed frontend origin in production.
- The custom rate-limit middleware is registered after the `/send-email` route, so it does not currently protect that endpoint. Move it before the route or use a maintained rate-limiting package before relying on it.
- User-provided values are interpolated into the HTML email. Escape or sanitize them before treating the endpoint as production-ready.

## Attributions

Fonts: Bricolage Grotesque, Atkinson Hyperlegible, Kalam and Manjari (SIL Open Font License). Icons: Lucide (ISC). See [`src/Attributions.md`](src/Attributions.md).
