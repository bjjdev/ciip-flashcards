# ADR-005 — AI disclosure policy

**Status:** Accepted · **Date:** 2026-05-04

## Context

Claude (Anthropic) is involved in drafting Learn articles, building site features, and proposing copy. Two questions follow: how do we disclose this to readers, and how do we keep the disclosure honest as the project evolves?

The cultural baseline around AI disclosure has shifted quickly. A year or two ago, omitting any mention of AI involvement was common. In 2026, undisclosed AI authorship in educational content is increasingly seen as misleading — especially for content that affects readers' professional preparation, which is exactly what this project does. At the same time, an over-prominent disclosure can read as either a disclaimer or a marketing flourish, both of which undermine trust.

## Decision

Two-layer disclosure:

1. **Per-article footer.** Every Learn page ends with a small, plainly-worded note: *"Written by [name], with research and drafting assistance from Claude (Anthropic). Verified against the references above. See /about for our methodology."* Quiet, factual, links to the longer explanation.

2. **Site-wide policy at `/about`.** A dedicated page describing the workflow: where sources come from, how outlines are reviewed, how drafts are reviewed and edited by the user before publish. The reader who wants to know exactly what role AI plays can find out in 30 seconds.

For code commits, retain the existing convention of `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` trailers on commits Claude helped write. This is the audit trail for the engineering side.

## Consequences

- Readers always know what they're reading and who's responsible. The user is on record as the final author and reviewer for every Learn article — Claude's draft is a starting point, not the final text.
- The `/about` page becomes a load-bearing artifact. If the AI-involvement workflow changes (e.g., a new model, a different review cadence), `/about` updates and a new ADR follows.
- This policy is more transparent than what most competitors do in this space. We accept that as a feature, not a liability.
- If at any point the user wants to publish an article they wrote without AI assistance, the per-article footer can be omitted on that article and the source-of-truth shifts to a per-article authorship note. The site-wide `/about` page accommodates both.
