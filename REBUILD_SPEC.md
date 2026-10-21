# Open Learning Hub — clean rebuild

This branch is the clean-rebuild workspace. The existing main branch remains untouched until replacement passes review.

## Product direction
Original educational platform inspired by All CS Notes' information architecture, with original branding, artwork, and lesson content.

## Required surfaces
- Landing page with search, categories, featured paths and course catalogue
- Course catalogue with level and topic filters
- Course detail with outcomes, module accordion and lesson inventory
- Lesson reader with notes, examples, exercises, checkpoints and progress
- Curated multi-course paths
- Mobile-first accessible navigation

## Course schema
Course: id, slug, title, summary, category, level, outcomes, prerequisites, modules.
Module: id, title, order, lessons.
Lesson: id, title, duration, objectives, sections, examples, exercises, quiz.

## Release gates
1. All navigation and deep links work on GitHub Pages.
2. Responsive layouts at 360px, 768px and desktop.
3. Course/lesson counts are derived from actual authored records, never fabricated.
4. Progress survives reload and upgrades.
5. No copied copyrighted course material or site branding.
6. Automated smoke tests and manual visual comparisons pass.

## Migration policy
Replace legacy files only after a complete, verified build. Do not delete main or destroy history.
