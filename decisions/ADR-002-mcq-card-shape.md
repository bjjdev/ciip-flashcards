# ADR-002 — Every card is a 4-option MCQ

**Status:** Accepted · **Date:** 2026-05-01

## Context

Flashcards can take many shapes — front/back text, cloze deletions, image occlusion, free-response. The ABII CIIP exam is exclusively multiple-choice with four options. A card schema that mirrors the exam format would let the same content drive both study and mock-exam runs without conversion.

## Decision

Standardize every card on a 4-option MCQ shape:

```json
{
  "id": "<NN>-<NNN>",
  "domain": "<A-J>",
  "front": { "question": "..." },
  "back": {
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "answer": "<A|B|C|D>",
    "explanation": "..."
  },
  "tags": [...],
  "source": "..."
}
```

The four-option constraint is a hard contract; the build pipeline rejects cards that don't conform.

## Consequences

- Mock exam mode is a thin layer over the existing card data — no schema migration needed when we added it.
- MCQ-first study mode is also free: pick A/B/C/D, system auto-rates Good or Again based on correctness.
- Some kinds of imaging-informatics knowledge don't fit naturally into 4-option MCQ (e.g., "list the seven attributes of a DICOM SOP class"). We accept this loss; for those facts, the explanation field carries the list.
- The card browser in `stats.html` had to be rewritten when we converted from flat `{front, back}` strings to the structured shape — a `[object Object]` rendering bug shipped briefly because the browser still used the old field paths.
- This shape is now load-bearing for any future feature touching cards (custom decks, exam-mode variants, AI-generated explanations). Changing it requires a new ADR and a migration plan.
