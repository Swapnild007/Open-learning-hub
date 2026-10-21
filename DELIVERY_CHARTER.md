# Ownership and delivery charter

**Product:** Open Learning Hub 2.0
**Owner:** AI implementation lead; repository owner retains merge and release control.
**Baseline:** rebuild/allcsnotes-inspired-v2; main is rollback.
**Goal:** original, mobile-first education platform with All CS Notes-inspired discovery and learning UX.

## Scope
P0: academy homepage, searchable course catalogue, course detail, reusable lesson reader, routing, mobile navigation, accessible components.
P1: authored curriculum, interactive examples, quizzes, local progress and resume, curated paths.
P2: optional identity, sync and verified certificates when backend is available.

## Nonnegotiable quality gates
- No fake lessons, counters, quizzes or certificates.
- No copyrighted text, images or branding copied from reference.
- No release before working deep links, 360/768/1280 viewport checks, keyboard navigation, progress persistence, and course schema validation.
- Run automated checks and inspect actual rendered pages; document any test environment limitations.
- Keep changes in feature branch until approved release.

## Work breakdown
1. Audit reference page types and navigation.
2. Establish tokens, components and course JSON schema.
3. Build responsive academy and catalogue.
4. Build course details and lesson engine.
5. Author complete course material and assessments.
6. Verify behavior, accessibility and mobile rendering.
7. Replace legacy implementation and prepare PR.

## Risks and mitigations
- Large curriculum scope: publish only authored content, track coverage.
- Static hosting: use hash or base-path-safe routing and local storage.
- Migration: preserve main and take backups before deletion.
- Browser inconsistencies: validate on mobile and desktop.
- Scope creep: P0 gates before P1, P1 before P2.

## Status
Charter committed. Application implementation and verification are not yet complete.
