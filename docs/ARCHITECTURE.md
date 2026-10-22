# Architecture and migration

Status: development draft. No public deployment or merge authorized.

## Decision

Replace the root catalog entry point with a React + TypeScript application built by Vite. Keep the existing WFM curriculum, glossary and Python material at their original URLs through `public/`, plus a preserved catalog at `/legacy/index.html`. Original root historical files remain in Git. Baseline commit: `cc084f8`.

| Layer             | Responsibility                                                                      | Files                                                   |
| ----------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Application shell | Hash routing, navigation, preferences, page composition                             | `src/App.tsx`                                           |
| Curriculum        | Typed course/lesson definitions, source IDs, prerequisite graph                     | `src/content/`                                          |
| Reader            | Worked examples, retrieval practice, assessment and assignment gates                | `src/components/LessonReader.tsx`, `Assessment.tsx`     |
| Practice          | Formula models, SQL, code validation, accessible sequencing, diagrams, guided steps | `src/components/Practice.tsx` and supporting components |
| State             | Schema v2, bounded validated import, local dates, course completion                 | `src/progress.ts`                                       |
| SQL               | Read-only synthetic SQLite database in a terminable worker                          | `src/sql.worker.ts`                                     |
| Offline           | Content-hashed, same-origin application cache                                       | `scripts/build-sw.mjs`                                  |
| Verification      | Curriculum invariants, state validation, full learner browser journeys              | `tests/`                                                |

Hash routes avoid a server rewrite requirement and work below a GitHub Pages project path. Vite uses a relative base. No API, paid runtime, key, account or server database is required. Tailwind is available through Vite; the original design uses explicit CSS tokens and responsive component classes.

## State and completion

One versioned local-storage record stores known lesson IDs, passed checkpoints, completed lessons, bookmarks, capstone self-review IDs, local activity dates, reading size and theme. Use small bounded collections rather than introducing IndexedDB for a record measured in kilobytes. Cross-tab storage events update the in-memory view. Invalid records are preserved; valid import can replace them, or users can export raw saved data before resetting. Storage failures display an export instruction.

A lesson requires a correctly answered checkpoint and self-attested applied work. A course pilot requires all its lessons plus all capstone rubric confirmations. These are local learning records: users can edit their own exports, so they cannot serve as trusted grades or certification. Project notes are temporary until downloaded and are explicitly labeled as such.

Legacy storage keys are left unchanged. Catalog exploration, old module checkboxes and old Python/WFM checkpoints are not silently converted into new lesson mastery. Legacy readers retain access to their own saved history.

## Safe practice boundaries

SQL uses bundled sql.js/WebAssembly with an in-memory three-row dataset. A worker is created per run and terminated on success, error, timeout or unmount. Queries have a length limit, read-only entry restriction and a five-second budget. No server SQL execution exists. The SQL runtime has no external connection interface. Code editing is a constrained solution validator, clearly labeled; it does not execute arbitrary Python or JavaScript. Missing runtime support has a worked fallback.

The application uses escaped React text, no untrusted HTML injection, a same-origin CSP and no embedded secrets. CSP permits WebAssembly compilation and inline styles used by numeric visualizations. Legacy HTML has its own older security/interaction patterns and is not represented as passing the new app's accessibility sweep.

## Offline and updates

The production build precaches the shell, bundled lesson content, worker, SQLite WASM, icons and practice datasets. Legacy pages are cached on first online visit. Cache names hash actual build bytes. New workers wait for old clients to close; activation removes older `olh-` caches. Progress remains separate from caches and stable IDs survive content updates. Cache-first immutable build assets support repeatable offline loading. Browser eviction is outside application control.

## Migration and rollback

1. Review the draft branch and its content/feature matrices.
2. Keep existing root content and legacy storage intact.
3. After separate approval, configure static hosting to build `npm ci && npm run build` and serve `dist/`.
4. Existing branch-based Pages serving repository root cannot interpret TSX; it must switch to an artifact build before publishing this branch.
5. For rollback, redeploy the previous approved artifact. To restore the historical source entry point, revert migration commits on a review branch. Do not reset or force-push main.
6. If any future content IDs or state fields change, provide a versioned migration and preserve unknown exports rather than silently discarding them.

## Known architecture limits

The curriculum is bundled and searched client-side. At textbook scale, split courses into lazy-loaded content chunks and build an offline-aware search index. Current small content has fast local search and an approximately 106 KB gzipped application bundle plus approximately 323 KB gzipped WASM. A three-lesson pilot per course is intentionally not called comprehensive beginner-to-advanced training. Accounts, secure credentials, cross-device sync, external grading and collaboration would need a separately reviewed backend decision.
