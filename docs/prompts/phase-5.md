Role: You are a senior frontend architect specializing in Feature-Based Architecture (FBA) for Next.js projects.

Instructions: Create the FBA directory structure, barrel files, and architecture rules for an existing Next.js App Router project that already has TypeScript path aliases (Phase 1), Biome (Phase 2), Vitest (Phase 3), and Husky (Phase 4) configured.

Constraints (non-negotiable):
- Naming: strict kebab-case for ALL files and directories — never PascalCase filenames
- Barrel files (index.ts) must contain ONLY export statements — no logic, no side effects
- Path aliases in tsconfig.json are the source of truth — read tsconfig.json before creating any structure to confirm exact alias names (e.g. "@lib" vs "@libs")
- Shell brace expansion varies by shell — use explicit mkdir commands per directory to avoid literal "{api,components}" directory names
- On failure: stop immediately, report exact error, do not continue

Steps:
1. Read tsconfig.json paths to confirm exact alias names before creating anything

2. Create directory structure with explicit mkdir (no brace expansion):
   src/features/auth/      (api, components, hooks, stores, types, utils)
   src/features/account/   (api, components, hooks, types, utils)
   src/components/ui/
   src/components/layout/
   src/hooks/
   src/lib/                (matches "@lib/*" alias — NOT "libs")
   src/types/
   src/assets/

3. Create barrel index.ts for each top-level FBA directory:
   src/features/auth/index.ts
   src/features/account/index.ts
   src/components/ui/index.ts
   src/components/layout/index.ts
   src/hooks/index.ts
   src/lib/index.ts
   src/types/index.ts
   Barrel files for implementations that don't exist yet: use commented-out exports as placeholders
   (active exports pointing to non-existent files will cause lint/build errors)

4. Verify structure with: find src -type d | sort
   Verify barrels with: find src -name "index.ts" | sort

5. Run pnpm lint — must pass with 0 errors before marking done
   Apply pnpm lint:unsafe if any auto-fixable infos are reported (e.g. node: protocol)

End goal: A clean src/ tree following FBA conventions, all barrel files in place, pnpm lint exits with 0 errors.

Architecture rules to enforce going forward (document as code comments in barrel files):
- Internal imports within a feature → relative paths only (../hooks/use-auth)
- Cross-feature imports → barrel alias only (@features/auth)
- Never deep-import across features (@features/auth/hooks/use-auth is forbidden)
- export type { ... } for all type-only exports (assists tree-shaking)

Sense check: Verify that (a) no directory has a PascalCase name, (b) no barrel file contains non-export statements, and (c) the alias in tsconfig.json for utilities matches the actual directory name created.

Output format:
- Directory tree (find src -type d | sort output)
- List of barrel files created
- pnpm lint result (file count + error count)
- Final status: "✅ FBA Structure Complete — All Phases Finished"
```

## What This Phase Produces

| File | Action |
|------|--------|
| `src/features/auth/index.ts` | Created (barrel) |
| `src/features/account/index.ts` | Created (barrel) |
| `src/components/ui/index.ts` | Created (barrel) |
| `src/components/layout/index.ts` | Created (barrel) |
| `src/hooks/index.ts` | Created (barrel) |
| `src/lib/index.ts` | Created (barrel) |
| `src/types/index.ts` | Created (barrel) |

## FBA Import Rules

### Rule 1: Internal → Relative

```typescript
// src/features/auth/components/login-form.tsx
import { useAuth } from '../hooks/use-auth'       // ✅ relative
import { useAuth } from '@features/auth'           // ❌ never barrel internally
```

### Rule 2: Cross-feature → Barrel Alias

```typescript
// src/features/account/components/settings.tsx
import { useAuth } from '@features/auth'            // ✅ barrel alias
import { Button } from '@components/ui'              // ✅ barrel alias
import { useAuth } from '@features/auth/hooks/use-auth' // ❌ deep import
```

### Rule 3: Type-Only Exports

```typescript
export type { AuthState } from './types/auth-types'  // ✅ assists tree-shaking
export { AuthState } from './types/auth-types'        // ❌ runtime export for types
```
