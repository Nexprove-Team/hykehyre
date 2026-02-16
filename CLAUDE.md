# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development — runs all apps (web:3000, admin:3001, waitlist:3002)
pnpm dev

# Build all
pnpm build

# Lint all
pnpm lint

# Format
pnpm format

# Build/lint/typecheck a single workspace
pnpm --filter web dev
pnpm --filter @hackhyre/ui lint
pnpm --filter admin typecheck

# Database (packages/database)
pnpm --filter @hackhyre/db db:push       # push schema to Neon (dev)
pnpm --filter @hackhyre/db db:generate   # generate migration SQL
pnpm --filter @hackhyre/db db:migrate    # apply migrations
pnpm --filter @hackhyre/db db:studio     # open Drizzle Studio

# Scraper (scripts/)
pnpm --filter @hackhyre/scripts scrape -- --platform linkedin --query "founder" --dry-run
pnpm --filter @hackhyre/scripts db:push  # separate scraper database
```

## Architecture

Turborepo monorepo with pnpm@10.4.1 workspaces. Node >= 20.

### Apps (all Next.js 16.1.6 with Turbopack dev)

| App             | Port | Notes                                          |
| --------------- | ---- | ---------------------------------------------- |
| `apps/web`      | 3000 | Main app                                       |
| `apps/admin`    | 3001 | Admin portal                                   |
| `apps/waitlist` | 3002 | Uses MongoDB (Mongoose), separate from main DB |

### Packages

| Package                      | Import as                     | Purpose                                              |
| ---------------------------- | ----------------------------- | ---------------------------------------------------- |
| `packages/ui`                | `@hackhyre/ui`                | Shared shadcn/ui components, Tailwind globals, hooks |
| `packages/database`          | `@hackhyre/db`                | Neon PostgreSQL + Drizzle ORM + Better Auth          |
| `packages/eslint-config`     | `@hackhyre/eslint-config`     | ESLint configs (base, next-js, react-internal)       |
| `packages/typescript-config` | `@hackhyre/typescript-config` | Shared tsconfigs (base, nextjs, react-library)       |
| `scripts/`                   | `@hackhyre/scripts`           | Standalone scraper CLI (own PostgreSQL DB)           |

### Three Separate Databases — Do Not Mix

1. **Main app** — Neon PostgreSQL via `@hackhyre/db` (DATABASE_URL)
2. **Waitlist** — MongoDB Atlas via Mongoose (apps/waitlist only)
3. **Scraper** — Standalone PostgreSQL (SCRAPER_DATABASE_URL in scripts/)

## Database Package (`@hackhyre/db`)

Exports:

- `@hackhyre/db` — db client, env, all tables & enums
- `@hackhyre/db/schema` — tables & enums only
- `@hackhyre/db/auth` — Better Auth instance, `Session` and `User` types
- `@hackhyre/db/client` — db client only

Auth uses Better Auth with a custom `role` field on user (enum: `recruiter`, `candidate`, `admin`).

Env validation lives at `packages/database/env.ts` (not inside `src/`) using `@t3-oss/env-core` + zod. Client is at `src/client.ts` using `@neondatabase/serverless` with Drizzle neon-http adapter.

Schema files in `src/schema/`: auth, companies, jobs, applications, candidate-profiles, talent-pool, interview-availability, job-distributions.

## UI Package (`@hackhyre/ui`)

shadcn/ui "new-york" style with RSC support. Components live in `src/components/`, hooks in `src/hooks/`, utilities in `src/lib/`.

Apps import via package exports:

```typescript
import { Button } from "@hackhyre/ui/components/button";
import { cn } from "@hackhyre/ui/lib/utils";
import "@hackhyre/ui/globals.css";
```

All apps share PostCSS config re-exported from `@hackhyre/ui/postcss.config` (Tailwind CSS v4 via `@tailwindcss/postcss`).

Apps also set path aliases for the UI package in their tsconfig (`@hackhyre/ui/*` → `../../packages/ui/src/*`) and `transpilePackages: ["@hackhyre/ui"]` in next.config.

Design system uses oklch CSS variables with light/dark mode. Brand colors: Charcoal (#232426), Green (#24E673), White (#FBFBFB), Navy (#202331).

## Scripts Package

Standalone scraper with its own Drizzle schema (`scripts/src/db/schema.ts`): recruiters, job_listings, companies, scrape_runs.

CLI: `tsx src/index.ts --platform <linkedin|twitter|company-page> --query <search> [--dry-run]`

`scripts/tsconfig.json` has `rootDir: src` — do NOT include `drizzle.config.ts` in the tsconfig (causes rootDir conflict).

## Environment Variables

Root `.env` (used by apps via turbo globalEnv):

- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` — min 32 chars
- `BETTER_AUTH_URL` — e.g. `http://localhost:3000`

Scripts `.env` (separate, in `scripts/`):

- `SCRAPER_DATABASE_URL` — separate PostgreSQL
- `NUBELA_API_KEY`, `TWITTER_BEARER_TOKEN` — optional API keys

## CI/CD

- `.github/workflows/prod.yml` — deploys waitlist app to Vercel on push to main (filtered to `apps/waitlist/**`)
