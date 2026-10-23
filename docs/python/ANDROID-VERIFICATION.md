# Python learner experience: public site versus PR #1

Checked 23 October 2026. Existing draft PR #1, branch `codex/open-learning-hub-2`; no merge or deployment.

## Diagnosis

The public URL `https://swapnild007.github.io/Open-learning-hub/python-curriculum.html` serves the historical static reader. A fresh browser context received HTTP 200, Last-Modified `Wed, 14 Oct 2026 12:35:06 GMT`. Its SHA-256 is `ea05c6bf6d5ccefb1754e37e53a3c08571784002227681875c4ef75080c6b719`, identical to the preserved root source file. This establishes a different published artifact, not merely a phone cache problem. Public browser inspection found zero Run buttons, zero editors, one self-attested practice checkbox and visibly escaped code. See `published-comparison.json` and `screenshots/published-android-static.png`.

The latest pre-task PR head, `d7a80135462906d65624b2033ffbaa447a131cac`, already contained the separate executable Academy. Its successful CI does not establish the public learner experience. The PR description was stale, and the catalog's Python overview still sent learners to concept pilots and the static archive. Those routes made it easy to miss the actual studio.

| Experience      | Public static page               | Updated PR studio                                                                 |
| --------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| Python examples | Escaped, plain preformatted text | Correct line-by-line CodeMirror highlighting                                      |
| Editing and Run | Absent                           | Editable code, real Pyodide worker, Run/Stop/Reset/Copy                           |
| Output          | Predetermined example text       | Actual stdout and stderr, including Unicode and partial lines                     |
| Errors          | No execution                     | SyntaxError and runtime tracebacks with learner.py                                |
| Practice        | Checkbox self-attestation        | Numeric/value/output behavior assertions; wrong code rejected                     |
| Notes           | No Academy notebook              | Autosaved notes and drafts; refresh/export/import tested                          |
| Android         | Historical reader                | Read/Code/Notes panes; wrapping, touch controls and no horizontal overflow tested |

## Fixes in this update

- Python catalog overview now starts the executable beginner chapter; legacy concept pilots and preserved static URLs clearly label their scope and link to the studio. Historical content and progress are retained.
- Added a visible deterministic source fingerprint (`f4ef18990ac5`) to distinguish the tested studio build from older pages. This fingerprints source assets, not a deployment or Git commit.
- Added a visible concise error summary above the complete traceback, so beginner error messages remain readable on a phone.
- Replaced batched stream callbacks with streaming UTF-8 byte writers. Explicit Python stdout/stderr flushes preserve `print(..., end="")` and output preceding exceptions. The new exact-stream test reproduced the missing partial-output bug before the flush fix.
- Beginner worked examples open in the editable lab. Mobile navigation scrolls the workspace into view, editor/notes text uses 16 px, and the reading pane avoids a long expanded chapter list.
- Added two browser cases in both desktop and Pixel 7 projects: the full beginner interaction contract and static-URL navigation into the real studio. Existing six-chapter journeys remain in the suite.

- Pandas/NumPy import warmup now runs inside the 60-second initialization budget before the 8-second learner execution timer starts. The regression run exposed a valid pandas solution timing out when its first import consumed the execution budget on a loaded runner.

## Reproduce

```bash
npm ci
npm run check
npm run test:e2e
npm run dev -- --port 5173 --strictPort
```

Open `http://127.0.0.1:5173/#/python/variables`. On Android-sized screens choose Read, open worked example 1 in the coding lab, press Run code and inspect `Workload: 10.00 hours`. Edit the program, run an invalid statement, inspect stderr, then choose an exercise and use Check exercise. A correct-looking output with the wrong numeric value must fail. Both exercises and recall must pass before chapter completion is enabled. Write a personal note, reload and check it remains.

An independent Vite development-server smoke test on port 5173 opened the beginner lesson at Pixel 7 dimensions, loaded worked example 1 into the editable lab and ran actual Pyodide. It produced exactly `Workload: 10.00 hours\n` with no page errors. See `screenshots/android-dev-example.png`.

The production build preview is `npm run preview -- --port 4173`, with the same `/#/python/variables` route. It was tested locally. No publicly reachable development preview has been published; a phone-accessible hosted preview requires separate deployment approval. The public Pages URL remains unchanged.

## Final validation

- `npm run check`: passed scoped lint, 12 unit/content/storage tests, coverage reporting, 42 executable curriculum checks and production build.
- `npm run test:e2e`: **38 passed** across desktop Chromium and emulated Pixel 7 on the final application source.
- `npm audit --audit-level=moderate`: zero known vulnerabilities.
- Development-server smoke: real example output `Workload: 10.00 hours\n`, no page errors.
- Screenshots reviewed: desktop light/dark, Android editor, output, concise syntax error, persisted notes, development example and old public page.
- Final GitHub-hosted CI has not been claimed as verified; the pushed branch triggers its own check and preview-artifact upload, without deploying.

Exact logs: `check-output.txt` and `browser-output.txt`. The all-course route assertion was updated for the new Python heading; the 24-page accessibility sweep received an explicit 120-second test budget for shared runners. No correctness assertion was removed. The initial full run exposed pandas initialization timing; the corrected full run passed.

## Limits

Pixel 7 Chromium emulation verifies browser interactions and viewport layout; it does not verify a physical OPPO device, Android keyboard, TalkBack or PWA installation. No full-course completion claim is made. Six foundation chapters and twelve graded exercises exist; eighteen required topic groups, broader practical coverage, assessed capstone, independent editorial review and full course acceptance remain open in `coverage.json` and `IMPLEMENTATION-CHECKPOINT.md`.
