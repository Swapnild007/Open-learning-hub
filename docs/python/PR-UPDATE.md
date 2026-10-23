## Open Learning Hub 2.0: local-first pilots and executable Python Academy

Refs #2. Continue this existing draft PR; no merge or deployment.

This PR replaces the static catalog with a mobile-first React/TypeScript application: 36 original course pilots, 108 concept lessons, discovery/search, lesson and capstone routes, local progress/bookmarks/settings, browser SQLite and an offline shell. Historical WFM, glossary and Python content remains available. These pilots do not constitute 36 complete beginner-to-advanced courses. The executable Python studio below is the latest integrated implementation checkpoint.

The previous Python practice used constrained text validation. This change adds a dedicated Python Academy with actual CPython 3.12.7 execution through pinned Pyodide 0.27.7. Six original foundation chapters cover variables, loops, functions, exceptions, objects/dataclasses and pandas. The existing 36 pilots, 108 lessons and legacy URLs remain available. The Python catalog now opens the executable beginner lesson; archived static readers clearly link to it.

- Desktop syllabus/reading/editor panes and Android Read/Code/Notes workspaces.
- CodeMirror Python highlighting, accessible light/dark colors, line numbers, copy/reset/run, autosaved drafts and Python tracebacks.
- Disposable workers, 8-second execution limit, stop/restart, fresh namespaces, stdout/stderr, local standard library and bundled pandas/NumPy.
- Twelve behavior-graded coding tasks with progressive hints, recall checks and explicit completion gates. Example execution alone does not complete a lesson.
- Persistent personal notes and separate versioned Python notebook backup/import with validation and corrupt-data preservation.
- Production offline runtime assets with checked wheel SHA-256 hashes; local records remain guest learning evidence, not trusted grades.

### Public-site diagnosis and learner fixes

A fresh browser check of the published GitHub Pages Python URL confirmed the old 14 October static artifact: zero Run buttons, zero editors, one self-attested practice checkbox, and escaped code. Its response hash matches the historical root source file. The executable Academy was already on PR head `d7a8013`; it was not the published page, and old catalog navigation made it easy to miss. See [comparison evidence](docs/python/ANDROID-VERIFICATION.md).

This follow-up fixes exact Unicode/partial-line stdout/stderr with byte writers and explicit flushing, warms pandas imports during initialization, adds visible error summaries and a source fingerprint, and improves the Android workspace. New browser cases execute the beginner example, edit it, show syntax/runtime errors, reject output-only wrong answers, accept alternative valid solutions, enforce completion gates, preserve notes/drafts, and verify legacy links into the studio.

### Verification

- Clean `npm ci`; scoped ESLint and TypeScript check.
- 12 unit/content/storage tests.
- 42 executable Pyodide checks: 12 exact example outputs, 12 accepted reference solutions, 12 rejected incomplete starters and 6 recall-answer proofs.
- Production build; dependency audit reports zero vulnerabilities.
- **38 browser tests passed** on desktop and emulated Pixel 7, including four new interaction/navigation cases. A separate Android-sized Vite development-server test executed worked example 1 with exact stdout and no page errors. Browser evidence and final full-suite result are recorded in [the verification checkpoint](docs/python/VERIFICATION.md), including desktop and emulated Pixel 7 learning journeys, wrong/correct code, grading, offline pandas, notes, corruption handling and accessibility.
- [Screenshots](docs/python/screenshots), [coverage matrix](docs/python/coverage.json), [implementation/gap audit](docs/python/IMPLEMENTATION-CHECKPOINT.md).

### Explicitly incomplete

This is a working implementation checkpoint, **not a complete Python course**. Eighteen required topic groups still lack dedicated chapters, including collections, modules, files/CSV/JSON/pathlib, packaging, testing/typing, iterators/generators/decorators/context managers, concurrency/performance/security, NumPy, visualization, HTTP/automation and the assessed reporting capstone. Foundation topics also need broader coverage and independent editorial review. Integration of Python mastery with global search/progress remains pending. Physical Android installation, a full two-build PWA cache upgrade and independent course acceptance remain unverified. The full-course release gate intentionally fails.

See the committed continuation plan; do not close #2 or remove draft status on the strength of this milestone.
