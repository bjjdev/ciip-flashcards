# ciipflash — Methodology

How content gets made on this project, and why the boundaries are where they are.

This is a living document. If something here disagrees with the code, the code is right and this file is stale — fix it. If a real decision changes the methodology, write a new ADR (`decisions/ADR-NNN-*.md`) and update the relevant section here.

---

## 1. The source-discipline ladder

Content on this project lives in four layers. Each layer has different allowed inputs. Mixing them up is how copyright trouble starts and how learning gets diluted.

### Layer 1 — `raw/` (third-party material, untouched)

The user attended a CIIP bootcamp. The original PDFs, slides, and lecture transcripts from that bootcamp live under `../../raw/`. They are **never modified, never republished, and never quoted publicly**. Their only purpose is private study and serving as the source for Layer 3.

### Layer 2 — `wiki/` (private study notes)

Compiled summaries of the bootcamp material in the user's own words. Lives under `../../wiki/abii-ciip/`. Used **only for private study and as a topic-taxonomy index** to know what subjects exist. The wiki is **not** an allowed source for any public output, because its content is derivative of Layer 1.

### Layer 3 — `cards.json` (the paid flashcards)

The 159 MCQ cards that drive the paid flashcard app. Sourced **only from the bootcamp slides + lecture transcripts in `raw/`**, in the user's paraphrase, formatted as exam-shaped multiple-choice questions. The cards are paywalled, so brief paraphrased Q&A drawn from study material the user paid for falls inside personal-study fair use. (See `feedback_ciip_flashcard_sources.md` in user memory for the full rule.)

### Layer 4 — `learn/` (public, free, SEO-discoverable)

The public Learn section. Sourced **only from the authoritative public source pool below**. Never from `raw/`, never from `wiki/`, never from training-data recall without verification. The structural backbone (which topics get covered) is the official ABII Test Content Outline (TCO), used as an organizational schema only — never reproduced as text.

**Authoritative source pool for Layer 4:**

- DICOM standard (NEMA, dicomstandard.org)
- HL7 v2 / FHIR specs (hl7.org, hl7.org/fhir)
- IHE Technical Frameworks (ihe.net)
- HIMSS-SIIM Enterprise Imaging white papers
- ACR-AAPM-SIIM technical standards
- Peer-reviewed journals: RadioGraphics, J Imaging Informatics in Medicine, Insights into Imaging
- AAPM Task Group reports
- NIST / NLM / NEMA standards
- Vendor-neutral primers when documenting standards (not marketing)

**Synthesis rule:** every paragraph paraphrases from the cited sources in the author's own words. Quotations are short (≤25 words), clearly marked with quotation marks, and inline-cited. The HTML output never contains raw passages from copyrighted material.

---

## 2. Voice and tone

The Learn section is written for **first-time CIIP candidates** — working radiology professionals who have not used spaced-repetition tools before and may be new to imaging-informatics standards.

- **Beginner-friendly, not condescending.** The reader is smart but new to this specific learning method and possibly to several specs.
- **Lead with the why, then the what.** Why does DICOM exist before what a SOP class is. Why does IHE exist before what XDS-I is.
- **History matters.** Where helpful, name the people and decades — Ebbinghaus 1885, Wozniak 1985, the early DICOM committees. Anchors abstract specs to a story.
- **Glossary on first use.** Every acronym spelled out the first time it appears in an article (`DICOM (Digital Imaging and Communications in Medicine)`).
- **Cite as you go.** Inline `[^N]` markers, full references at the bottom.
- **No hype.** Don't sell the exam, don't sell the app, don't oversell the standards.

---

## 3. Free vs paid boundary

| Surface | Status | Why |
|---|---|---|
| `/learn/*` | Free, public, SEO-indexed | Builds trust, drives discovery, no proprietary content |
| `/about` | Free, public | Methodology + AI disclosure |
| `/` (dashboard) | Paid | Per-user SRS state |
| `/study`, `/exam`, `/exam-results`, `/stats` | Paid | The core product |
| `/upgrade`, `/login`, `/account` | Public | Required for purchase flow |
| `/tos`, `/privacy` | Public | Required by law |

The Learn section never includes the flashcards themselves. A small cross-promo panel at the bottom of each Learn article links to `/upgrade` or `/login`. That's it.

---

## 4. AI authorship policy

This project uses Claude (Anthropic) for research collation and drafting assistance, with the user as final author and reviewer.

- **Per-article footer:** every Learn page ends with a short note acknowledging the assist and pointing to `/about`.
- **Site-wide policy at `/about`:** describes the workflow (sources gathered, outline reviewed, draft reviewed, user edits in own voice before publish).
- **Code commits:** `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` trailer on commits Claude helped write. Existing practice; keep doing it.

Decisions about AI involvement are recorded in `decisions/ADR-005-ai-disclosure-policy.md`.

---

## 5. How decisions are recorded

Three layers of audit trail, used for different purposes:

1. **`decisions/ADR-NNN-*.md`** — Architecture Decision Records. One file per real decision (not for routine implementation). Three paragraphs: Context, Decision, Consequences. Immutable once written; supersede via a new ADR rather than editing.
2. **Memory (`~/.claude/projects/.../memory/`)** — cross-session preferences, paste-ready commands, current project state. Updated continuously.
3. **Git history** — what changed and when. Commit messages explain *why*, not just *what*.

When in doubt: small implementation choices live in code + commit messages. Real decisions get an ADR. Anything Claude needs to know in a future session goes in memory.
