# Learn-section authoring process

How one Learn article gets built, end to end. Designed so that any contributor (or any future Claude session) can pick up a mid-flight article and know exactly what's done and what's next.

For *what* belongs in a Learn article and *why* the source pool is what it is, see `../METHODOLOGY.md`. For *what* decisions led us here, see `../decisions/`.

---

## Folder layout

```
learn-src/
├── PROCESS.md                  ← this file
├── _specs/<slug>.md            ← phase 1 output
├── _sources/<slug>.md          ← phase 2 output
├── _outlines/<slug>.md         ← phase 3 output
└── <slug>.md                   ← phase 4 output (the draft)
```

The published HTML lives at `learn/<slug>.html` after phase 5.

A `<slug>` is `a-procurement`, `f-image-management`, etc. — the same slugs used in card IDs and the TCO domain index.

---

## Five phases, three review gates

The user reviews after phases 1, 2, and 4. Phases 3 and 5 are mechanical and don't need a gate.

### Phase 1 — TCO-anchored topic spec

**Goal:** decide exactly what this article covers before any research begins.

**Output:** `_specs/<slug>.md`. Required sections:

```markdown
# Spec: <title>

## Audience
First-time CIIP candidates. Assumed background: working radiology
professionals; not yet familiar with [list any specific specs].

## Scope
In:
- ...
Out:
- ...

## TCO coverage checklist
For Domain <X>, the official TCO subcategories are:
- [ ] <subcategory 1> → planned section: "..."
- [ ] <subcategory 2> → planned section: "..."
- ...

(Every TCO subcategory under this domain MUST appear here, mapped to a
planned section heading. If something is out of scope, say why.)

## Target length
~2,500–3,500 words.

## Open questions
- ...
```

**Gate:** user reads the spec, confirms TCO coverage is complete, approves before phase 2 starts.

### Phase 2 — Source collection

**Goal:** gather authoritative public sources that cover everything in the spec.

**Tooling:** `deep-research` skill, scoped to the source pool in `METHODOLOGY.md`. Manual pass to drop low-quality results.

**Output:** `_sources/<slug>.md`. Each source gets a numeric ID used later for citations. Required per-source fields:

```markdown
[S01] DICOM PS3.4 — Service Class Specifications
URL: https://www.dicomstandard.org/current
Publisher: NEMA
Retrieved: 2026-MM-DD
Covers: Modality Worklist (MWL), Modality Performed Procedure Step (MPPS), Storage SOP classes
Key passages (paraphrase, ≤25 words verbatim if quoted):
- ...
```

Sources that aren't from the authoritative pool get rejected here, not later.

**Gate:** user skims the source list, flags any low-quality results, approves before phase 3 starts.

### Phase 3 — Outline

**Goal:** map every section to specific source IDs. No new research.

**Output:** `_outlines/<slug>.md`. The section headings come from the spec's TCO coverage checklist. Each section lists which `[S##]` IDs back its claims.

```markdown
## Modality worklist and the order-to-acquisition handoff

Sources: [S01], [S07]
Subsections:
- What problem MWL solves (the ADT-to-modality gap) — [S07]
- DICOM C-FIND service class basics — [S01]
- Common failure modes — [S07], [S12]
```

**Coverage check:** every TCO subcategory from phase 1 must appear in at least one section. If something's uncovered, fix the outline (or the sources) before drafting.

**No gate** — proceed straight to phase 4. The user will review the draft.

### Phase 4 — Draft

**Goal:** write the article in long-form prose, citing as you go.

**Rules:**

- Every paragraph paraphrases from the cited sources. No verbatim copying beyond short quoted definitions (≤25 words) clearly marked.
- Inline citations: `[^S01]` style markers. Reference list at the bottom.
- No facts from training-data recall. If a claim isn't traceable to a source in `_sources/<slug>.md`, either find a source for it or remove it.
- No bootcamp-derived phrasing. The wiki is closed during this phase.
- Every acronym spelled out on first use.

**Output:** `<slug>.md` in the `learn-src/` root. Front matter:

```yaml
---
title: <Reader-facing title>
description: <One-sentence summary, ≤155 chars for SEO>
domain: <Letter A–J>
slug: <slug>
last_updated: 2026-MM-DD
---
```

**Gate:** user reads the draft, edits in their own voice, signs off. The user's edits are part of the authorship — Claude's draft is a starting point, not the final text.

### Phase 5 — Render and publish

**Goal:** turn the approved markdown into a styled HTML page and ship it.

**Steps:**

1. Run `node build-learn.js` from `flashcards/`. This reads every `learn-src/<slug>.md`, renders it through the article template, writes `learn/<slug>.html`, and updates `sitemap.xml`.
2. Open the page locally (`python -m http.server 8000`), confirm rendering, footnote anchors, references list, mobile layout.
3. Run Lighthouse (Chrome DevTools). Performance ≥85, Accessibility ≥95, SEO ≥95.
4. `git add learn-src/<slug>.md learn/<slug>.html sitemap.xml && git commit -m "Publish Learn: <slug>"`.
5. Push. Netlify auto-deploys. Confirm live URL works.
6. After ~3–5 articles, check Google Search Console for impressions; adjust meta descriptions if click-through rate is low.

---

## When to stop and write an ADR

If during any phase you find yourself making a *real* decision about the project — the kind a future contributor would need to understand — pause and add an entry to `decisions/`. Examples:

- "We're switching from `marked` to a different markdown renderer."
- "We're adding a new source category to the authoritative pool."
- "We're going to rewrite the AI disclosure policy."

Routine choices ("which CSS class to use for a callout") don't need an ADR. The bar is: *would a new contributor be confused if this weren't documented?*
