# Open Learning Hub

A mobile-first learning academy for Workforce Management, Microsoft Excel, Power BI, Python and Microsoft Power Automate.

## Product principles

- Teach capability, not just terminology.
- Use progressive learning paths from fundamentals to advanced practice.
- Include worked examples, realistic labs, assessments, troubleshooting and capstone projects.
- Make the site usable on mobile, keyboard-accessible and lightweight.
- Be transparent about what is implemented versus planned.
- Keep basic browsing available without an account.

## Current implementation

- `index.html`: responsive academy catalogue, five tracks, search and filters, curriculum previews, local-browser exploration tracking, metadata and mobile navigation.
- `wfm-curriculum.html`: a self-paced WFM learning experience with one fully authored interactive KPI lesson, four-stage/24-mission course map, browser-local resume/completion tracking gated by the lesson knowledge check, model-answer feedback and a supporting workload Practice Lab. It uses original teaching content and links to Call Centre Helper references.
- `wfm-glossary.html`: searchable A–Z WFM glossary with 53 terms, illustrative formulas and metric-governance caveats.
- `404.html`: branded not-found page.
- `robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.svg`: discovery and branding basics.

**Important:** Only WFM Mission 01.1 is currently a fully authored lesson. The other 23 entries are mission briefs, not completed lessons. Lesson completion and resume state are saved in the current browser only. There are no accounts, cross-device sync, server-side grades or certificates.

## LMS architecture decision

This project is intentionally being developed as a lightweight, self-paced learning hub on GitHub Pages first. Its learning flow should lead with lessons, explanations, worked examples, knowledge checks and practical deliverables. Calculators are supporting practice tools, not the product itself.

We reviewed the open-source [Frappe Learning LMS](https://github.com/frappe/lms), which supports structured courses, lessons, quizzes, assignments, learner progress and certificates. It is a real full-stack LMS, but self-hosting requires a server stack including Docker/Compose and persistent services; it is not a drop-in replacement for this static GitHub Pages site. The current implementation therefore adds a small client-side learner flow without pretending to provide multi-user LMS capabilities.

**Upgrade trigger:** If the project needs learner accounts, instructor/admin roles, synced progress, graded submissions, cohorts or trusted certificates, plan a backend or evaluate deploying Frappe Learning as the LMS platform. Do not try to simulate secure accounts or official grades in browser-only JavaScript.

## WFM source policy

Call Centre Helper is a primary industry reference for WFM concepts, terminology, forecasting timelines, Erlang staffing, shrinkage, occupancy, scheduling and multichannel planning. The academy must author its own teaching content and web tools. Do not copy or redistribute publisher articles, downloadable workbooks, images, branding or code. Link to the original reference when it materially informs a lesson. Verify mathematical models independently and disclose assumptions and limitations.

## Run locally

Open `index.html` in a modern browser. For a local HTTP server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. WFM pages: `/wfm-curriculum.html` and `/wfm-glossary.html`.

## Publish with GitHub Pages

1. Open repository **Settings → Pages**.
2. Select **Deploy from a branch**.
3. Choose `main` and `/(root)`, then save.
4. Wait for deployment to complete and verify the published URL on desktop and mobile.

Expected project URL: `https://swapnild007.github.io/Open-learning-hub/`. A custom domain requires domain ownership and DNS configuration.

## Prioritized delivery sequence

### P0 — Verification

- Verify GitHub Pages deployment and published URLs.
- Test mobile layouts, navigation, browser console, accessibility and metadata.
- Add automated checks for broken links, HTML validity and accessibility regressions.

### P1 — Complete WFM content

- Turn the 24 WFM missions into complete guided lessons with mission-specific inputs, exercises, validated answers and clear workplace deliverables. Avoid splitting useful topics into unnecessary micro-lessons.
- Build original browser-native tools for forecasting, Erlang staffing, shrinkage, scheduling and multichannel capacity planning.
- Include assumptions, validation cases, worked examples, exercises and source references.
- Compare model outputs with independently calculated test cases before presenting them as reliable.

### P1 — Other academies

- Expand Excel, Power BI, Python and Power Automate into complete assessed curricula.

### P1 — Finish the self-paced learner journey

- Author the next complete lesson before marking its mission as available.
- Add previous/next lesson navigation and a clear published-vs-planned state as more lessons are completed.
- Expand quiz scoring and progress only alongside validated lesson content.

### P2 — Full LMS decision

- Reassess a backend LMS when multi-user accounts, synced progress, graded submissions, cohorts or certificates are actually required.
- Keep browser-local progress clearly labelled until then.
- Add source review dates, content versioning and ongoing quality checks.

## Curriculum quality standard

Each complete lesson should include learning objectives, prerequisites, an explanation of concepts and assumptions, a reproducible worked example, a hands-on lab, common mistakes, a knowledge check with explained answers, a workplace scenario and references to authoritative documentation.

## Technical constraints

This is a static site with no backend. Browser-local progress can be lost when site data is cleared and does not sync across devices. Never use confidential workplace data in public examples.
