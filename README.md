# ONAMCONNECT

**Create. Celebrate. Connect.**

AI-powered Onam and Thiruvonam wishes.

Craft personalized greetings in Malayalam, English, and Manglish, design greeting cards, generate social captions, and share with everyone — no login required.

## Live Demo

https://onamconnect.vercel.app/

## Features

- **AI Wish Generator** — Personalized Onam and Thiruvonam wishes with recipient, language, tone, style, length, and emoji options
- **Languages** — Malayalam (Unicode), English, Manglish, and Malayalam + English mix
- **Greeting Card Studio** — Design cards and export as PNG
- **Social Captions** — Platform-aware captions for Instagram, X, WhatsApp, Facebook, and more
- **AI Message Improver** — Refine any wish (warmer, shorter, funnier, more formal)
- **Business Mode** — Professional Onam greetings for teams and clients
- **Templates** — Ready-to-use greetings you can copy or personalize
- **Favorites & History** — Stored locally in the browser (IndexedDB / local storage)
- **Multi-platform sharing** — WhatsApp, Telegram, X, Facebook, native share, Signal/Arattai fallbacks
- **Mobile-first UI** — Bottom navigation: Home, Create, Cards, Saved, More
- **PWA** — Installable app shell with offline static assets (AI requires network)
- **No login** — Full experience without accounts, email, or OTP

## Screenshots

See the live app and cover art:

- Live: https://onamconnect.vercel.app/
- Cover: [`public/cover.jpg`](public/cover.jpg)
- Poster: [`public/onam_connect_poster.jpg`](public/onam_connect_poster.jpg)

## Tech Stack

| Area | Stack |
|------|--------|
| Frontend | React 19, TypeScript, Vite 7 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4, Radix UI |
| Animation | Framer Motion |
| AI | Google Gemini via Vercel Serverless (`api/ai/*`) |
| Forms | React Hook Form + Zod |
| Card export | `@zumer/snapdom` |
| Hosting | Vercel |

## Architecture

```
Browser (React SPA)
    │
    ├── Local favorites / history (no accounts)
    │
    └── POST /api/ai/generate | improve | social-caption
              │
              └── Vercel Serverless + GEMINI_API_KEY (server-only)
                        │
                        └── Google Gemini API
```

The Gemini API key never ships to the browser. All generation goes through serverless functions.

## Getting Started

```bash
git clone https://github.com/suragms/onam-connect.git
cd onam-connect
npm install
```

Create a `.env` file (or `.env.local`) from the example:

```bash
cp .env.example .env
```

Then set:

```env
GEMINI_API_KEY=your_key_here
```

> Local Vite alone does not run Vercel serverless routes. For full AI locally, use `vercel dev` with the same `GEMINI_API_KEY`, or deploy to Vercel. The UI and non-AI features work with `npm run dev`.

## Environment Variables

| Variable | Where | Required | Description |
|----------|--------|----------|-------------|
| `GEMINI_API_KEY` | Server / Vercel env | Yes (for AI) | Google Gemini API key — **never** prefix with `VITE_` |

See [`.env.example`](.env.example).

## Development

```bash
npm run dev
```

Open http://localhost:5173/

```bash
npm run lint
npm run format
```

## Production Build

```bash
npm run build
npm run preview
```

Output is written to `dist/`. On Vercel, serverless functions under `api/` are deployed with the static site.

## Deployment

1. Import the repo in [Vercel](https://vercel.com).
2. Set **Environment Variable**: `GEMINI_API_KEY`.
3. Deploy. The live site is https://onamconnect.vercel.app/

`vercel.json` rewrites SPA routes to `index.html` while preserving `/api/ai/*`.

## Sharing

Share actions append https://onamconnect.vercel.app/ **once** at share/export time. The editable AI message itself is not permanently rewritten with the URL.

| Platform | Behavior |
|----------|----------|
| WhatsApp / Telegram / X | Opens share URL with message (+ site link) |
| Facebook | Copies message, opens Facebook sharer with site URL |
| Native Share | Uses Web Share API when available |
| Signal / Arattai | Native share or copy fallback (no official web share API) |

## Security

- Do not commit `.env`, `.env.local`, or real API keys.
- Do not use `VITE_GEMINI_API_KEY` or any client-exposed Gemini key.
- Report vulnerabilities privately — see [SECURITY.md](SECURITY.md).

## PWA

- Manifest name / short_name: **ONAMCONNECT**
- Description: AI-powered Onam and Thiruvonam wishes. Create. Celebrate. Connect.
- Service worker caches static assets; **AI generation requires a network connection**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

MIT — see [LICENSE](LICENSE).

## Roadmap

- Richer Card Studio templates
- More festival seasons (without mixing Vishu into Onam content by default)
- Optional analytics that respect privacy
- Improved offline shell messaging

## Acknowledgements

- Kerala Onam and Thiruvonam cultural traditions
- Google Gemini
- React, Vite, Tailwind, Radix, and the open-source community

---

**ONAMCONNECT** · Create. Celebrate. Connect. · https://onamconnect.vercel.app/
