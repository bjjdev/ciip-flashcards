# Sources: F. Image Management

**Slug:** `f-image-management`
**Phase:** 2 (source collection) — awaiting user review before phase 3 (outline) begins
**Retrieved:** 2026-05-04

All sources below are publicly available. Each entry: source ID, title, URL, publisher, retrieved date, which TCO subcategories it covers, and short paraphrased notes about what's there. **No verbatim passages from these documents appear in the article body** — they're mined for facts in phase 4 and re-expressed in original prose with inline citations.

---

## Primary standards (DICOM)

### [S01] DICOM Standard PS3.4 — Service Class Specifications
- **URL:** https://dicom.nema.org/medical/dicom/current/output/chtml/part04/ps3.4.html
- **Publisher:** NEMA (National Electrical Manufacturers Association)
- **Retrieved:** 2026-05-04
- **Edition:** 2026a (current)
- **Covers TCO subcategories:** F.3.j (modality worklist, storage commitment, order reconciliation), F.3.h (technologist exam QC), F.4.b (import/reconciliation), F.4.e (file exchange standards)
- **Notes:** Defines the DICOM service classes — Modality Worklist (MWL) via C-FIND, Modality Performed Procedure Step (MPPS), Storage SOP classes, Storage Commitment, Query/Retrieve. The authoritative spec for how scheduled-workflow integrity actually works on the wire. The full service-class catalog and conformance requirements live here.

### [S02] DICOM Standard PS3.14 — Grayscale Standard Display Function (GSDF)
- **URL:** https://dicom.nema.org/medical/dicom/current/output/html/part14.html
- **Publisher:** NEMA
- **Retrieved:** 2026-05-04
- **Edition:** 2025d (current)
- **Covers TCO subcategories:** F.2.c (display devices)
- **Notes:** The mathematical model that lets diagnostic monitors render grayscale consistently across vendors. Based on Barten's contrast-sensitivity model; defined over a luminance range of 0.05–4000 cd/m². The reason all medical-grade displays look "the same" — they're calibrated to GSDF. Foundation reading for any display-QA discussion.

### [S03] DICOM Standard PS3.1 — Introduction and Overview
- **URL:** https://www.dicomstandard.org/standards/view
- **Publisher:** NEMA
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** background framing for all of F.3 and F.4
- **Notes:** Top-of-stack overview document. Useful for the article's introductory framing of what DICOM is and how the multi-part standard is organized (PS3.1–PS3.22).

---

## Primary standards (IHE)

### [S04] IHE Radiology Technical Framework Volume 1 (Integration Profiles)
- **URL:** https://www.ihe.net/uploadedFiles/Documents/Radiology/IHE_RAD_TF_Rev23-0_Vol1_FT_2025-08-08.pdf
- **Publisher:** IHE International, Inc.
- **Retrieved:** 2026-05-04
- **Edition:** Revision 23.0 (August 2025)
- **Covers TCO subcategories:** F.3.j (workflow integrity), F.3.k (workflow optimization), F.4.a (image-exchange policies), F.4.e (file exchange standards)
- **Notes:** The integration-profile catalog for radiology. Profiles relevant to Domain F: SWF (Scheduled Workflow), PIR (Patient Information Reconciliation), KIN (Key Image Note), TCE (Teaching File and Clinical Trial Export), PDI (Portable Data for Imaging). Each profile defines actors, transactions, and required behavior. This is the spec that ties DICOM service classes into operational workflow.

### [S05] IHE Radiology Profiles Index (web)
- **URL:** https://profiles.ihe.net/RAD/index.html
- **Publisher:** IHE International, Inc.
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** quick lookup for any specific profile referenced in the article
- **Notes:** Browsable index of every radiology profile. Each profile has its own page with description, status (Final Text vs Trial Implementation), and supplement download links. Use for citations that link readers to specific profile pages rather than the 600-page TF PDF.

### [S06] IHE Radiology Scheduled Workflow.b (SWF.b) Supplement
- **URL:** https://www.ihe.net/uploadedFiles/Documents/Radiology/IHE_RAD_Suppl_SWF.b_Rev1-7_2019-08-09.pdf
- **Publisher:** IHE International, Inc.
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.h (tech exam QC), F.3.j (data integrity), F.3.i (reporting status flow)
- **Notes:** The most-tested workflow profile in CIIP exam content. Defines the actor chain Order Placer → Order Filler → DSS/OF → Acquisition Modality → Image Manager/Archive. Specifies how status transitions (scheduled → in-progress → completed/discontinued) propagate through the system. Detailed coverage of MWL and MPPS interplay.

### [S07] IHE ITI Cross-Enterprise Document Sharing for Imaging (XDS-I.b)
- **URL:** https://wiki.ihe.net/index.php/Cross-enterprise_Document_Sharing_for_Imaging
- **Publisher:** IHE International, Inc. (wiki maintained by IHE)
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.4.f (cross-enterprise image exchange)
- **Notes:** Extension of the XDS.b document-sharing profile to imaging. Affiliated enterprises (radiology departments, clinics, long-term care, acute care) publish DICOM manifests to a Document Repository; consumers query and retrieve via DIMSE, simple HTTP URL, or SOAP. The reference profile for HIE-style image exchange. Companion: XDS.b (`profiles.ihe.net/ITI/TF/Volume1/ch-10.html`) for the underlying document-sharing semantics.

---

## Display performance and quality assurance

### [S08] AAPM Report 270 — Display Quality Assurance (TG-270)
- **URL:** https://www.aapm.org/pubs/reports/RPT_270.pdf
- **Publisher:** American Association of Physicists in Medicine
- **Retrieved:** 2026-05-04
- **Edition:** Published 2019 (supersedes TG-18 acceptance protocols for LCD/OLED)
- **Covers TCO subcategories:** F.2.c (display devices), F.1.b (environmental factors — ambient light)
- **Notes:** Current reference for display-QA testing in clinical environments. Defines four display classes (diagnostic, modality, clinical specialist, EHR) and acceptance/constancy tests for each. Key concept: ambience ratio AR = L_amb / L_min, recommended < 1/4 to preserve contrast in dark image regions. Addresses ambient light, viewing-distance dependencies, and luminance uniformity.

### [S09] AAPM Practical Application of Report 270 in Display QA
- **URL:** https://www.aapm.org/pubs/reports/detail.asp?docid=203
- **Publisher:** AAPM
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.2.c
- **Notes:** Companion document showing how TG-270 testing is implemented in practice. Useful if the article needs concrete "what does QA actually look like" examples.

---

## Enterprise imaging (HIMSS-SIIM)

### [S10] A Foundation for Enterprise Imaging — HIMSS-SIIM Collaborative White Paper
- **URL:** https://link.springer.com/article/10.1007/s10278-016-9882-0
- **Publisher:** Journal of Imaging Informatics in Medicine (open access)
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.6 (Enterprise Imaging — all sub-items)
- **Notes:** The defining definition of "enterprise imaging" the field uses. Establishes the concept that imaging extends beyond radiology and cardiology into pathology, dermatology, wound care, endoscopy, and visible-light specialties. Foundational citation for the F.6 section.

### [S11] Workflow Challenges of Enterprise Imaging — HIMSS-SIIM White Paper
- **URL:** https://siim.org/resource/workflow-challenges-of-enterprise-imaging-himss-siim-collaborative-white-paper/
- **Publisher:** SIIM / HIMSS
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.k (workflow optimization), F.6 (visible-light specialties), F.4.a (policies and procedures)
- **Notes:** Practical-side companion to the Foundation paper. Catalogs workflow challenges across non-radiology specialties (orders-vs-encounters capture, metadata standardization, identity reconciliation across departments).

### [S12] HIMSS-SIIM Enterprise Imaging Community White Papers — Reflections and Future Directions
- **URL:** https://link.springer.com/article/10.1007/s10278-024-00992-4
- **Publisher:** Journal of Imaging Informatics in Medicine (open access)
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.6 (current state framing); useful for the article's intro
- **Notes:** Recent (2024) overview of the 16-paper white paper series. Useful for citing the "current state" of enterprise imaging and pointing readers to specific topical white papers in the series.

---

## Practice parameters and standards (ACR-AAPM-SIIM)

### [S13] ACR-AAPM-SIIM Practice Parameter for Determinants of Image Quality
- **URL:** https://gravitas.acr.org/PPTS/GetDocumentView?docId=140
- **Publisher:** American College of Radiology / AAPM / SIIM
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.2.c (display), F.3 (workflow — quality dimensions)
- **Notes:** Society-level practice parameter. Sets out the determinants of image quality across acquisition, display, and storage. Useful for definitions and the framing of "image quality" as a measurable property with defined inputs.

### [S14] ACR-AAPM-SIIM Technical Standard for the Electronic Practice of Medical Imaging
- **URL:** https://gravitas.acr.org/PPTS/GetDocumentView?docId=136
- **Publisher:** ACR / AAPM / SIIM
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.2 (HCI), F.3.l (remote interpretations / teleradiology), F.4 (exchange)
- **Notes:** Authoritative reference for teleradiology operational standards — display requirements, network bandwidth, data-integrity expectations, qualification of interpreters across jurisdictions.

---

## Workflow and reporting (RadioGraphics — peer-reviewed)

### [S15] Strategies for Implementing a Standardized Structured Radiology Reporting Program
- **URL:** https://pubs.rsna.org/doi/abs/10.1148/rg.2018180040
- **Publisher:** RSNA / RadioGraphics
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.i (reporting and results communication, structured vs. narrative)
- **Notes:** Implementation-focused review of structured reporting. Splits the challenges into technical (manageable) vs. organizational (the hard part). Cite for the structured-vs-narrative tradeoff discussion in F.3.i.

### [S16] DICOM Structured Reporting
- **URL:** https://pubs.rsna.org/doi/abs/10.1148/rg.243035710
- **Publisher:** RSNA / RadioGraphics
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.i
- **Notes:** Background on DICOM SR as a transport format. Useful for explaining why structured reporting is more than just a template — it's a coded, queryable representation linked to specific images/findings. Pairs with [S01] (DICOM service classes).

### [S17] Informatics Solutions for Driving an Effective and Efficient Radiology Practice
- **URL:** https://pubs.rsna.org/doi/abs/10.1148/rg.2018180037
- **Publisher:** RSNA / RadioGraphics
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.k (workflow optimization)
- **Notes:** Survey of informatics tools for workflow optimization (worklist orchestration, peer-review systems, AI triage). Cite for the workflow-optimization section.

### [S18] How to Create a Great Radiology Report
- **URL:** https://pubs.rsna.org/doi/abs/10.1148/rg.2020200020
- **Publisher:** RSNA / RadioGraphics
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.i
- **Notes:** Practical guidance on report structure, clarity, and clinical utility. Usable as a "what good looks like" reference in the reporting section.

---

## De-identification (technical + regulatory)

### [S19] DICOM Supplement 142 — Clinical Trial De-identification Profiles
- **URL:** https://www.dicomstandard.org/News-dir/ftsup/docs/sups/sup142.pdf
- **Publisher:** NEMA (DICOM Standards Committee, Working Group 18)
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.f (research and clinical trials, de-identification)
- **Notes:** The technical reference for de-identifying DICOM files. Defines named de-identification profiles (e.g., Basic Application Confidentiality Profile) plus optional add-ons that retain specific information needed for trial integrity (longitudinal temporal information, patient characteristics, descriptors, device identification, etc.). For each profile, specifies which DICOM attributes to remove, replace, or preserve. The basis for de-identification tooling like the RSNA Clinical Trial Processor. Companion: Supplement 55 (Attribute Level Confidentiality) and Part 15 Annex E (Attribute Confidentiality Profiles, the codified normative version).

### [S20] HHS Guidance — De-identification of Protected Health Information under the HIPAA Privacy Rule
- **URL:** https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html
- **Publisher:** U.S. Department of Health and Human Services (Office for Civil Rights)
- **Retrieved:** 2026-05-04
- **Covers TCO subcategories:** F.3.f (regulatory framing for research/clinical trial workflows)
- **Notes:** The U.S. regulatory side of the de-identification question. HHS guidance on the two methods recognized under the HIPAA Privacy Rule (45 CFR §164.514(b)): the **Safe Harbor** method (remove a specified list of identifier categories — names, geographic detail finer than state, dates other than year, contact info, account numbers, biometric identifiers, full-face photos, and so on) and the **Expert Determination** method (a qualified statistician documents that re-identification risk is very small). Pairs with [S19]: HHS guidance defines what "de-identified" means in law; DICOM Sup 142 defines how to do it at the DICOM-attribute level.

---

## Coverage gaps to flag before phase 3

1. ~~F.3.f (de-identification)~~ — **filled** by [S19] (DICOM Sup 142, technical) + [S20] (HHS HIPAA guidance, regulatory).
2. **F.5 (retention and deletion policies)** — operational/regulatory topic with no single canonical source. Likely needs HIPAA retention rules + an example state regulation (e.g., NY, CA) or a SIIM/AHIMA practice brief on imaging records retention. Add during phase 3 or note as an explicit "consult-your-counsel" framing.
3. **F.3.b (data compression — lossy vs lossless)** — no dedicated source above. Two options: (a) cite the DICOM Supplement on JPEG-2000 / lossy compression; (b) cite an ACR practice statement on acceptable use of lossy compression for diagnostic imaging. Either works; recommend (b) for the practice-of-medicine framing.
4. **F.1.a (ergonomics)** — covered tangentially by [S08] and [S14] but no ergonomics-specific source. Optional addition: an OSHA computer-workstation guidance page or a SIIM practice paper on reading-room design. Skip if word-count is tight.

## Open questions for user review

1. **Scope of additions** — which of the four gaps above do you want me to fill before phase 3 begins? (Recommend at minimum: F.3.f de-identification and F.3.b compression. F.5 retention can be addressed with a "regulatory varies; consult your records-management team" framing if you'd rather not chase a citation.)
2. **Sufficiency check** — does this 18-source pool feel like the right ballpark for a 3,000-word article? More sources isn't necessarily better — over-citing can signal the writer hasn't synthesized.
3. **Behind-paywall items** — none of the listed sources are paywalled in the standard sense. RadioGraphics articles are free abstracts; full-text access depends on RSNA membership for some. The article will cite them with DOIs; readers without access will at least see the abstract. Acceptable?
