# Platform integrations note

ONAMCONNECT’s AI features use **Vercel serverless functions** under `api/ai/*` with a server-side `GEMINI_API_KEY`.

The `@vly-ai/integrations` package and `vly-toolbar-readonly.tsx` may be present for host/embed tooling. They are **not** required for core wish generation, Card Studio, sharing, or PWA behavior.

Do not put API keys in `VITE_*` variables. See [README.md](README.md) and [SECURITY.md](SECURITY.md).
