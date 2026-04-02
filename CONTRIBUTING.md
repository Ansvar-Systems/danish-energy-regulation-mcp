# Contributing

Thanks for contributing to the Danish Energy Regulation MCP.

## Prerequisites

- Node.js 20+
- npm

## Development Setup

```bash
npm install
npm run build
npm run seed         # populate sample data
npm run dev          # HTTP server on port 3000
```

## Branching

- Fork the repository
- Create a feature branch from `dev`
- Submit a PR to `dev`
- After verification on dev, PR to `main`

Do not push directly to `main`.

## Common Commands

- `npm run dev` -- run HTTP server from TypeScript source
- `npm run build` -- compile TypeScript to `dist/`
- `npm run seed` -- populate the database with sample data
- `npm run typecheck` -- type-check without emitting

## Adding Data

Data additions and corrections go in `scripts/seed-sample.ts` (for seed data) or as new ingestion scripts in `scripts/`.

When adding regulations, grid codes, or decisions:

- Use Danish-language content
- Include the official reference string (e.g., `BEK nr 1310 af 24/11/2023`)
- Include the regulator URL when available
- Assign the correct type and status

## Pull Request Guidelines

- Keep changes focused and scoped
- Update docs when adding or changing tools, data sources, or configuration
- Run `npm run build` and `npm run typecheck` before submitting

## Commit Style

Use clear commit messages, ideally Conventional Commits:

- `feat: add Energiklagenaevnet decisions`
- `fix: handle missing grid code reference`
- `docs: update coverage statistics`

## Legal Notes

- Source data originates from public Danish government publications (retsinformation.dk, ens.dk, energinet.dk, forsyningstilsynet.dk, sik.dk)
- Do not commit credentials or private data
- This project is a regulatory reference tool, not legal advice
