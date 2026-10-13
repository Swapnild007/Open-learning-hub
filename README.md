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

The initial version is a self-contained static website in `index.html` with embedded CSS and JavaScript. It includes:

- Five academy catalogue cards and curriculum maps.
- Search and category filters.
- Responsive navigation and course curriculum dialogs.
- Local-browser tracking for academies explored.
- Page title, description, canonical URL and social metadata.
- Reduced-motion support, semantic landmarks and keyboard-accessible controls.

**Important:** Curriculum maps are not yet complete courses. Each module still needs full lesson content, verified worked examples, exercises, answer explanations, assessments and downloadable practice datasets. Progress tracking is a local demonstration, not an authenticated learner record or certificate.

## Run locally

Open `index.html` in a modern browser. For a local HTTP server, use any static file server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Open repository **Settings → Pages**.
2. Select **Deploy from a branch**.
3. Choose `main` and `/(root)`, then save.
4. Wait for the Pages deployment to complete and verify the published URL on desktop and mobile.

The expected project URL is `https://swapnild007.github.io/Open-learning-hub/`. A custom domain requires ownership of that domain and DNS configuration; it is not created by HTML changes alone.

## Planned delivery sequence

### P0 — Foundation and verification
- Confirm repository structure, published Pages URL and deployment status.
- Validate responsive behaviour, links, accessibility, browser console and local progress.
- Add a custom not-found page and deployment guidance.

### P1 — Learning content
- Build the WFM glossary and foundational WFM lessons first.
- Add forecasting examples in Excel, Python and R, with comparable test data and documented assumptions.
- Develop Erlang staffing and multi-channel capacity labs.
- Expand Excel, Power BI, Python and Power Automate into complete, assessed curricula.

### P2 — Learning platform capabilities
- Add lesson-level progress, bookmarks, quiz scoring and printable project briefs.
- Add source references, content review dates, version notes and quality checks.
- Add automated checks for broken links, HTML validity and accessibility regressions.

## Curriculum quality standard

Each full lesson should include:
1. Learning objectives and prerequisites.
2. Clear explanation of concepts, terms and assumptions.
3. A worked example with reproducible inputs and expected output.
4. A hands-on lab with a defined deliverable.
5. Common mistakes and debugging guidance.
6. Knowledge check with explained answers.
7. A practical workplace scenario.
8. References to official documentation where relevant.

## Technical constraints

This first version has no backend and does not send personal data to a server. Browser-local progress can be lost when site data is cleared and does not sync across devices. Do not enter confidential workplace data into public examples.

## Contributing

Keep lessons accurate, version-aware, practical and clearly sourced. Never label a lesson complete solely because a curriculum card or placeholder exists.
