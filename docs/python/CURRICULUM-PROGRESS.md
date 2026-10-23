# Curriculum continuation: collections

This is another implementation checkpoint, not full-course completion.

## Published baseline

Approved local commit `3cacc30fc5f4216c8a66729601b3837397071cfb` was published through the connected GitHub API as `15d086667dbe93601d2b056ab0616816db6dbc44`. Its tree `40aaa4f405adad99220c9727ac82a07457060d0a` exactly matches the approved commit, including source, tests, documents and screenshots. Direct git push failed because this environment has no command-line GitHub credential. API publication changed commit metadata, not file contents.

Both GitHub Actions runs for that baseline completed successfully:

- [PR run 39994741606](https://github.com/Swapnild007/Open-learning-hub/actions/runs/39994741606)
- [Push run 39994735869](https://github.com/Swapnild007/Open-learning-hub/actions/runs/39994735869)

Each passed install, dependency audit, lint, unit checks, executable curriculum checks, production build and browser suite; each uploaded the test-evidence and development-preview artifacts. No merge or deployment occurred.

## Added chapter

`#/python/collections` follows functions and precedes exceptions. It includes original explanations of lists, tuples, sets, dictionaries, slicing, unpacking, mutation, aliases, shallow copies and validation contracts. Two executed examples demonstrate nested sharing and stable aggregation. Two behavior-graded exercises cover first-seen deduplication and non-mutating validated team totals. Tests include empty input, previously unseen names, trimming, case sensitivity, ordering, missing fields, zero, negative counts, booleans, decimal/text counts and source preservation. The recall question is checked against an executable aliasing proof.

A dedicated browser case rejects sorted-only deduplication, accepts an alternative correct implementation, rejects a solution that mutates records, then accepts the actual aggregation solution. The existing full Python journey also visits the new chapter and its completion gates. Reference retrieval: Python 3.12 tutorial data structures, 23 October 2026; teaching text and examples are original. Independent editorial review is still pending.

## Current scope and critical path

- Seven authored chapters; fourteen worked examples and fourteen graded exercises.
- 49 executable checks: example outputs, accepted solutions, rejected starters and recall proofs.
- Seventeen required topic groups still lack dedicated chapters; `coverage.json` retains `courseComplete: false`.
- Next foundations: modules/imports, standard library, files/pathlib/CSV/JSON, environments/packages, typing/docstrings and testing.
- Then iterators/generators, decorators/context managers, concurrency, performance/security, NumPy/visualization, HTTP/automation and an assessed reporting capstone.
- Existing chapters still need wider assessments and independent instructional acceptance. Physical Android keyboard/TalkBack/PWA checks and multi-build cache upgrades remain open.

The private browser preview workflow is documented in [ANDROID-PRIVATE-PREVIEW.md](ANDROID-PRIVATE-PREVIEW.md). A Codespace has not been created here; no live phone URL or physical-device result is claimed.

## Local verification of the continuation

Source fingerprint `d0f04ac64ff9`: `npm run check` passed lint, 12 unit tests, coverage reporting, all 49 executable content checks and production build. All 14 Python browser cases passed across desktop Chromium and emulated Pixel 7, including seven chapter journeys and the new mutation/order cases. Exact logs are `collections-check-output.txt` and `collections-browser-output.txt`. The configured complete suite now has 40 cases; its GitHub-hosted result must be checked on the published continuation commit.

The first local authoring check caught an extensionless import incompatible with the Node executable-content runner. It was corrected to an explicit `.ts` import before the successful verification. No assertion was removed.
