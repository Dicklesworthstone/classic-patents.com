# US 593,138 — Electrical Transformer (Nikola Tesla)

## Primary facsimile

- Canonical catalogue id: `us-593138-tesla-coil`
- Local immutable asset: `public/patents/pdfs/us-593138-tesla-coil.pdf`
- Title sheet: *Electrical Transformer*, Nikola Tesla, No. 593,138, patented November 2, 1897
- Filing/application line: March 20, 1897; serial no. 628,453
- Primary record: <https://patents.google.com/patent/US593138A/en>
- Direct public facsimile record: <https://patentimages.storage.googleapis.com/4e/ec/02/c74192af65fe67/US593138.pdf>
- Retrieval and source inspection: 2026-08-18
- Rights basis: United States patent published in 1897; public domain
- SHA-256: `393b0a9cee0baa191c5cf8fac0f65738b9d77ce5318e74324b4792aaf17ddf44`
- Page count: 4 (two drawing sheets, two specification/claims pages)

## Locator ledger

| Source PDF page | Contents |
| --- | --- |
| 1 | Drawing sheet 1: Figure 1, sending and receiving transformer system |
| 2 | Drawing sheet 2: Figures 2 and 3 |
| 3 | Specification opening through the Figure 1 description |
| 4 | Remaining specification and all four numbered claims |

## Visual-review record

Two complete visual passes were made from 180-DPI rasters rendered directly
from the pinned PDF on 2026-08-18. Pass one established the document identity,
the two drawing sheets, the two specification pages, the printed title and
application line, and the four claims. Pass two checked every authored source
paragraph, figure reference, claim, inventor signature, and witness names
against the same four images. No PDF text layer or OCR output is a public
edition source.

## Reviewed source ledger

| Edition material | Facsimile locator | Review result |
| --- | --- | --- |
| Masthead: office, Tesla, title, patent number, grant date, application date, serial number, no-model line | p. 3, heading | Transcribed as typed masthead lines |
| Figure 1 source-sheet references | p. 1, complete drawing sheet | Complete sheet `source-sheet-1.png`; labels A, B, C, G, H, and K visible |
| Figure 2 source-sheet references | p. 2, complete drawing sheet | Complete sheet `source-sheet-2.png`; the lower conical construction has labels B and C |
| Figure 3 source-sheet references | p. 2, complete drawing sheet | Complete sheet `source-sheet-2.png`; the upper two-secondary construction has labels B, C, L, and M visible |
| Formal address through quarter-wave construction | p. 3, body text | Continuous authored paragraphs, no public scan-page boundary |
| Figure inventory, A/B/C descriptions, transmission arrangement | p. 3 through p. 4 | Every printed Figure 1, 2, and 3 citation is an explicit figure-reference node with its complete source sheet |
| Cone and two-secondary forms, terminal tubes, numerical 925-per-second illustration | p. 4, left column | Continuous authored paragraphs; source quantities retained |
| Insulation advantages, spark-over rationale, flat-spiral prior-art disclaimer | p. 4, lower columns | Continuous authored paragraphs; the disclaimer precedes the claim heading |
| Claims 1–4 | p. 4, right column, lines 68–98 | Four independent claim nodes; typed canonical claim text is synchronized to them |
| Signature and witnesses | p. 4, lower right | Nikola Tesla; witnesses M. Lawson Dyer and G. W. Martling |

## Identity correction

The earlier `us-533367-tesla-coil` catalogue id was an identity collision.
US 533,367 is a different patent, *Spray attachment for nozzles*, and is not a
Tesla transformer patent. Its misleadingly named local four-page file was
visually checked before this correction; its own title sheet identifies it as
Tesla's US 593,138. That existing file and its legacy text artifacts are
retained untouched for forensic traceability. The canonical PDF above is an
additive byte-identical copy under the correct id.

## Editorial boundary

The complete visitor-facing source reading is the typed manual React edition
`teslaCoil593138ArchivalEdition`, bound only to the canonical
`us-593138-tesla-coil` record. Its paragraph companions are patent-local as
`teslaCoil593138ParallelReadings`; shared registry integration remains a root
responsibility. The legacy US 533,367 assets are neither cited nor used as a
source for this edition. The source PDF is immutable; the local source sheets
and preserved historical crop assets are facsimile derivatives, not redrawings
or generated diagrams.

## Source-sheet acceptance (2026-09-03)

The two source drawing sheets were visually reviewed at 300 DPI against the
pinned four-page PDF. Page 1 is the complete Fig. 1 transmission and receiving
transformer diagram. Page 2 is the complete shared sheet for Figs. 2 and 3:
the conical winding form and the two-secondary construction are both labeled,
legible, and visible in their original page context.

The previously active individual crops are retained in
`public/patents/figures/us-593138-tesla-coil/` for audit and comparison. They
are not used as active acceptance evidence because their narrow boundaries
separate neighboring historic drawing matter or source-sheet furniture. No
file was deleted or overwritten.

The active assets are direct, unmodified 300-DPI Poppler renderings of the
pinned source pages: `source-sheet-1.png` (PDF page 1) is 2320 x 3408 pixels
with SHA-256
`1cd9e455b7277744b52865ac27aba4b43180494bb608c2c33d69c59bc371004a`,
and `source-sheet-2.png` (PDF page 2) is 2320 x 3408 pixels with SHA-256
`a7112e2d25055cb226c93504977020e5322e68005a61744b6506e3bb282b49d7`.
A fresh page render compares with absolute error 0. Neither active asset
contains masking, compositing, reconstruction, added labels, or an asserted
artificial crop boundary. All eleven active figure-reference occurrences carry
an exact full-page source rectangle `(x=0, y=0, width=2320, height=3408)` in
`figureOccurrenceSourceLocators.ts`.

This evidence improves the internal archival audit only. It does not alter or
condition visitor delivery of the complete source edition, reviewed ledger, or
pinned facsimile.
