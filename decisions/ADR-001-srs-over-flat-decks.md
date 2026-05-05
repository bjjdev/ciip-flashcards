# ADR-001 — Spaced repetition (SM-2) over flat decks

**Status:** Accepted · **Date:** 2026-05-01

## Context

The first version of the CIIP study material shipped as static HTML/markdown decks (one file per domain, expandable Q&A). Reviewing them was linear: open the file, read top to bottom, hope something sticks. There was no record of which cards the user had seen, no concept of "due today," and no mechanism to push hard cards in front of the user more often than easy ones. For a 130-question exam covering 10 domains, this approach would have required either heroic discipline or wasted hours re-reading mastered material.

## Decision

Move the entire study experience onto an SM-2 spaced-repetition algorithm. Each card carries per-user state — `interval`, `repetitions`, `easeFactor`, `nextDue`, `failCount`, and a `history` log — persisted to Supabase. The user rates each card after answering (Again / Hard / Good / Easy), and the algorithm decides when the card is due again. Mastered cards drift out to weeks or months between reviews; failed cards return tomorrow. A leech threshold (`failCount ≥ 4`) flags chronically-missed cards for special attention.

## Consequences

- The card schema must include space for per-card state, and storage must persist per-user — drives the Supabase `progress` and `settings` tables.
- The dashboard becomes meaningful: streak, daily goal, due counts, retention, ease factor — none of which exist in a flat-deck model.
- Mock exam mode must decide whether to consume SRS state. We decided correct exam answers do *not* move the SM-2 interval (diagnostic, not learning), but missed exam questions are forced to quality=0 so they re-enter the queue.
- Marketing positioning leans on the SRS angle: "spaced repetition + diagnostic mock exam" is the differentiator vs. static question banks.
- All flat-deck files (`anki-*.html`, `anki-*.md`, `flashcards-*.md`) were deleted on 2026-04-30 to remove ambiguity about which surface is canonical.
