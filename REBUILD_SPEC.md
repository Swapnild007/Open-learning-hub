# Open Learning Hub 2.0 — reference-driven clean rebuild

## Decision
Discard the prior dark/indigo hero design and generic 18-course demo as the product baseline. Preserve main as rollback; rebuild on this branch. Never claim the rebuild is deployed until the actual published page is verified.

## Reference observations from user screenshots (2026-10-21)
- All CS Notes: slim white navigation; compact illustration-led hero; mint/emerald action accents; light gray catalogue surface; two-column course cards on narrow screenshot with large themed illustration occupying most of each card; meaningful course metadata.
- Lesson/article: substantial connected prose, checkpoints, original visual diagrams, explicit progression, runnable-looking code examples.
- Old OLH: giant dark hero with low-contrast heading; visual ornament instead of useful illustration; sparse lessons; generic course maps.

## Product requirements
1. 36-course catalogue with verifiable syllabus inventory; original lesson text and assets only.
2. Reusable course page, module accordion, visual lesson reader, examples, checks, projects and progress.
3. Illustrations must explain actual concepts, not serve only as decoration.
4. Mobile-first responsive layout, no horizontal overflow, readable type and accessible contrast.
5. Track actual written/verified lessons separately from planned lessons; no false completeness claims.
6. Original identity, branding and diagrams; do not copy reference copyrighted content or graphics.

## Visual acceptance tests
- Hero readable on mobile and desktop with no dark-on-dark headline.
- Mobile screenshot at 360px: compact hero, clear CTA, usable search and card grid.
- Catalogue cards prioritize artwork and clear information hierarchy.
- Lesson screenshot includes heading, teaching text, concept diagram, checkpoint and worked code.
- Test 360px, 768px and 1280px with screenshots; compare composition and hierarchy to reference.

## Engineering gates
- Static-hosting-safe deep links, filters, accessible controls, persisted progress.
- Tests for route handling, content completeness, quiz grading and persistence.
- Publish preview and verify HTTP and browser rendering before merging main.
- Replace main only after verified content and feature completion.

## Status
Reference audit updated. Current rebuild code remains an unverified scaffold and must be replaced. No release claimed.
