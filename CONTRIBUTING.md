# Contributing to ONAMCONNECT

Thank you for helping improve ONAMCONNECT. Create. Celebrate. Connect.

## Ways to contribute

- Bug reports and fixes
- Documentation improvements
- Accessibility and UX polish
- New templates or Card Studio presets
- Tests and CI improvements

## Development setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` if you need AI locally (prefer `vercel dev` for API routes)
5. Start the UI: `npm run dev`

## Branch names

Prefer:

```text
feature/...
fix/...
docs/...
refactor/...
```

Examples: `feature/card-presets`, `fix/share-url`, `docs/readme-deploy`.

## Before opening a pull request

1. Make focused changes
2. Run `npm run lint`
3. Run `npm run build`
4. Manually smoke-test the flows you touched (generator, share, cards, mobile nav)
5. Do **not** commit secrets, `.env`, `node_modules`, or build output
6. Open a pull request with a clear description and screenshots when UI changes

## Commit style

Use short, imperative messages (e.g. `Fix share URL append`, `Add Thiruvonam FAQ`).

## Code of conduct

Please follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security

Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).
