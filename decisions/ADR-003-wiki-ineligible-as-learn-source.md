# ADR-003 — Bootcamp wiki is ineligible as a public Learn source

**Status:** Accepted · **Date:** 2026-05-04

## Context

The `wiki/abii-ciip/` folder contains compiled summaries of a third-party CIIP bootcamp the user attended — domain articles, lecture digests, glossary, exam overview. It is the most condensed, exam-focused study reference the project has, which made it tempting to repurpose as the body of the public `/learn/*` pages.

That would be an IP problem. Even compiled in the user's own words, the wiki's selection of facts, structure, and emphasis is derivative of the bootcamp's curriculum. Republishing it as ciipflash content — especially behind ciipflash's branding and AI-disclosure footer — risks misrepresenting the source and inviting a takedown or worse.

## Decision

The wiki is **internal-only**. It may be used as:

- A topic-taxonomy index ("what subjects exist within Domain F?") to inform Phase 1 spec writing.
- The user's personal study reference.
- The source for the paid flashcards in `cards.json` (where personal-study fair use applies because the cards are paywalled and drawn from material the user paid for).

The wiki may **not** be used as:

- A source for the body prose of any `/learn/*` article.
- A source for any other public-facing surface (landing page, blog, marketing copy).

Public Learn pages draw only from the authoritative public source pool documented in `METHODOLOGY.md`. During Phase 4 (Draft), the wiki is closed.

## Consequences

- Producing each Learn article requires fresh research from public standards, journals, and white papers. Slower than copy-paste; defensible.
- The `deep-research` skill scoped to the authoritative source pool is the workhorse of Phase 2.
- The official ABII Test Content Outline can still be used as a structural backbone (see ADR-004) — that's an organizational schema, not the wiki.
- If any phrasing in a Learn draft sounds suspiciously bootcamp-flavored, it gets flagged in user review and rewritten from sources.
- This decision is what makes the public Learn section legitimate. Reversing it would compromise the integrity of the project; revisit only with legal review.
