Role: You are a senior frontend architect and DevOps engineer specializing in modern JavaScript tooling.

Instructions: Configure Biome as the exclusive linting, formatting, and import organization tool for an existing Next.js App Router project. ESLint and Prettier must be completely removed — no coexistence.

Constraints (non-negotiable):
- Package manager: pnpm only — never npm or yarn
- Versions: always @latest — never pin version numbers
- Exclusivity: Biome is the only linting/formatting tool after this phase
- FBA compliance: config must enforce Feature-Based Architecture patterns
- On failure: stop immediately, report exact error, do not continue

Steps:
1. Remove competing tools — uninstall only the packages that actually exist:
   pnpm remove eslint eslint-config-next (add others only if present in package.json)
   Delete: eslint.config.*, .eslintrc.*, .prettierrc.*, .editorconfig, .eslintignore, .prettierignore

2. Install Biome:
   pnpm add -D @biomejs/biome

3. Run `./node_modules/.bin/biome init` to generate the base config, then check the installed
   version — adapt the $schema URL to match (e.g. 2.x vs 1.x have different schema shapes).

4. Overwrite biome.json with FBA-tuned config:
   - formatter: indentStyle tab, indentWidth 2, lineWidth 100, lineEnding lf, single quotes,
     no semicolons, trailing commas all
   - linter rules: noUnusedImports → error, noExplicitAny → warn, recommended → true
   - assist: organizeImports → on
   - files.includes: target only *.{ts,tsx,js,jsx,cjs,mjs,json}, exclude node_modules/.next/dist

5. Replace the "lint" script in package.json and add:
   "lint": "biome check --write .",
   "lint:format": "biome format --write .",
   "lint:ci": "biome ci .",
   "lint:staged": "biome check --staged --write .",
   "lint:unsafe": "biome check --unsafe --write ."

6. Create .vscode/settings.json with Biome as defaultFormatter + formatOnSave + organizeImports on save.
   Create .vscode/extensions.json recommending biomejs.biome and unwanting ESLint/Prettier extensions.

End goal: `pnpm lint` runs clean with zero errors. No ESLint or Prettier artifacts remain anywhere in the project.

Narrowing:
- Do not add CSS or nursery rules unless you have verified they exist in the installed Biome version
- Do not use "extends" or third-party Biome configs — always use explicit configuration
- Do not modify src/ files during this phase — only tooling configuration

Output format:
- Confirmation that ESLint/Prettier were fully removed (list what was actually removed)
- Confirmation that Biome is installed (show version)
- List of files created or modified
- Result of `pnpm lint` (must show 0 errors)
- Final status: "✅ Ready for Phase 3: Vitest Configuration"
```

## What This Phase Produces

| File | Action |
|------|--------|
| `biome.json` | Created with FBA rules |
| `package.json` | Scripts updated (lint, lint:format, lint:ci, lint:staged, lint:unsafe) |
| `.vscode/settings.json` | Created (Biome as formatter) |
| `.vscode/extensions.json` | Created (recommend Biome, unwant ESLint/Prettier) |
| `eslint.config.mjs` | Removed |

## Dependencies Changed

- **Removed:** eslint, eslint-config-next
- **Added:** @biomejs/biome
