# US 588 — John Ericsson, “Screw-Propeller for Vessels”

## Facsimile receipt

- **Pinned local facsimile:** `public/patents/pdfs/us-588-ericsson-propeller.pdf`
- **Primary public record:** <https://patents.google.com/patent/US588/en>
- **Retrieved / reviewed:** 2026-08-17
- **Rights basis:** United States Patent No. 588 was granted on 1 February 1838. Its patent specification and drawings are public-domain United States government records.
- **SHA-256:** `40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a`
- **PDF pages:** 5
- **Filing date:** Not documented by the reviewed grant or the cited primary
  public record. The catalogue records this as `null`; it does not reuse the
  1 February 1838 grant date as a fabricated filing date.
- **Editorial method:** direct visual reading of the pinned five-page PDF. The published continuous edition is explicit typed nodes in `src/data/editions/ericssonPropellerEdition.ts`; no OCR or PDF text layer is its source.

## Page-level locators

| Material | PDF locator | Use in edition |
| --- | --- | --- |
| Drawing sheet 1, Figures 1–2 | PDF p. 1, “Sheet 1, 2 Sheets” | Figure-sheet record; explicit Figure 1 and Figure 2 references; reviewed-transcription ledger page 1 |
| Drawing sheet 2, Figures 3–6 | PDF p. 2, “Sheet 2, 2 Sheets” | Figure-sheet record; explicit Figure 3–6 references; reviewed-transcription ledger page 2 |
| Masthead and opening specification | PDF p. 3, lines 1–110 | Masthead and first construction paragraphs; reviewed-transcription ledger page 3 |
| Figure 3, drawing No. 2, installation description | PDF p. 4, lines 1–130 | Figure 3–6 and removable-installation paragraphs; reviewed-transcription ledger page 4 |
| Motion recommendation, disclaimer, claims, signature, witnesses | PDF p. 5, lines 1–68 | Claims 1–3, J. Ericsson signature, Curley and Marquette witnesses; reviewed-transcription ledger page 5 |

## Editorial boundary

`public/patents/transcripts/us-588-ericsson-propeller-reviewed.txt` is the accountable five-page review ledger for the continuous edition. It is pinned in the catalogue as a `reviewed-transcription`, names its reviewer and review date, and carries the source PDF digest above. It records page coverage without imposing source-sheet breaks on the visitor-facing React edition.

The local `public/patents/source-text/us-588-ericsson-propeller.txt` is retained as a legacy comparison artifact and is not used by the manually prepared Original Patent Text face. It is neither a source for the edition nor evidence of completeness.

## Figure-preview receipt

The Original Patent Text face uses six individually authored source crops rather
than sending every figure reference to a whole drawing sheet:

- `public/patents/figures/us-588-ericsson-propeller/fig-1-source-crop-v1.png`
  and `fig-2-source-crop-v1.png` are cropped from PDF p. 1.
- `fig-3-source-crop-v1.png` through `fig-6-source-crop-v1.png` are cropped
  from PDF p. 2.

Each crop was checked visually against its printed figure label before it was
bound to the matching typed figure reference. The two
`source-sheet-*-source-crop-v1.png` files in the same directory are retained
as source-review renders of the two drawing sheets; they are provenance
evidence, not visitor-facing previews.
