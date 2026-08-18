# US 200,521 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-200521-edison-phonograph`
- Local immutable facsimile: `public/patents/pdfs/us-200521-edison-phonograph.pdf`
- Stable public record: https://patents.google.com/patent/US200521A/en
- Retrieved for this edition: 2026-08-18
- SHA-256: `6ed4354f12dc944b49ac2a2a3dd8d0aaa3f263d0c5f2017b2237a37ffde00ccd`
- PDF pages: 3
- Rights basis: United States Patent No. 200,521 was granted in 1878. Its
  historical patent text and drawings are public-domain material in the United
  States. This receipt makes no claim to rights in a third-party scan's
  presentation or metadata.

## What the pinned PDF contains

The facsimile is a three-page United States Patent Office document for Thomas
A. Edison, *Improvement in Phonograph or Speaking Machines*. Its drawing sheet
contains Figs. 1, 2, 3, and 4. The specification and all four printed claims
occupy PDF pages 2 and 3.

| Material | Exact PDF locator | Editorial treatment |
| --- | --- | --- |
| Drawing sheet, Figs. 1-4 | PDF p. 1 | Figure-sheet node with selected source-facsimile crops for each cited figure |
| Masthead through cylinder recording and playback description | PDF p. 2 | Explicit masthead and ordered, authored source-paragraph nodes |
| Detachable record, stereotyping, spiral plate, strip, thread/ink alternatives, Claims 1-4, execution, witnesses | PDF p. 3 | Explicit ordered source-paragraph, figure-reference, claim, execution, and witness nodes |

## Editorial boundary and review ledger

The public Original Patent Text is
`edisonPhonographArchivalEdition` in
`src/data/editions/edisonPhonographEdition.ts`. It is a manually authored,
continuous semantic edition pinned to the digest above. It is not rendered from
OCR, generated HTML, a PDF text layer, or a formatter's paragraph guesses.

The independently reviewable text ledger is
`public/patents/transcripts/us-200521-edison-phonograph-reviewed.txt`. It has
one explicit marker for each page of the pinned PDF. Page 1 records the drawing
sheet identity; pages 2 and 3 contain the checked specification, all four
claims, the execution, and witnesses. Page markers belong only to this review
artifact. The visitor-facing edition remains a continuous document and does
not impose scan-page breaks on the reading experience.

The legacy raw text-layer and OCR research artifacts at
`public/patents/source-text/us-200521-edison-phonograph.txt` and
`public/patents/transcripts/us-200521-edison-phonograph.txt` are retained for
comparison. They are not editorial authorities and are not served as the
complete visitor-facing text.

## Claims and figure-crop receipt

The edition has four typed claim nodes. The canonical record repeats the exact
printed wording from those nodes: Claim 1 covers the stated record-and-recover
method; Claim 2 the diaphragm and yielding moving surface; Claim 3 the traced
record and connected diaphragm; and Claim 4 the helically grooved, advancing
cylinder arrangement. The edition test verifies both the claim sequence and
textual equality with the canonical record.

Each cited source figure has a local crop derived from the pinned first drawing
sheet. The crop is a reader aid, never a substitute for the facsimile:

| Source figure | Local selected crop |
| --- | --- |
| Fig. 1 | `public/patents/figures/us-200521-edison-phonograph-fig-1-source-crop.png` |
| Fig. 2 | `public/patents/figures/us-200521-edison-phonograph-fig-2-tight-source-crop.png` |
| Fig. 3 | `public/patents/figures/us-200521-edison-phonograph-fig-3-source-crop.png` |
| Fig. 4 | `public/patents/figures/us-200521-edison-phonograph-fig-4-source-crop.png` |

No labels, linework, or reconstructed annotations are added to these image
derivatives. The edition test requires a local crop for every cited figure and
checks that every published masthead, source paragraph, and claim is contained
in the reviewed ledger.

## Secondary check and limits

Google Patents was used only as a secondary transcription and identity
cross-check for US200521A. The pinned local PDF, its SHA-256 digest, and direct
facsimile review govern the public edition. The historical-context material is
limited to what this source documents, except for one identified prior-art
comparison. The Library of Congress's National Recording Preservation Plan
timeline says that Édouard-Léon Scott de Martinville's 1857 phonautograph
traced sound waves but could not play them back:
https://www.loc.gov/programs/national-recording-preservation-plan/tools-and-resources/historical-background/timeline/
retrieved 2026-08-18. This record does not represent a court ruling,
commercial outcome, or priority claim that has not been separately sourced.
