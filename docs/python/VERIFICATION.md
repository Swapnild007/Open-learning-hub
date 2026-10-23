# Python Academy checkpoint verification

Verified locally on 2026-10-23 with Node 24.19.0, npm 11.9.0, Pyodide 0.27.7 / CPython 3.12.7, pandas 2.2.3 and NumPy 2.0.2. All changes continue `codex/open-learning-hub-2` / PR #1. Main was not changed.

| Check | Actual result |
| --- | --- |
| Clean dependency installation | `npm ci --cache /tmp/olh-npm-cache` passed; 229 packages installed |
| Scoped lint | `npm run lint:python` passed with ESLint 10 |
| Unit, storage and content contracts | 12 tests passed across 4 files |
| Executable content verification | 42 checks passed in actual Pyodide: 12 exact example outputs, 12 accepted exercise solutions, 12 rejected starters, 6 recall-answer proofs |
| TypeScript and production build | Passed through `npm run check` |
| Dependency audit | `npm audit --audit-level=moderate` passed; zero vulnerabilities reported |
| Complete browser regression suite | **34 passed in 3.2 minutes**, desktop and emulated Pixel 7 |
| Vite development smoke test | Studio rendered and executed Python successfully on port 5173 |
| Full-course release gate | **Intentionally failed**: 18 required topic groups have no dedicated chapter, and educational acceptance remains open |
| GitHub-hosted CI on final pushed SHA | Not confirmed locally; API access is denied by egress policy |
| Physical Android installation/usability | Unverified; browser emulation is not a physical device |
| Two separately published PWA build upgrades | Unverified; current-build offline execution/reload passed |

The successful final browser run includes all 26 pre-existing tests and 8 new Python tests. Python journeys cover variables, loops, functions, exceptions, OOP/dataclasses and pandas; wrong code, corrected solutions, all chapter completion gates, persistent notes and exports, real tracebacks, editing invalidation, timeout/stop, fresh-run globals, offline standard-library and pandas execution, invalid backup rejection, corrupt-data preservation/recovery, horizontal overflow, keyboard exit from the editor and serious/critical accessibility violations in both themes.

Browser command in this cloud machine:

```bash
npm run test:e2e -- --config /workspace/olh-playwright.config.mjs
```

The external helper selects installed `/usr/bin/chromium` and preserves the repository runner's original projects and working directory. Browser downloads were blocked by environment policy. CI continues to install Playwright's pinned Chromium; local results do not establish CI results.

Failures found and fixed before the successful final run: initialization messages polluting pandas stdout; default editor token colors failing contrast in light/dark mode; and a test race that attempted to choose the mobile code workspace before the lazy reader mounted. No assertion was disabled to obtain the final result.

Build warnings remain: sql.js browser externalization notices inherited from the baseline, and the lazy CodeMirror/academy chunk exceeding Vite's 500 KiB warning threshold (approximately 181 KiB compressed). The regular initial application chunk remains separate. Python runtime/package assets occupy approximately 23 MiB and are cached only by the production service worker.

[Execution counts](execution-evidence.json), [coverage matrix](coverage.json), [screenshots](screenshots), [gap audit and continuation plan](IMPLEMENTATION-CHECKPOINT.md).

`gh pr edit 1 --body-file docs/python/PR-UPDATE.md` was attempted using existing authentication and rejected with `Post https://api.github.com/graphql: Forbidden`. Git read/push access is separately available. The prepared description remains in the repository for application once `api.github.com` is allowed; no credential value was requested or copied. PR #1 remains a draft and Issue #2 must remain open.
