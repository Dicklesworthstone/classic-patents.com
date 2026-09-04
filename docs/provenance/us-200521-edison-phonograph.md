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
| Drawing sheet, printed identity, Figs. 1-4, inventor/attorney execution, witness signatures | PDF p. 1 | Typed drawing-sheet formal matter, selected source-facsimile crops for each cited figure, and a literal ledger transcription of legible formal text. One second handwritten witness signature is visibly present but not readable enough in this scan to expand without guessing. |
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
one explicit marker for each page of the pinned PDF. Page 1 records the printed
drawing-sheet identity, its four figure labels, legible inventor/attorney
execution, and witness formal matter; pages 2 and 3 contain the checked
specification, all four claims, the execution, and witnesses. Page markers belong only to this review
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

Each cited source figure has a local source preview derived from the pinned
first drawing sheet. The preview is a reader aid, never a substitute for the
facsimile:

| Source figure | Active local source sheet |
| --- | --- |
| Fig. 1 | `public/patents/figures/us-200521-edison-phonograph/drawing-sheet-source-v1.png` |
| Fig. 2 | `public/patents/figures/us-200521-edison-phonograph/drawing-sheet-source-v1.png` |
| Fig. 3 | `public/patents/figures/us-200521-edison-phonograph/drawing-sheet-source-v1.png` |
| Fig. 4 | `public/patents/figures/us-200521-edison-phonograph/drawing-sheet-source-v1.png` |

No labels, linework, or reconstructed annotations are added to the active
source-sheet derivative. The edition test requires a local source preview for
every cited figure and checks that every published masthead, source paragraph,
and claim is contained in the reviewed ledger.

## Source-sheet acceptance (2026-09-03)

The historical page-1 layout interleaves Figs. 1 through 4. The legacy
per-figure crops remain preserved under `public/patents/figures/` as research
derivatives, but several include neighbouring figure material and therefore do
not serve as evidence for isolated-figure boundaries.

The active asset is the complete first source sheet:

- Path: `public/patents/figures/us-200521-edison-phonograph/drawing-sheet-source-v1.png`
- Source locator: pinned PDF page 1, full raster rectangle `(x=0, y=0, width=2320, height=3408)`
- Raster dimensions: `2320 x 3408` pixels (upright, 300 DPI rendering)
- SHA-256: `6f4ffdaea7781497dad758b3bcf20d3467e13cc1384c85c17be9a03ae32c51b8`

A separately rendered 300-DPI page-1 comparison yielded zero differing pixels
(ImageMagick absolute error metric `AE=0`). The full sheet visibly retains the
four printed figure labels, each complete depicted mechanism, the patent
identity, and the execution furniture. All eight active Fig. 1 through Fig. 4
citations use that same page-1 source-sheet asset and explicit full-raster
locator. This internal evidence repair does not alter or gate the complete
patent-text reader.

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
