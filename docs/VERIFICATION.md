# Verification evidence

Date: 2026-10-22. Application is static: learner UI → typed course content/local progress or browser worker → rendered response. No server API or third-party credential is part of the verified flow.

## Reproduction

```bash
npm ci
npm run check
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=moderate
node scripts/screenshots.mjs
```

Local runtime: Node 24.19.0, Vite 7.3.7, Vitest 5.0.5, Playwright 1.56.1 / Chromium 141. GitHub Actions uses Node 22. Source includes a lockfile. Build emits the app, SQL worker and 659.81 KB uncompressed SQLite WASM; application JavaScript is approximately 106.7 KB gzip. Vite emits benign Node-module externalization warnings for sql.js; real browser SQL execution and offline SQL were explicitly tested instead of inferring success from the build.

## Results

| Check                                         | Evidence                                                                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Strict typed build                            | `npm run check` completed successfully; no unused locals/parameters allowed                                                        |
| Unit checks                                   | 3 files, 9 passing tests; curriculum uniqueness, graph, search, progress/import contracts, dates and synthetic data reconciliation |
| Full browser suite before added settings case | 24/24 passed in approximately one minute; see `test-output-browser.txt`                                                            |
| Added settings/legacy case                    | Tested separately after correcting exact accessible locators; see `test-output-settings.txt`                                       |
| All course pilots                             | All 108 checkpoints and assignment gates, then all 36 project rubrics and completion records; both viewport projects               |
| Route integrity                               | All 36 overview and 108 reader routes rendered expected headings without page errors or horizontal overflow                        |
| Accessibility                                 | 12 primary page types × 2 themes × 2 viewport projects; no violations in the selected axe WCAG rules                               |
| Dependency audit                              | Zero known vulnerabilities in the final dependency audit; raw `dependency-audit.json` included                                     |
| Screenshots                                   | 24 original application screenshots in `screenshots/`; desktop and Android-sized views                                             |
| Legacy sample formatting                      | 17 Python entries preserved; 16 repaired example blocks parse as Python, one intentionally contains shell commands                 |

`test-output-browser.txt` and the targeted settings log distinguish actual runs rather than inventing a single aggregate run. CI runs the full current suite and retains its own HTML report and traces for 14 days. Read the PR checks for the hosted CI result; local success is not a fabricated GitHub status.

## Defects found and repaired

- Fixed inline reference link distinguishability and mobile search icon accessible name.
- Corrected empty-state inline link styling.
- Changed tests from substring radio matching to exact accessible labels, so 20 Erlangs cannot accidentally match 120 Erlangs.
- Updated vulnerable Vite/Vitest dependencies to audited versions; the final audit has zero findings.
- Bound SQL runtime execution and row iteration; blocked allocation-oriented functions in the exercise interface.
- Repaired historical Python display escaping and the static 16-versus-17 lesson count in served copies.
- Used an explicit loopback host because all-interface enumeration is unsupported in this execution environment.

## What the evidence does not establish

- Comprehensive educational acceptance of 36 complete courses. All are still pilots.
- Full WCAG conformance, screen-reader usability, Firefox/WebKit support or physical Android installation.
- Real code execution for Python, Excel, Power BI, Power Automate, cloud AI or MCP integrations. Those are instructional subjects; this platform does not pretend to provision them.
- Secure grades, certificates, cross-device sync or instructor-reviewed capstones.
- Exhaustive penetration testing or cache upgrade behavior across all deployed browser versions.
- Public deployment. No public hosting change, release or merge has been performed.
