# Provenance receipt: US 48,475, Linus Yale, Jr.

## Source identity

- Catalogue id: `us-48475-yale-lock`
- Granted title: *Improvement in Locks*
- Inventors as printed: Linus Yale, Jr., of Shelburne Falls, Massachusetts
- Grant date: 1865-06-27
- Filing date: null (primary grant document states: `Specification forming part of Letters Patent No. 48,475, dated June 27, 1865.`)
- Primary public record: https://patents.google.com/patent/US48475A/en
- Local immutable facsimile: `public/patents/pdfs/us-48475-yale-lock.pdf`
- Retrieval and full-facsimile review date: 2026-08-19
- Rights basis: a United States patent granted in 1865; its historical text and drawings are public-domain United States Government material.
- SHA-256: `8426b35afe9957149ea2f87629cb37c9519409799ddbb578947e23d3d0fa0250`
- PDF page count: 4

## Facsimile map and comparison record

The pinned four-page PDF was visually reviewed at 300 DPI. The public source face is deliberately continuous, so it does not impose these scan-page breaks on a reader. They are retained here to make the editorial comparison reproducible.

| Facsimile locator | Content checked |
| --- | --- |
| PDF p. 1 | Drawing sheet headed `No. 48,475`, `L. YALE, Jr.`, `LOCK.`, and `Patented June 27, 1865.`; printed figure labels 1 through 20 and the drawing's reference letters; witness/inventor matter retained in the ledger below the sheet. |
| PDF p. 2 | Patent Office masthead (`UNITED STATES PATENT OFFICE. LINUS YALE, JR., OF SHELBURNE FALLS, MASSACHUSETTS. IMPROVEMENT IN LOCKS. Specification forming part of Letters Patent No. 48,475, dated June 27, 1865.`); statement of invention; list of figures 1 through 20; bolt retention plate F with screw G; mortise case A with threaded nut O; modular right/left hand cylinder adaptation for varying door thicknesses. |
| PDF p. 3 | Eccentric cylinder plug D; pin chambers r, r'; two-piece tumblers I and J with helical springs L; flat bitted steel key K; narrow slot-like keyway t; notched/racked anti-picking pin grooves; circumferential ring recess s and longitudinal entry groove t on plug; cam lazy-arm E with stop knobs v; bolt-talon interaction and limited angular throw. |
| PDF p. 4 | Continuation of lazy-arm functions; formal claim preamble (`I claim as my invention—`); claims 1 through 5 complete; inventor signature line `LINUS YALE, JR.`; witnesses Arthur Maxwell and Henry Winn. |

## Editorial and preservation boundaries

- `src/data/editions/yaleLockEdition.ts` is the complete visitor-facing source face. Its prose, claims, glossary annotations, and figure references are individually authored typed React nodes. It does not render OCR, a PDF text layer, generated HTML, or a page-by-page scan transcription.
- Each active figure reference in the edition points to the intact, direct-rendered PDF-page-1 source sheet at `public/patents/figures/us-48475-yale-lock/source-sheet-1-v1.png`. It does not infer separate figure boundaries from the historic one-sheet layout.
- `public/patents/transcripts/us-48475-yale-lock-reviewed.txt` is the review ledger for this edition. It records all four facsimile pages with page markers, while the visitor-facing React edition deliberately remains continuous.
- The source contains five printed claims. The manual edition preserves all five claims verbatim, dynamically referenced by `manualYaleClaimText`; no claim is summarized or omitted.
- The existing `fig-*-source-crop-v1.png` files are preserved as legacy research assets. They are no longer served as archival citation evidence, and no internal review status may suppress the complete source reader.

## Source-sheet acceptance 2026-09-03

The pinned four-page PDF was visually inspected in full at 300 DPI on
2026-09-03. PDF page 1 is the sole drawing sheet: its header identifies No.
48,475, L. Yale, Jr., the lock, and the June 27, 1865 patent date, while the
sheet visibly carries Figs. 1 through 20. Pages 2 through 4 contain the
specification and claims, not additional drawing sheets.

- Active asset: `/patents/figures/us-48475-yale-lock/source-sheet-1-v1.png`
- Derivation: direct, unmodified 300-DPI rendering of pinned PDF p. 1
- Raster: 2320 × 3408 pixels; full source rectangle `(0, 0, 2320, 3408)`
- SHA-256: `a4927cabec8906a14f8de33cfd7a39cb8d2083fdba6dae51eb5f971cfb68a938`
- Source PDF SHA-256: `8426b35afe9957149ea2f87629cb37c9519409799ddbb578947e23d3d0fa0250`
- Reviewer and method: Classic Patents editorial agent (GPT-5.6), direct
  source-pixel review against all four pinned PDF pages. No OCR was run.

All 30 active authored figure-reference occurrences name this one accepted
source asset and PDF page:

| Edition block | Active occurrence keys | Source PDF page |
| --- | --- | --- |
| Drawing-sheet block 1 | `edition-block-1-group-0-inline-1` | 1 |
| Figure-description block 3 | `edition-block-3-group-0-inline-1`, `edition-block-3-group-0-inline-3`, `edition-block-3-group-0-inline-5`, `edition-block-3-group-0-inline-7`, `edition-block-3-group-0-inline-9`, `edition-block-3-group-0-inline-11`, `edition-block-3-group-0-inline-13`, `edition-block-3-group-0-inline-15`, `edition-block-3-group-0-inline-17`, `edition-block-3-group-0-inline-19`, `edition-block-3-group-0-inline-21`, `edition-block-3-group-0-inline-23`, `edition-block-3-group-0-inline-25`, `edition-block-3-group-0-inline-27`, `edition-block-3-group-0-inline-29`, `edition-block-3-group-0-inline-31`, `edition-block-3-group-0-inline-33` | 1 |
| Mechanism blocks 6–13 | `edition-block-6-group-0-inline-3`, `edition-block-6-group-0-inline-5`, `edition-block-7-group-0-inline-3`, `edition-block-7-group-0-inline-5`, `edition-block-8-group-0-inline-7`, `edition-block-8-group-0-inline-13`, `edition-block-9-group-0-inline-1`, `edition-block-9-group-0-inline-3`, `edition-block-10-group-0-inline-1`, `edition-block-12-group-0-inline-1`, `edition-block-12-group-0-inline-3`, `edition-block-13-group-0-inline-1` | 1 |
