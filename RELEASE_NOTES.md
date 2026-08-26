# ONAMCONNECT v1.0.0

**Create. Celebrate. Connect.**

The first production release of ONAMCONNECT, an AI-powered platform for creating and sharing personalized Onam and Thiruvonam wishes.

## Highlights

ONAMCONNECT helps you craft culturally aware Onam and Thiruvonam greetings in Malayalam, English, and Manglish, design greeting cards, generate social captions, and share across popular apps — with no account required.

## Features

- AI-powered wishes (Malayalam, English, Manglish)
- Thiruvonam wishes section (2026)
- Greeting Card Studio with PNG export
- Social caption generator
- AI message improvement
- Business Onam wishes
- Templates, favorites, and local history
- Multi-platform sharing (WhatsApp, Telegram, X, Facebook, native share)
- Signal and Arattai fallbacks (native share / copy)
- Mobile bottom navigation (Home, Create, Cards, Saved, More)
- PWA installability
- SEO metadata, sitemap, and robots.txt
- Server-side Gemini integration (key never in the browser)

## Installation

See [README.md](README.md) for clone, install, environment setup, and deploy steps.

## Live Demo

https://onamconnect.vercel.app/

## Security

Never expose your Gemini API key in frontend code. Set `GEMINI_API_KEY` only in server/Vercel environment variables. See [SECURITY.md](SECURITY.md).

## Known Limitations

- **Signal** and **Arattai** do not provide official browser share APIs. ONAMCONNECT uses the Web Share API when available, otherwise copies the message for paste.
- **Facebook** web sharing accepts a URL, not pre-filled post text. The app copies the message and opens Facebook’s sharer with the site URL.
- **AI generation** requires network access and a configured `GEMINI_API_KEY`. The PWA does not claim offline AI.
- Local `npm run dev` serves the SPA; Vercel serverless AI routes need `vercel dev` or a Vercel deployment to exercise Gemini end-to-end.
