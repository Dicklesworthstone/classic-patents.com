# US 36,836: provenance receipt

## Pinned source

- Catalogue id: `us-36836-gatling-gun`
- Granted title: *Improvement in Revolving Battery-Guns*
- Inventor printed in the specification: Richard J. Gatling, of Indianapolis, Indiana
- Public record: <https://patents.google.com/patent/US36836A/en>
- Source retrieval: 2026-08-17
- Local immutable facsimile: `public/patents/pdfs/us-36836-gatling-gun.pdf`
- SHA-256: `1eb10666b48d84d2e2be3e09168c6f4f224e531428f7f7c39fdf70ff60d0683f`
- Page count: 3 PDF sheets
- Rights basis: a United States patent granted in 1862. Its patent term has expired; the historical specification and drawings are public-domain source material in the United States.

## What was checked directly against the facsimile

The published continuous edition in `src/data/editions/gatlingGunEdition.ts` was prepared by visual comparison with the complete local PDF, not by publishing an OCR or PDF text layer. The PDF is retained unchanged.

| Material | PDF locator | Edition treatment |
| --- | --- | --- |
| Signed drawing sheet, title, and Figures 1–7 | PDF sheet 1 | Complete 300 DPI primary source sheet; explicit figure-reference nodes in the description and figure-sheet node; reviewed-transcription ledger page 1 |
| Patent-office masthead, inventor/title, formal notice | PDF sheet 2, top | Authored masthead and opening paragraphs; reviewed-transcription ledger page 2 |
| Figure descriptions | PDF sheet 2, left column, opening paragraph | Explicit links to Figures 1–7 |
| Construction of barrels, carrier, lock-cylinder, ring P | PDF sheet 2, both columns | Consecutive authored paragraphs with period terms annotated where needed |
| Disk I, swell O, shafts, loading/firing sequence, disclaimer | PDF sheet 3, both columns above claims | Consecutive authored paragraphs; reviewed-transcription ledger page 3 |
| Claims 1–5 | PDF sheet 3, right column below “What I do claim” | Five exact typed claim nodes, matching typed decoders, and reviewed-transcription ledger page 3 |
| Signature and witnesses | PDF sheet 3, lower right | Authored closing nodes: Richard J. Gatling; A. F. Mathew; W. O. Rockwood |

## Editorial boundary

`public/patents/transcripts/us-36836-gatling-gun-reviewed.txt` is the accountable three-page review ledger for the continuous edition. It is pinned in the catalogue as a `reviewed-transcription`, names its reviewer and review date, and carries the source PDF digest above. It records the page coverage without imposing source-sheet breaks on the visitor-facing React edition.

`public/patents/source-text/us-36836-gatling-gun.txt` and `public/patents/transcripts/us-36836-gatling-gun.txt` are retained comparison layers. They are not the published manual edition and must not be used as evidence of source accuracy. The complete visitor-facing source reading is represented only by the explicitly typed `manual-react-edition` nodes.

## Complete source-sheet acceptance — 2026-09-04

`public/patents/figures/us-36836-gatling-gun/source-sheet-1-v1.png` is the
complete upright 2320 × 3408 pixel render of pinned PDF page 1. Direct visual
review confirmed the signed title sheet and every printed figure—1 through 7.
Its SHA-256 is
`991fa201957e5a571044f89e47342f3b3b645a7c381026619da25be9c003facd`.
All 21 authored figure-reference occurrences are bound to that full source
sheet with page-1 locators in `figureOccurrenceSourceLocators.ts`. Older
isolated previews remain preserved research assets; they are not the active
archival evidence.
