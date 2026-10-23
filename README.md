# Open Learning Hub 2.0 — development draft

A mobile-first, local-first learning platform implemented with React, TypeScript and Vite. No account, API key or application server is needed.

**Current scope:** 36 course pilots across six tracks, containing 108 original topic lessons. Every pilot has worked examples, checkpoint feedback, practical assignments and a capstone brief with self-review criteria. These are usable pilots, **not 36 comprehensive beginner-to-advanced courses**. Full educational acceptance remains open for every course; see the completion matrix.

## Python Academy implementation checkpoint

The featured `#/python` studio adds six detailed chapters with real Pyodide/CPython execution, pandas/NumPy, syntax-highlighted editable labs, behavior checks, local notes and notebook export/import. It is **not yet the complete Python course**. See [the implementation checkpoint](docs/python/IMPLEMENTATION-CHECKPOINT.md) and [machine-readable coverage](docs/python/coverage.json) for exact gaps, runtime limits, verification and continuation steps. All 36 pilots and legacy URLs remain available. The Python catalog now leads to the executable beginner chapter; archived readers are explicitly labelled. See [public-site versus PR verification](docs/python/ANDROID-VERIFICATION.md).

## Run and verify

Requires Node.js 22.13+ and npm.

```bash
npm ci
npm run dev
npm run check
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=moderate
```

`npm run build` produces `dist/`, including a production-only service worker. `npm run preview -- --port 4173` serves the built output locally. Use HTTP for development; double-clicking the source HTML will not run TSX. No public deployment is performed by these commands or by the CI workflow.

## Implemented learning workflows

- Home, catalog, track paths, course overviews, lesson reader, practice studio, projects, progress, bookmarks, search and settings.
- Correct-answer checkpoints plus self-attested practical work gate lesson completion. Capstone self-review follows all course lessons.
- Local progress, resume, bookmarks, learning streaks, reading size and themes. Validated JSON export/import; malformed stored data is preserved.
- Browser SQLite, formula and visualization lab, constrained Python solution validation, flashcards, guided steps, architecture exploration and accessible ordering exercises.
- Original synthetic practice data, downloadable project notes and transparent rubrics.
- Production offline cache includes lesson content and browser SQL assets; original HTML readers cache after their first online visit.

## Preserved content

Historical root WFM, Python and glossary files remain tracked. Their original public URLs are served from `public/`. Original catalog: `public/legacy/index.html`. The build repairs over-escaped Python sample display strings in served copies and corrects its lesson-count banner; it does not rewrite historical root content or migrate exploration into mastery.

## Review documents

- [Architecture and migration](docs/ARCHITECTURE.md)
- [Repository audit](docs/REPOSITORY-AUDIT.md)
- [Curriculum inventory](docs/CURRICULUM-INVENTORY.md)
- [Course completion matrix](docs/COURSE-COMPLETION-MATRIX.md)
- [Feature verification matrix](docs/FEATURE-VERIFICATION-MATRIX.md)
- [Verification evidence](docs/VERIFICATION.md)
- [Reference investigation](docs/REFERENCE-INVESTIGATION.md)
- [Sources and licensing](docs/SOURCES-AND-LICENSING.md)
- [Remaining work and release gates](docs/REMAINING-WORK.md)
- [Responsive screenshots](docs/screenshots)

## Hosting after separate approval

Use any managed static host with build command `npm ci && npm run build` and output directory `dist`. Vite's relative base and hash routing support a project subpath. Existing GitHub Pages branch-root hosting must switch to serving a built artifact before adopting this migration. The included Actions workflow checks code and uploads test evidence; it contains no deployment job. Do not merge or deploy until the open gates have been reviewed.

## Product limits

Learning records are editable local state, not secure grades. No cross-device sync or trusted credentials are claimed. The general practice page retains a constrained Python syntax validator; the dedicated Python Academy runs real Pyodide/CPython and behavior-graded exercises. Browser-emulated Android testing does not establish physical-device PWA installation. Extended course authoring, richer assessment banks, subject-specific advanced labs, editorial validation and real-device checks remain required.
