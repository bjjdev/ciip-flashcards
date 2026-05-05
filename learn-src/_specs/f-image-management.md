# Spec: F. Image Management

**Domain:** F (23 scored questions — heaviest weight on the exam)
**Slug:** `f-image-management`
**Target length:** ~3,000–3,500 words (this is the heaviest domain; the article should run a bit longer than average)
**Status:** Phase 1 (spec) — awaiting user review before phase 2 begins

## Audience

First-time CIIP candidates: working radiology technologists, PACS administrators, and informatics generalists. Assumed background — comfortable with hospital imaging workflow, may not yet know how DICOM, IHE profiles, and modality worklists fit together. New to enterprise imaging beyond traditional radiology.

## Scope

**In:** the full lifecycle of an imaging study, from the moment a modality acquires a study to the moment it's archived, exchanged, or pulled into an enterprise imaging context. Reading-room ergonomics, display QA, workflow integrity (modality worklist, storage commitment, order reconciliation), portable-media and cloud export, retention and deletion policy, and the broadening of "imaging" beyond radiology to pathology, dermatology, wound care, endoscopy, and cardiology.

**Out:** deep IT infrastructure (covered in Domain G — storage architecture, networks, hardware/software), system management and capacity planning (Domain H), modality engineering and clinical-engineering integration (Domain I), and the underlying standards/profiles themselves (Domain J — DICOM internals, IHE profile catalog, HL7 vs FHIR comparison). This article references those topics where relevant and links to the corresponding Domain articles when they exist.

## TCO coverage checklist

Every subcategory under Domain F in the official ABII Test Content Outline (March 2024 edition) must map to a planned section heading below. Sub-items are addressed inside the parent section.

- [ ] **F.1 Environmental Design for Viewing and Interpreting Images** → planned section: *"The reading environment: ergonomics, lighting, and room layout"*
  - Covers F.1.a (ergonomics), F.1.b (environmental factors — ambient light, noise, temperature), F.1.c (room layout and physical considerations).

- [ ] **F.2 The Human-Computer Interface** → planned section: *"At the workstation: clinical systems, input devices, and displays"*
  - Covers F.2.a (EMR/RIS/PACS/reporting integration), F.2.b (input devices — mouse, keyboard, dictation, gesture/voice), F.2.c (display devices — diagnostic vs. clinical-review monitors, calibration, GSDF).

- [ ] **F.3 Workflow Processes** → planned section: *"From acquisition to read: the imaging workflow"*
  - Covers F.3.a (postprocessing workflow — 3D, MIP/MPR, AI prep), F.3.b (data compression — lossy vs. lossless, JPEG-2000), F.3.c (image workflow — display protocols, read-ready), F.3.d (key images and annotation), F.3.e (teaching files), F.3.f (research and clinical trials, de-identification), F.3.g (acquisition and display terminology), F.3.h (technologist exam QC — image-count confirmation), F.3.i (reporting and results communication — preliminary/final/addended, structured vs. narrative reports), F.3.j (exam data integrity QC — storage commitment, order reconciliation, modality worklist), F.3.k (workflow optimization), F.3.l (remote interpretations — teleradiology, telehealth).

  This is the longest section by far; it covers half of Domain F's testable surface. The article should give it room (1,200–1,500 words on its own), with `<h3>` subheadings to keep it navigable.

- [ ] **F.4 Image Exchange** → planned section: *"Moving studies between systems and across enterprises"*
  - Covers F.4.a (policies and procedures), F.4.b (import and reconciliation workflow), F.4.c (data integrity), F.4.d (export workflow — portable media, cloud), F.4.e (standards of file exchange — DICOM CD/USB, IHE PDI, XDS-I), F.4.f (cross-enterprise image exchange — image-sharing networks, HIE).

- [ ] **F.5 Imaging Data Archiving** → planned section: *"Retention, deletion, and the long-tail archive"*
  - Covers F.5 (retention and deletion policies). Short section — the deeper archive architecture (NAS/SAN/cloud, online/nearline/offline tiers) belongs in Domain G; here we cover the policy/governance side.

- [ ] **F.6 Enterprise Imaging** → planned section: *"Beyond radiology: enterprise imaging across specialties"*
  - Covers F.6.a (visible-light imaging — pathology, dermatology, wound care, endoscopy), F.6.b (radiology), F.6.c (cardiology). This is where the HIMSS-SIIM Enterprise Imaging Workgroup body of work belongs.

## Article structure (proposed)

1. Brief intro: why Image Management is the heaviest domain on the exam, and what reading this article should leave you confident about.
2. The reading environment (F.1)
3. At the workstation (F.2)
4. From acquisition to read (F.3) — long section, multiple `<h3>` subsections
5. Moving studies between systems (F.4)
6. Retention, deletion, and the long-tail archive (F.5)
7. Beyond radiology: enterprise imaging (F.6)
8. Glossary (acronyms used in this article — first-use spellouts already in the body, but a glossary box at the end helps reference)
9. References list (numbered, with `[^N]` markers in the body)
10. Authorship footer + cross-promo

## Source pool to query in phase 2

Primary sources we'll target during deep-research (in order of expected weight):

- **HIMSS-SIIM Enterprise Imaging Workgroup white papers** — directly addresses F.6 and large parts of F.3, F.4
- **DICOM Standard PS3.1 (overview)**, **PS3.4 (service classes — modality worklist, storage commitment, query/retrieve)**, **PS3.14 (GSDF — Grayscale Standard Display Function for monitors)**
- **IHE Radiology Technical Framework** — relevant profiles: SWF (Scheduled Workflow), PIR (Patient Information Reconciliation), KIN (Key Image Note), TCE (Teaching File and Clinical Trial Export), PDI (Portable Data for Imaging)
- **IHE IT Infrastructure Technical Framework** — XDS-I.b (Cross-Enterprise Document Sharing for Imaging)
- **AAPM TG-18** — display performance and acceptance testing for medical monitors (foundational for F.2.c)
- **AAPM TG-270** — display QA in the era of LCD/OLED (current, supersedes TG-18 acceptance protocols)
- **ACR-AAPM-SIIM Practice Parameter for Determinants of Image Quality**
- **RSNA RadioGraphics review articles** on workflow optimization, teleradiology operational considerations, structured reporting
- **NIST guidance** for de-identification (relevant to F.3.f research workflows)

## Open questions for user review

1. **Coverage check** — does the section mapping above cover every subcategory you remember from the bootcamp? Specifically check F.3 (12 sub-items) — that's where coverage is easiest to drop something accidentally.
2. **Headings tone** — section headings paraphrase the TCO into reader-friendly titles. Do they read in your voice? E.g., "From acquisition to read: the imaging workflow" vs. a more formal "Workflow Processes." Adjust before phase 2 if you want a different tone.
3. **Length** — 3,000–3,500 words is roughly 12–14 minutes of reading. Right ballpark for a domain page, or do you want it shorter (~2,000) and split if it overflows?
4. **Pilot fit** — F is the heaviest exam domain and the broadest topic surface (good SEO play). Confirms it's still the right pilot, or want to swap to a smaller domain (e.g., E or A) to validate the pipeline with less risk?
