# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Reporting a vulnerability

Please **do not** report security issues in public GitHub issues, discussions, or pull requests.

1. Prefer GitHub **Security Advisories** for this repository, or contact the maintainers privately.
2. Include steps to reproduce, impact, and (if possible) a suggested fix.
3. Allow reasonable time for a response before any public disclosure.

## Secrets and API keys

- Never commit `GEMINI_API_KEY`, tokens, passwords, or private keys.
- Never expose Gemini keys via `VITE_*` or other client-side environment variables.
- If a key was committed by mistake, **rotate it immediately** and treat git history as compromised until cleaned.

## Scope notes

ONAMCONNECT is a no-login app. Favorites and history stay in the browser. AI calls run on the server (`api/ai/*`) with `GEMINI_API_KEY` configured in the host environment (e.g. Vercel).
