Role: You are a senior frontend architect and DevOps engineer specializing in Git workflows and commit quality automation.

Instructions: Configure Husky, lint-staged, commitlint, and cz-git for an existing Next.js App Router project that already has Biome (Phase 2) configured. Git is already initialized — do not run git init. The goal is to enforce code quality on every commit and standardize commit messages with the Conventional Commits specification.

Constraints (non-negotiable):
- Package manager: pnpm only — never npm or yarn
- Versions: always @latest — never pin version numbers
- Husky 9.x uses "pnpm exec husky init" — not "husky install"
- lint-staged must call "pnpm lint:staged" (the Biome staged script from Phase 2)
- On failure: stop immediately, report exact error, do not continue

Steps:
1. Skip git init — verify .git/ already exists before proceeding

2. Install all dependencies in one command:
   pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional @commitlint/types cz-git czg

3. Initialize Husky:
   pnpm exec husky init
   (This creates .husky/ and adds "prepare": "husky" to package.json)

4. Overwrite .husky/pre-commit (husky init creates a default — replace it):
   #!/bin/sh
   if ! pnpm lint:staged; then
     echo "❌ Pre-commit checks failed. Run 'pnpm lint' to fix automatically."
     exit 1
   fi
   echo "✅ Pre-commit checks passed!"

5. Create .husky/commit-msg:
   #!/bin/sh
   npx --no -- commitlint --edit $1

   Make both hooks executable: chmod +x .husky/pre-commit .husky/commit-msg

6. Create commitlint.config.ts at project root using TypeScript syntax
   (import RuleConfigSeverity from @commitlint/types).
   Include: extends @commitlint/config-conventional, all standard rules with 100-char line limits,
   and a full cz-git prompt.questions block with all 11 commit types (feat, fix, docs, style,
   refactor, perf, test, build, ci, chore, revert) each with description, title, and emoji.

7. Update package.json — merge these fields without removing existing scripts:
   scripts.prepare: "husky"
   scripts.commit: "czg"
   config.commitizen.path: "node_modules/cz-git"
   config.commitizen.useEmoji: true
   lint-staged: { "*.{ts,tsx,js,jsx,json}": ["pnpm lint:staged"] }

8. Validate commitlint works:
   echo "feat: add vitest setup" | ./node_modules/.bin/commitlint --config commitlint.config.ts
   Must exit 0.

End goal: Every git commit triggers Biome lint on staged files and validates the commit message against Conventional Commits. `pnpm commit` launches the interactive cz-git prompt with emoji support.

Narrowing:
- Do not run a test commit interactively — only validate commitlint with echo pipe
- Do not add a prepare-commit-msg hook unless explicitly requested
- lint-staged must use "pnpm lint:staged", not "biome check" directly — keeps it consistent with package.json scripts
- The lint-staged "empty list" exit code 1 when no files are staged is expected behavior — do not treat it as an error

Output format:
- Versions installed (husky, lint-staged, @commitlint/cli, cz-git)
- Hook permissions (ls -la .husky/)
- commitlint validation result (echo pipe test)
- Final status: "✅ Ready for Phase 5: FBA Directory Structure"
```

## What This Phase Produces

| File | Action |
|------|--------|
| `.husky/pre-commit` | Created (runs lint-staged) |
| `.husky/commit-msg` | Created (runs commitlint) |
| `commitlint.config.ts` | Created (conventional commits + cz-git prompts) |
| `package.json` | Added commit script, commitizen config, lint-staged config |

## Dependencies Added

- husky
- lint-staged
- @commitlint/cli, @commitlint/config-conventional, @commitlint/types
- cz-git, czg

## Commit Types

| Type | Emoji | Description |
|------|-------|-------------|
| feat | ✨ | A new feature |
| fix | 🐛 | A bug fix |
| docs | 📚 | Documentation only |
| style | 💎 | Formatting, no logic change |
| refactor | 📦 | Neither fix nor feature |
| perf | 🚀 | Performance improvement |
| test | 🚨 | Adding/correcting tests |
| build | 🛠 | Build system or dependencies |
| ci | ⚙️ | CI configuration |
| chore | ♻️ | Other non-src/test changes |
| revert | 🗑 | Reverts a previous commit |
