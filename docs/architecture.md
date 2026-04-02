# Project Architecture & Technical Reference

> [!NOTE]
> This documentation serves as the definitive technical reference for the app system, capturing both architectural decisions and implementation specifics. It is intended for onboarding new team members and supporting architectural reviews.

## 1. Executive Summary

Next started is a modern web application built using the **Next.js App Router** framework. It leverages **Feature-Based Architecture (FBA)** to strictly decouple business logic, state, and UI. To guarantee high performance, strict type safety, and development speed, the stack utilizes **Biome** for lightning-fast code analysis and formatting, **Tailwind CSS v4** for styling, and a combination of **Vitest** and **Playwright** for a confident testing strategy.

## 2. Architecture Overview

### Next.js App Router
The core framework is Next.js 16+, utilizing the `src/app` directory layout. This allows us to take advantage of React Server Components (RSCs), edge runtime optimizations, and built-in nested layouts, giving an optimal balance between client-side interactivity and server-side performance.

### Feature-Based Architecture (FBA)
Instead of grouping files by technical type (e.g., all `components/` together, all `hooks/` together), code is grouped by business feature inside `src/features/`.
This limits blast radius when modifying features and encapsulates domain knowledge correctly. Features are strictly isolated and should only export a public API via a barrel `index.ts` file.

**Core Principles:**
- **Encapsulation:** Features contain their own components, hooks, utils, types, and stores.
- **Cross-feature Communication:** Never deep import across features (e.g., `import X from '@features/auth/hooks'`). Inter-feature usage must occur via top-level barrel exports (`import X from '@features/auth'`).

## 3. Design Decisions

### Package Manager: PNPM
`pnpm` is strictly enforced for dependency management. It avoids npm's nested duplication and creates a hard-linked `node_modules` structure, drastically saving disk space and reducing install times.

### Linter & Formatter: Biome
We use **Biome** instead of the traditional Prettier + ESLint stack. 
- **Why?** Biome unifies formatting and linting into a single tool written in Rust, significantly accelerating CI pipelines and local pre-commit hooks.
- Operations like `pnpm lint:staged` target only modified files instantly.

### Styling: Tailwind CSS v4
The application uses Tailwind CSS v4 alongside `@tailwindcss/postcss`. Tailwind 4 introduces an automated configuration-less CSS-first approach, simplifying design token generation.

### Environment Variable Validation
We rely on `@t3-oss/env-nextjs` and `zod` for strongly-typed environment variables.
- **Why?** If a required variable (like `DATABASE_URL` or `OPEN_AI_API_KEY`) is missing, the build process safely errors out rather than crashing at runtime in production.

## 4. Development Workflow & Code Quality

### Git Hooks & Commit Conventions
We use **Husky** paired with `lint-staged`.
1. **Pre-commit:** Git invokes `pnpm lint:staged`, forcing Biome to validate formatting and lint rules on the modified files just prior to commit.
2. **Commit Messages:** The commit message is parsed by `commitlint` according to the `@commitlint/config-conventional` rules. We use `cz-git` (`pnpm commit`) for an interactive, graphical commit-prompt generation to ensure everyone adheres to the conventions.

### Testing Strategy
We split our tests into predictable patterns:
- **Unit Testing:** `vitest`; uses `.spec.ts` (run with file parallelism strategy).
- **Integration Testing:** `vitest`; uses `.test.ts` (run sequentially to avoid DB lock issues).
- **End-to-End Testing:** `playwright`; uses `.e2e.ts`, providing headed, debug, and UI visualizer variations for full browser-level flow simulation.
- `happy-dom` is configured as the DOM simulator for Vitest integration tests, avoiding the overhead of heavier JSDOM processes.

## 5. Security & Deployment Concepts

Deployment and secrets follow standardized practices. Key environment boundaries exist:
- **Server-Only Variables** (`DATABASE_URL`, `OPEN_AI_API_KEY`): Exclusively readable during SSR or in API routes. Evaluated globally.
- **Public Variables** (`NEXT_PUBLIC_PUBLISHABLE_KEY`): Inlined by Next.js at build time for the client bundles.

> [!CAUTION]
> Never prepend server-only credentials with `NEXT_PUBLIC_`. This exposes sensitive backend tokens directly to the compiled client bundle.

---

### Reading Paths

**For New Developers:** Focus on understanding the `src/features/` barrel file boundaries and running `pnpm dev` to inspect the FBA implementation practically. Use `pnpm commit` to make your contributions.

**For Operations/DevOps:** Refer to the comprehensive suite of testing commands (`pnpm test:unit`, `pnpm test:int`, `pnpm test:e2e`) exposed in `package.json` to configure pipeline jobs correctly.
