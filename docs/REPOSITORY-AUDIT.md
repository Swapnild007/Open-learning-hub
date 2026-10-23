# Repository audit

Baseline: `cc084f8` on `main`. Development branch: `codex/open-learning-hub-2`. The baseline had ten tracked files, no package manager, no external runtime dependencies, no workflow, no AGENTS.md and no application framework.

| Existing file            | Finding                                                                                                                                                  | Treatment                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `index.html`             | Monolithic inline CSS/JS, 18 course maps, filter/search and exploration/module flags; maps were acknowledged as incomplete                               | Preserve exact original under `public/legacy/index.html`; introduce component-based root entry point          |
| `python-curriculum.html` | 17 authored entries including capstone, not the 16 advertised in a static banner; retrieval, practice and three-item checks; sample strings over-escaped | Preserve root source; build migration repairs served sample display escaping; original storage key preserved  |
| `wfm-curriculum.html`    | 24 mission map, one fully authored published KPI lesson, worked practice and local state                                                                 | Preserve original route and data; add new governed-metrics pilot without inventing interval history           |
| `wfm-glossary.html`      | Original glossary with definitions, equations and denominator cautions                                                                                   | Preserve at original route; prominent navigation link                                                         |
| `README.md`              | Transparent implementation limitations, five-track direction, static Pages guidance                                                                      | Preserve as `docs/LEGACY-README.md`; replace root README with accurate build/review instructions              |
| `404.html`               | Static branded fallback, relative link                                                                                                                   | Preserve in public build                                                                                      |
| `favicon.svg`            | Small local brand asset                                                                                                                                  | Preserve                                                                                                      |
| `robots.txt`             | Permits crawling and references sitemap                                                                                                                  | Preserve discovery behavior in public output                                                                  |
| `sitemap.xml`            | Only three URLs, missing Python                                                                                                                          | Add Python and glossary/legacy coverage; hash routes are application navigation, not independent crawler URLs |
| `llms.txt`               | Five-track/catalog description, candid about incomplete content                                                                                          | Refresh to six-track pilot status without overstating completeness                                            |

## Architectural and quality debt

- Course-map completion did not mean an authored lesson or verified assessment. New progress has different IDs and explicit gates.
- Original course-map navigation was not a full reader route model. New hash routes cover course, lesson and project IDs, with useful unknown-route states.
- Raw local JSON reads could fail on malformed data; new state is validated and preserved on failure.
- Legacy Python samples contained literal backslashes before quotes/newlines. The served-copy migration repairs display only, leaving historical root source untouched. Sixteen of seventeen repaired sample blocks parse as Python; the remaining block deliberately contains terminal environment commands.
- Original static Python banner/max values said 16 while data contained 17. The served-copy migration must use the actual count.
- Legacy WFM practice labels a simplified load/shrinkage baseline in agents. It must not be mistaken for a verified Erlang service-level result; the new practice tool labels its output as hours and states the limitation.
- No security/test pipeline existed. New checks cover typed build, content graph, malformed state, unsafe import, read-only SQL and browser journeys; this is not an exhaustive penetration test.
- Existing repository had no project-wide license. Record external source attribution and leave licensing choice open.

## Preservation policy

No historical WFM or Python file is deleted. Original versions remain tracked at the root and recoverable at baseline. Served copies are generated into `public/`; the legacy catalog links to adjacent preserved pages. Nothing converts explored maps into earned mastery. No deployment or merge is part of this work.
