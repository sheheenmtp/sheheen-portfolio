# Sheheen Portfolio

A responsive personal portfolio for Muhammed Sheheen M T P, focused on AI/ML work, projects, experience, and technical skills. The site is a React single-page application with an optional Express service that sends contact-form messages through Gmail SMTP.

[View the live site](https://sheheen-portfolio.vercel.app)

## Features

- Responsive, dark-themed single-page layout
- Animated hero, content sections, and neural-network background
- Project, experience, and technology showcases
- Downloadable resume
- Contact form backed by an Express and Nodemailer API
- Vercel Analytics and Speed Insights

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 6 |
| UI | Tailwind-generated CSS, Radix UI primitives, Lucide icons |
| Animation | Motion for React |
| Backend | Node.js, Express, Nodemailer |
| Monitoring | Vercel Analytics, Vercel Speed Insights |

## Repository structure

```text
.
├── public/
│   └── Sheheen_Resume.pdf       # Downloadable resume
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI primitives
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Experience.tsx
│   │   ├── Hero.tsx
│   │   ├── NeuralBackground.tsx
│   │   ├── Projects.tsx
│   │   └── TechStack.tsx
│   ├── App.tsx                  # Page composition
│   ├── index.css                # Generated utilities and global theme
│   └── main.tsx                 # Browser entry point and analytics
├── backend/
│   ├── .env.example             # Backend environment template
│   ├── server.js                # Contact API
│   ├── test-endpoint.js         # Endpoint smoke test
│   └── package.json
├── index.html
├── package.json                 # Frontend dependencies and scripts
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

The frontend currently posts the contact form to `http://localhost:3001/send-email`, so port `3001` should be used for local development.

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

The Express API must be deployed separately to a Node.js host such as Render or Railway, with `EMAIL_USER` and `EMAIL_PASS` configured in the host's secret manager. Before deploying, replace the hard-coded local API URL in `src/components/Contact.tsx` with the deployed backend URL or an environment-based configuration.

## Content updates

Portfolio content is colocated with the component that renders it:

- Introduction and resume link: `src/components/Hero.tsx`
- Biography: `src/components/About.tsx`
- Featured work: `src/components/Projects.tsx`
- Work and education history: `src/components/Experience.tsx`
- Skills: `src/components/TechStack.tsx`
- Contact details and form endpoint: `src/components/Contact.tsx`

## Current implementation notes

- The contact endpoint is hard-coded for local development; the frontend does not currently read an API URL from an environment variable.
- CORS currently allows requests from any origin. Restrict it to the deployed frontend origin in production.
- The custom rate-limit middleware is registered after the `/send-email` route, so it does not currently protect that endpoint. Move it before the route or use a maintained rate-limiting package before relying on it.
- User-provided values are interpolated into the HTML email. Escape or sanitize them before treating the endpoint as production-ready.
- There is no automated frontend test suite or lint script at present.

## Attributions

The interface includes components derived from [shadcn/ui](https://ui.shadcn.com/) under the MIT license. Additional attribution details are in [`src/Attributions.md`](src/Attributions.md).
