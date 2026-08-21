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
- Each figure reference in the edition points to a local crop in `public/patents/figures/us-48475-yale-lock/` taken from the pinned drawing sheet. The directory contains one versioned preview for every printed figure, 1 through 20; the current v1 crops remain held pending independent crop-fidelity acceptance.
- `public/patents/transcripts/us-48475-yale-lock-reviewed.txt` is the review ledger for this edition. It records all four facsimile pages with page markers, while the visitor-facing React edition deliberately remains continuous.
- The source contains five printed claims. The manual edition preserves all five claims verbatim, dynamically referenced by `manualYaleClaimText`; no claim is summarized or omitted.
- The existing `*-source-crop-v1.png` files are preserved but remain rejected research assets pending cloud Luna visual acceptance of upright isolation, complete labels, and source-sheet boundaries. The edition contract fails closed until versioned v2 previews replace every served v1 reference.
