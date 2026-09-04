# US 194,047 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-194047-otto-engine`
- Local immutable facsimile: `public/patents/pdfs/us-194047-otto-engine.pdf`
- Stable public record: https://patents.google.com/patent/US194047A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `ad6cfd50e5aaca4dbf9dcb594eb53dc1e619339314f50fdd49a6b4f34eb30baf`
- PDF pages: 8
- Rights basis: United States Patent No. 194,047 was granted in 1877. Its
  historical patent text and drawings are public-domain material in the United
  States. This receipt makes no claim to rights in a third-party scan
  presentation or metadata.

## Direct facsimile review

The pinned document has eight source pages. Pages 1 through 4 are the four
printed drawing sheets. Pages 5 through 8 contain the Patent Office masthead,
full specification, six printed claims, execution, and witnesses. The edition
was checked by rendering and visually reading every page. The pre-existing
source-text layer and a Poppler text extraction were comparison aids only; they
were not accepted as publication text without facsimile review.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| pp. 1-4 | Drawing sheets: Figs. 1-13 | Direct visual review; one direct local crop for each printed figure |
| p. 5 | Masthead, inventor statement, staged-charge principle, Fig. 1 operation | Direct visual review and manual transcription |
| p. 6 | Gradual-combustion rationale, principal engine, timing, Figs. 2-8 | Direct visual review and manual transcription |
| p. 7 | Gas-slide passages, Figs. 9-13, ignition, exhaust, governor, disclaimer | Direct visual review and manual transcription |
| p. 8 | All six claims, execution, inventor signature, witnesses | Direct visual review and manual transcription |

## Corrected source facts

The previous public record substituted a generic modern four-stroke narrative
for the historic specification. It gave the wrong application date
(`1877-03-24` rather than `1876-07-13`), reduced six printed claims to two,
and introduced unsourced pressures, dimensions, materials, performance
figures, and a broad claim to a generic four-stroke cycle.

The facsimile instead describes an air charge admitted first and a combustible
gas-or-vapor mixture admitted behind it. It claims a spatial concentration
gradient: combustible particles are close together at ignition and become
increasingly dispersed through the air charge toward the piston. Otto says
that arrangement makes heat development and pressure increase gradual. The
four-stroke operation, governor-controlled fuel slide, and named valve-gear
combination are each separately claimed. The source also expressly says it does
not claim generally the separate introduction of combustible gas and air,
citing English Patents No. 1,655 of 1857 and 335 of 1860.

The source masthead identifies `NICOLAUS A. OTTO, OF DEUTZ, GERMANY`; the
signature reads `NICOLAUS AUGUST OTTO`. The source shows a June 1, 1876
execution date, July 13, 1876 filing date, and August 14, 1877 grant date.
Those dates are distinct and preserved as such.

## Published edition, ledger, and figure crops

`ottoEngineArchivalEdition` in
`src/data/editions/ottoEngineEdition.ts` is an explicit, manually authored
React/TypeScript edition. It is a continuous reading document. It does not
parse OCR, treat transcript text as markup, infer figure references, or show
scan-page numbers to visitors.

`public/patents/transcripts/us-194047-otto-engine-reviewed.txt` is the
separate page-marked review ledger. Its markers prove ordered source-page
coverage to the test suite but are not rendered into the visitor’s reading
experience. The older source-text layer remains research evidence, not the
public complete-source edition.

| Source figure | Active complete primary source sheet |
| --- | --- |
| Figs. 1 and 4 | `source-sheet-1-v1.png` (PDF page 1) |
| Fig. 2 | `source-sheet-2-v1.png` (PDF page 2) |
| Fig. 3 | `source-sheet-3-v1.png` (PDF page 3) |
| Figs. 5-13 | `source-sheet-4-v1.png` (PDF page 4) |

The active sheets are unmodified 300 DPI renders of the pinned drawing pages;
older isolated crop files remain preserved research evidence.

## Complete source-sheet acceptance — 2026-09-04

Direct visual review confirmed the four original drawing sheets and all
thirteen printed figures. The active 2320 × 3408 sheets have SHA-256 digests:

- Sheet 1: `b41b87e739ff73106de51ab86c128167f233441b1891b06f08b5b8fdfbca72f4`
- Sheet 2: `e82e41b38499cf1ead14f3b5bc0f0bfecffce9411d32de2c416375328bef8a10`
- Sheet 3: `89fed96914f5a2d227c77545e997a70bb28cb74548a2ad51b6455073e59414da`
- Sheet 4: `5f8d940362db576c0b5c971f92cd550ed63284e4857d365568fb9fd9c6c993b8`

All 41 authored figure-reference occurrences are bound to their source page
in `figureOccurrenceSourceLocators.ts`.

## Review boundary

Google Patents was used only as a secondary identity cross-check. The pinned
local PDF, its digest, and direct visual comparison are the authority for the
edition. A passing source-ledger, focused-test, or build check proves the
stated software and textual relationships; it is not a substitute for a fresh
editorial review against the primary facsimile and the deployed Wright-quality
reference.
