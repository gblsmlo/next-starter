# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev              # Start Next.js dev server
pnpm build            # Production build
pnpm start            # Start production server

# Linting & Formatting (Biome — no ESLint/Prettier)
pnpm lint             # Check + auto-fix all files
pnpm lint:ci          # CI mode (no auto-fix, fails on issues)
pnpm lint:staged      # Check only staged files
pnpm lint:unsafe      # Apply unsafe auto-fixes (e.g. node: protocol)

# Testing (Vitest + happy-dom)
pnpm test             # Run all tests (bail on first failure)
pnpm test:unit        # Unit tests only (.spec.ts/.spec.tsx)
pnpm test:int         # Integration tests only (.test.ts/.test.tsx)
pnpm test:cov         # Run with coverage report
pnpm test:watch       # Watch mode

# E2E (Playwright)
pnpm test:e2e         # Run end-to-end tests
pnpm test:e2e:headed  # Run with browser visible
pnpm test:e2e:ui      # Open Playwright UI

# Commit (conventional commits enforced by commitlint + cz-git)
pnpm commit           # Interactive commit prompt (czg)
```

## Architecture

**Feature-Based Architecture (FBA)** — code is organized by business domain, not by technical layer.

```
src/
├── app/              # Next.js App Router (routes, layouts, pages)
├── features/         # Business domains (auth, account, etc.)
│   └── <feature>/    # Each feature is self-contained
│       ├── api/          # API calls, server actions
│       ├── components/   # Feature-specific UI
│       ├── hooks/        # Feature-specific hooks
│       ├── stores/       # State management
│       ├── types/        # TypeScript types
│       ├── utils/        # Helpers
│       └── index.ts      # Barrel — public API for this feature
├── components/       # Shared UI (ui/, layout/)
├── hooks/            # Shared hooks
├── lib/              # Shared utilities
├── types/            # Shared TypeScript types
├── config/           # App configuration (env validation)
└── assets/           # Static assets
```

### Import Rules (critical)

1. **Internal to a feature** → always use relative paths (`../hooks/use-auth`)
2. **Cross-feature or shared** → always import from barrel via alias (`@features/auth`, `@components/ui`)
3. **Never deep-import across features** — `@features/auth/hooks/use-auth` is forbidden
4. **Barrel files contain only exports** — no logic, no side effects

### Path Aliases

| Alias | Path |
|-------|------|
| `@features/*` | `src/features/*` |
| `@components/*` | `src/components/*` |
| `@routes/*` | `src/routes/*` |
| `@types/*` | `src/types/*` |
| `@lib/*` | `src/lib/*` |
| `@hooks/*` | `src/hooks/*` |

Aliases are configured in **three places** that must stay in sync: `tsconfig.json`, `vitest.config.ts`, and Next.js (via tsconfig paths).

### Test File Conventions

| Suffix | Type | Parallelism |
|--------|------|-------------|
| `.spec.ts(x)` | Unit test | Parallel |
| `.test.ts(x)` | Integration test | Sequential |
| `.e2e.ts(x)` | End-to-end (Playwright) | Sequential |

Tests load `.env.test` via `node --env-file=.env.test`. E2E tests load `.env.e2e`.

### Environment Variables

Validated at runtime via `src/config/env.ts` using `@t3-oss/env-nextjs` + Zod. Server and client vars are typed and fail-fast on missing values. See `.env.example` for required keys.

### Naming Conventions

- **Files & directories:** strict kebab-case (`use-auth.ts`, `login-form.tsx`)
- **Components:** PascalCase function names, kebab-case file names
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)

## Tooling

- **Package manager:** pnpm (never npm/yarn)
- **Linter/Formatter:** Biome 2.x (tabs, single quotes, no semicolons, trailing commas)
- **Testing:** Vitest 4.x + @testing-library/react + happy-dom
- **E2E:** Playwright
- **Git hooks:** Husky (pre-commit → lint-staged, commit-msg → commitlint)
- **Framework:** Next.js 16 with App Router, React 19, React Compiler
- **CSS:** Tailwind CSS v4 (via @tailwindcss/postcss)
