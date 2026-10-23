# Python Academy 1.0 — implementation checkpoint

Specification: GitHub Issue #2 plus its single mandatory-clarification comment, read in full from GitHub's issue page on 2026-10-23. Timeline payload reported one comment and `hasNextPage: false`. Continue draft PR #1, branch `codex/open-learning-hub-2`. No merge or deployment is authorized.

## Baseline audit and gap matrix

Baseline inspected: `4945d52818d5768b933306290405c689f2d18268`.

| Area | Baseline | This checkpoint | Remaining acceptance |
| --- | --- | --- | --- |
| Routes/catalog | 36 pilots, 108 lessons; legacy static readers | Preserved; dedicated `#/python` studio and featured home entry | Integrate flagship mastery with the main progress/search dashboard |
| Lesson depth | Single-paragraph pilot explanations | Six original 500+ word chapters, explicit syntax, 12 runnable examples with walkthroughs | Full textbook-depth coverage of remaining topics; independent editorial review |
| Python execution | Text-pattern validation in generic Practice | Local Pyodide 0.27.7 / CPython 3.12.7, disposable workers, real stdout/stderr | The older generic practice widget remains a clearly labeled constrained validator; desktop-only environment chapters still needed |
| Dependencies | No executable browser Python | Locally served stdlib, pandas 2.2.3, NumPy 2.0.2, dateutil, pytz, six | Broader dependency policy and optional desktop scientific/HTTP labs |
| Grading | Two-choice pilot checkpoint, self-attested assignment | 12 behavior-checked tasks; completion requires both tasks and chapter recall | More assessment banks, cumulative projects, assessed reporting capstone |
| Notes/storage | General progress JSON, no notes | Separate versioned Python notebook, immediate draft/note save, export/import, corruption preservation | Integrate notebook migration into a unified application backup; more cross-tab conflict resolution |
| UX | Responsive common shell and reader | Desktop syllabus/reader/lab panes; Android Read/Code/Notes workspace; CodeMirror, line numbers, light/dark highlighting | Independent usability evaluation; physical Android installation unverified |
| Offline | Production service worker for application/SQL | Same cache also includes Python worker/runtime/wheels and lazy studio chunk | Cache upgrades must still be exercised across two separately deployed build versions |
| Provenance | Generic source links | Specific official Python/pandas references plus retrieved upstream documentation source | Full-topic source inventory and independent content review |
| CI | Unit tests, build, browser checks | Adds scoped ESLint, notebook/content contracts, actual runtime example/solution verification and coverage inventory | Confirm checks on final remote commit; full-course release gate intentionally fails |

## Implemented reader and runtime

Published chapter routes: `#/python/variables`, `loops`, `functions`, `exceptions`, `objects`, `pandas`.

Every chapter contains objectives, prerequisites, original conceptual prose, syntax breakdown, two runnable worked examples with exact expected stdout and line walkthroughs, debugging notes, two editable behavior-graded tasks, progressive hints, a recall check, local notes and official references. These six chapters are an implementation milestone, not a complete course or an independently reviewed textbook.

The CodeMirror Python editor supports selection, mobile text editing, syntax highlighting, line numbers, indentation, copy, reset and autosave. Escape then Tab leaves the editor. Python tracebacks show `learner.py` line locations in stderr. Editing an assessed solution revokes its saved pass and chapter completion. Running an example alone cannot pass an assessment. Read access is not locked behind completion.

Each execution starts a new dedicated worker and discards it afterward. Python cannot access the parent document or parent localStorage. This is isolation for learner responsiveness, not a secure multi-tenant grading sandbox: browser JavaScript capabilities and same-origin network semantics remain available, checks are inspectable, and local records are editable. Never enter secrets. There is no promise of a browser-wide memory quota. The host terminates initialization after 60 seconds, execution after 8 seconds, and captures at most 32 KiB of ordinary stdout/stderr. Stop kills the worker. Temporary Python files do not persist. Blocking stdin, arbitrary pip installation, native subprocesses and desktop integrations are unsupported.

`prepare-python.mjs` copies runtime assets from the pinned npm package and fetches pandas dependencies from the official Pyodide distribution mirror on jsDelivr. Wheel SHA-256 hashes are checked against the npm-integrity-verified Pyodide lock before files are accepted. Runtime assets are ignored build inputs, not manually committed binary blobs. `predev` and `prebuild` reproduce them; valid cached files are reused. Production service-worker installation caches approximately 23 MB. Cache installation can fail under quota restrictions; the application must report that condition and online use remains available. Development mode intentionally does not install an offline worker.

Python notebook data uses `olh.python.v1`, separate from existing `olh.progress.v2`. Notes, code drafts, exercise passes, recall results, completion and resume are exported together. Invalid or unreadable data is preserved until explicit import/reset. Storage failures retain edits in memory and display export guidance. Cross-tab changes block further writes to avoid silently clobbering work. This is guest learning on one device; no account sync, certificate or trusted grade is claimed.

## Reference retrieval

Direct documentation host requests were denied by environment egress policy. The same official documentation was retrieved successfully from its authoritative upstream source on 2026-10-23:

- CPython 3.12 tutorial introduction, control flow, errors, classes, and library dataclasses: `https://raw.githubusercontent.com/python/cpython/3.12/Doc/` followed by `tutorial/introduction.rst`, `tutorial/controlflow.rst`, `tutorial/errors.rst`, `tutorial/classes.rst`, `library/dataclasses.rst`. License: PSF.
- pandas 2.2.3 summary-statistics tutorial: `https://raw.githubusercontent.com/pandas-dev/pandas/v2.2.3/doc/source/getting_started/intro_tutorials/06_calculate_statistics.rst`. License: BSD-3-Clause.
- Pyodide worker guidance: `https://raw.githubusercontent.com/pyodide/pyodide/0.27.7/docs/usage/webworker.md`. Pyodide license: MPL-2.0 (individual bundled packages retain their own licenses).

Teaching prose, data, exercises and examples in this milestone are original. Reference retrieval does not imply third-party endorsement or independent educational acceptance. Existing third-party notices are retained; CodeMirror is MIT licensed, React MIT, Python PSF, NumPy/pandas BSD-3-Clause. Pinned package metadata retains their full notices.

## Reproduction and continuation

Use Node >=22.13. From the existing checkout:

```bash
npm ci
npm run dev -- --port 5173 --strictPort
npm run check
npm audit --audit-level=moderate
npm run test:e2e
```

The normal Playwright runner expects its pinned Chromium installed (`npx playwright install --with-deps chromium`). In this cloud machine downloads are denied; `/workspace/olh-playwright.config.mjs` selects installed `/usr/bin/chromium` with the original test settings and correct working directory. Use `npm run test:e2e -- --config /workspace/olh-playwright.config.mjs` here. That helper is outside the repository and is saved in environment setup instructions; CI continues using pinned Playwright Chromium.

`npm run verify:python` executes every authored example and all reference exercise solutions in actual Pyodide, rejects each incomplete starter, and writes `execution-evidence.json`. `npm run coverage:python` emits the machine-readable `coverage.json` and public `python-coverage.json`. `node --experimental-strip-types scripts/python-coverage.mjs --release` intentionally exits nonzero: eighteen required topic groups have no dedicated chapter, broader acceptance of implemented topics is pending, and independent review has not happened. Word counts are a basic contract check, not proof of educational depth.

Continue from this committed checkpoint. First expand the fundamentals in sequence (collections, modules, files/CSV/JSON/pathlib, packaging, typing and testing), then iterators/generators/decorators/context managers, concurrency/performance/security, NumPy/visualization/HTTP/automation, and the downloadable reporting pipeline with assessed tests. Existing six foundation chapters will also need more breadth and editorial review. Do not call these remaining topics complete because they are mentioned in a paragraph or inventory.

Screenshots can be reproduced after starting production preview on port 4173 with `CHROMIUM_PATH=/usr/bin/chromium node --experimental-strip-types scripts/python-screenshots.mjs` in this cloud machine. The normal pinned Playwright installation can omit `CHROMIUM_PATH`. Node >=22.13 is now required for the supported ESLint 10 toolchain; the `--experimental-strip-types` flag keeps content verification compatible with early supported Node 22 versions.
