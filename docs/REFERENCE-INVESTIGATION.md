# Reference investigation

Date: 2026-10-22. Public targets: `https://www.allcsnotes.com/`, `/courses/playwright`, and the official `morluto/rea` repository. No authentication, purchase, protected material or source-code extraction was attempted.

## Evidence

- The public homepage was retrieved with curl; its title was “Visual Computer Science Courses and Notes”. Public course HTML was also fetched successfully. `reference-markup.json` records headings and public button text, rather than retaining the website source in this repository.
- Initial direct Playwright navigation failed with `net::ERR_EMPTY_RESPONSE` at both 390px and 1440px.
- Retrying through the environment's configured proxy allowed public course navigation and screenshots at both viewport widths. `reference-observations.json` records actual page title, headings, visible controls and overflow measurements. Both widths reported no horizontal overflow.
- The official REA page and package metadata were inspected. `npx rea-agents --help` ran version 6.7.0 and exposed browser capture commands. Its screenshot command requires a loopback CDP endpoint and target ID.
- A Chromium CDP target was supplied to `capture-web-screenshot` with the exact allowed origin. The command did not return usable evidence within the bounded invocation; its failure is recorded in `reference-observations.json`. Playwright observations are the usable evidence. REA is not reported as successfully tracing the reference application.
- Reference screenshots were inspected for layout research and are not redistributed as product assets. Raw downloaded HTML and source bundles are not included.

## Observed public course layout

| Observation                                                         | Evidence                                                   | Original design response                                                         |
| ------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Clear course title, subtitle and audience/skills sections           | Course page heading inventory                              | Course overview describes purpose, prerequisites and learning objectives         |
| Course preview appears before purchase sections                     | Public heading: preview before buying; public preview link | Our lessons are directly accessible without a commercial gate                    |
| Mobile header simplifies controls, desktop shows broader navigation | Visible control inventory differs by viewport              | Collapsible mobile navigation and persistent desktop learning navigation         |
| Long page groups course contents, roles, bundles and FAQs           | Recorded h2/h3 sequence                                    | We separate reader, practice, projects and progress to reduce reader distraction |
| Both observed widths fit without horizontal overflow                | Browser measurement                                        | Automated overflow checks for all new lesson routes                              |

## Limits and assumptions

The public course page is primarily a course marketing/preview surface. Paid lesson-reader behavior, assessment grading, enrollment, certificates, persistence and offline behavior were not observed and are not claimed. Similarity in navigation concepts is a product decision, not evidence of the reference site's internal architecture. No salary, learner count, testimonial, certificate or purchase claims were adopted.

The Open Learning Hub identity, text, CSS book illustration, colors, data, code examples and component implementation are original. REA was a research aid attempted under a narrow public-origin scope, not a mechanism for copying protected educational material.
