# ADR-004 — TCO as structural backbone for Learn pages

**Status:** Accepted · **Date:** 2026-05-04

## Context

The public Learn section needs a way to ensure each article is comprehensive — covering everything the CIIP exam tests for that domain — without inadvertently becoming a paraphrased copy of the bootcamp wiki (see ADR-003) or wandering off-topic into adjacent specs. We also want every article to feel structurally consistent so a reader who reads one knows how to navigate the next.

The ABII Test Content Outline (TCO) is the authoritative blueprint of what the CIIP exam covers. ABII publishes it publicly so candidates can prepare. Bootcamps, prep books, and study guides all use it the same way: as a table-of-contents skeleton for their original material. It functions as an organizational schema — the kind of unprotectable structure that anyone preparing exam material is expected to follow.

## Decision

Each Learn article's `<h2>`/`<h3>` headings map 1:1 to the TCO subcategories under that domain. Specifically:

- The Phase 1 topic spec includes a coverage checklist with every TCO subcategory mapped to a planned section heading.
- The Phase 3 outline must address every checklist item or explicitly mark it out of scope.
- Section headings are **paraphrased** into reader-friendly titles where the TCO's wording is dense (e.g., "Operational Continuity, Disaster Recovery, and Backup Procedures" might become "Keeping the system up: backups, failover, disaster recovery").
- Body content is researched and written from the authoritative source pool — never from the TCO's body text.

The TCO is referenced at the top of each article ("This article covers Domain X of the ABII CIIP exam blueprint") with a link to ABII's official page. We cite its existence and scope; we don't quote its descriptive language.

## Consequences

- Every article guarantees 100% coverage of what the exam tests for its domain — useful for the reader and a verifiable property of the build.
- Article structures are predictable across the 10 domains, which improves both reader navigation and SEO (consistent header hierarchies, internal linking targets).
- The Learn taxonomy aligns with the flashcard app's domain taxonomy, so cross-promo between Learn pages and study cards is natural.
- If ABII updates the TCO (the current one is dated March 2024), every Phase 1 spec needs review and articles may need new sections. The build process will surface this as coverage gaps in the outline phase.
- This stays inside fair use of an organizational schema. Reproducing TCO body text would not — that line is in `METHODOLOGY.md` and is not negotiable.
