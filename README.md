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
- `wfm-curriculum.html`: four-track, 144-lesson WFM curriculum map informed by Call Centre Helper's published industry reference material. It links to original references and does not reproduce their articles, spreadsheets, assets or code.
- `wfm-glossary.html`: searchable WFM glossary with 30 terms, illustrative formulas and metric-governance caveats.
- `404.html`: branded not-found page.
- `robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.svg`: discovery and branding basics.

**Important:** The 144 WFM entries are a curriculum map, not 144 completed lessons. Each lesson still needs source-grounded explanations, independently checked worked examples, exercises, answer explanations, assessments and appropriate original practice data. Browser progress is a local demonstration, not an authenticated learner record or certificate.

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
- Author the 144 WFM lessons in the four mapped tracks.
- Build original browser-native tools for forecasting, Erlang staffing, shrinkage, scheduling and multichannel capacity planning.
- Include assumptions, validation cases, worked examples, exercises and source references.
- Compare model outputs with independently calculated test cases before presenting them as reliable.

### P1 — Other academies
- Expand Excel, Power BI, Python and Power Automate into complete assessed curricula.

### P2 — Learning platform capabilities
- Add lesson-level progress, bookmarks, quiz scoring and printable project briefs.
- Add source review dates, content versioning and ongoing quality checks.

## Curriculum quality standard

Each complete lesson should include learning objectives, prerequisites, an explanation of concepts and assumptions, a reproducible worked example, a hands-on lab, common mistakes, a knowledge check with explained answers, a workplace scenario and references to authoritative documentation.

## Technical constraints

This is a static site with no backend. Browser-local progress can be lost when site data is cleared and does not sync across devices. Never use confidential workplace data in public examples.
