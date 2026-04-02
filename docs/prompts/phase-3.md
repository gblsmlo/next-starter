Role: You are a senior frontend architect specializing in React testing infrastructure and Vitest.

Instructions: Configure Vitest as the testing framework for an existing Next.js App Router project that already has Biome (Phase 2) and FBA path aliases (Phase 1) in place. The setup must integrate with @testing-library/react and use happy-dom as the browser environment.

Constraints (non-negotiable):
- Package manager: pnpm only — never npm or yarn
- Versions: always @latest — never pin version numbers
- Path aliases in vitest.config.ts MUST exactly match tsconfig.json paths — read tsconfig.json first
- On failure: stop immediately, report exact error, do not continue

Steps:
1. Read tsconfig.json paths before writing any config — aliases must be identical (e.g. if tsconfig has "@lib/*" use "@lib", never "@libs")

2. Install test dependencies:
   pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/dom @testing-library/jest-dom happy-dom jsdom @playwright/test

3. Create vitest.config.ts at project root:
   - plugins: [@vitejs/plugin-react()]
   - test.environment: 'happy-dom'
   - test.globals: true
   - test.setupFiles: ['./vitest.setup.ts']
   - resolve.alias: mirror every path from tsconfig.json (strip the "/*" suffix for vitest)

4. Create vitest.setup.ts with a single line:
   import '@testing-library/jest-dom'

5. Add scripts to package.json (replace existing test scripts):
   "test": "vitest run --bail 1"
   "test:all": "pnpm run test && pnpm run test:e2e"
   "test:watch": "vitest --bail 1"
   "test:unit": "vitest run --exclude 'src/**/*.{test,e2e}.{ts,tsx}' --fileParallelism"
   "test:unit:watch": "vitest --exclude 'src/**/*.{test,e2e}.{ts,tsx}' --fileParallelism"
   "test:int": "vitest run --exclude 'src/**/*.{spec,e2e}.{ts,tsx}' --no-file-parallelism"
   "test:int:watch": "vitest --exclude 'src/**/*.{spec,e2e}.{ts,tsx}' --no-file-parallelism"
   "test:cov": "vitest run --coverage --no-file-parallelism"
   "test:e2e": "playwright test"
   "test:e2e:headed": "playwright test --headed"
   "test:e2e:debug": "playwright test --debug"
   "test:e2e:ui": "playwright test --ui"
   "test:e2e:report": "playwright show-report"

6. Create src/example.test.ts to validate the full setup:
   - One test using basic vitest assertions (expect(true).toBe(true))
   - One test using jest-dom matchers (toHaveClass) to confirm setupTests.ts is loaded

7. Run pnpm test:all — must pass before marking done

End goal: `pnpm test:all` exits with 0 errors and at least 2 tests passing. All FBA path aliases resolve without "Cannot find module" errors.

Narrowing:
- Do not install @vitest/ui unless the user explicitly needs it — the "test:ui" script is sufficient to add to package.json
- Do not modify any src/app/ files — only add testing infrastructure
- Do not use jest.config.* — Vitest replaces Jest entirely
- Remove src/example.test.ts only if the user asks — it serves as a permanent smoke test

Output format:
- Vitest version installed
- Confirmation that aliases in vitest.config.ts match tsconfig.json (list them)
- pnpm test:all output (file count + test count + duration)
- Final status: "✅ Ready for Phase 4: Git Hooks Setup"
```

## What This Phase Produces

| File | Action |
|------|--------|
| `vitest.config.ts` | Created with FBA aliases |
| `vitest.setup.ts` | Created (jest-dom import) |
| `src/example.test.ts` | Created (smoke test) |
| `package.json` | Added comprehensive test scripts |

## Dependencies Added

- vitest
- @vitejs/plugin-react
- @testing-library/react, @testing-library/dom, @testing-library/jest-dom
- happy-dom, jsdom
- @playwright/test

## Test Naming Convention

| Suffix | Type | Parallelism |
|--------|------|-------------|
| `.spec.ts(x)` | Unit test | Parallel (`--fileParallelism`) |
| `.test.ts(x)` | Integration test | Sequential (`--no-file-parallelism`) |
| `.e2e.ts(x)` | End-to-end (Playwright) | Sequential |
