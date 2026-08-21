# Provenance receipt: US 3,541,541, Douglas C. Engelbart

## Source identity

- Catalogue id: `us-3541541-engelbart-mouse`
- Granted title: *X-Y Position Indicator for a Display System*
- Inventor as printed: Douglas C. Engelbart, Palo Alto, California
- Assignee as printed: Stanford Research Institute, Menlo Park, California
- Grant date: 1970-11-17
- Filing date: 1967-06-21; Serial No. 647,872
- Primary public record: https://patents.google.com/patent/US3541541A/en
- Local immutable facsimile: `public/patents/pdfs/us-3541541-engelbart-mouse.pdf`
- Retrieval and full-facsimile review date: 2026-08-18
- Rights basis: a United States patent grant; its historical text and drawings are public-domain United States Government material.
- SHA-256: `2a01a32bc3d4c3eec1745dd77fcb92f1404e02844c640c9c10a451ed3b5791e0`
- PDF page count: 7

## Facsimile map

| PDF page | Checked material |
| --- | --- |
| 1 | Drawing sheet 1 of 3: Figures 1, 2, and 3; filed and inventor/attorney lines. |
| 2 | Drawing sheet 2 of 3: Figures 4, 5, and 6. |
| 3 | Drawing sheet 3 of 3: Figure 7. |
| 4 | Patent-office masthead, abstract, background, summary, drawing list, and opening preferred embodiment. |
| 5 | Housing, wheel, potentiometer, analog and absolute-encoder descriptions. |
| 6 | Incremental encoder descriptions, usage and mechanical-construction paragraphs, Claim 1. |
| 7 | Claims 2 through 8, cited patents, and examiner lines. |

## Editorial and preservation boundaries

- `src/data/editions/engelbartMouseEdition.ts` is the hand-authored continuous source face; it contains explicitly authored blocks, figure references, and term annotations. It does not render OCR, HTML, Markdown, or a text layer.
- Local source crops live in `public/patents/figures/us-3541541-engelbart-mouse/` and are derived from the three pinned drawing sheets.
- The older `public/patents/transcripts/us-3541541-engelbart-mouse.txt` remains research evidence only and is not exported as the reviewed transcription.
- The source prints eight claims. The canonical record reads those claim strings from the edition to prevent drift.

## Source erratum and figure-crop publication hold

The page-5 source paragraph is preserved literally. It says that the readout
scheme of `FIG. 6` has the digital-output advantage, then says “In the readout
circuit of FIG. 5, a disc 100 is provided.” Disc 100 is the incremental-encoder
disc drawn in `FIG. 6`, not the shaft-encoder disc 80 drawn in `FIG. 5`. The
edition therefore keeps the printed `FIG. 5` occurrence, but its authored
reference label discloses the source inconsistency and its hover preview shows
both the Fig. 5 and Fig. 6 source crops. This is an editorial disclosure, not a
silent correction of the grant.

The archival edition and reviewed-transcription asset remain withheld from the
canonical record pending root review of the replacement crops. Existing PDFs,
ledger, edition, and crop files are preserved. No crop is deleted or repointed
as part of this erratum repair.

The failed source crops are queued for cloud visual inspection of the complete
three drawing sheets. The next version must be created from the pinned PDF at
the source raster's native pixel dimensions, upright, with the complete printed
figure label and reference numerals retained, and with filing headers,
inventor/attorney signatures, and neighboring drawing material excluded.
Exact `(left, top, width, height)` source-pixel rectangles are intentionally
not guessed in this receipt: the cloud inspection must return those rectangles
against the actual source-sheet raster before any new PNG is created or any
reference is repointed.

| Figure | PDF drawing page | Current preserved crop | Planned replacement | Crop gate |
| --- | ---: | --- | --- | --- |
| Fig. 1 | 1 | `fig-1-source-crop-v2.png` | `fig-1-source-crop-v3.png` | One upright source-pixel crop of the pictorial display system; retain `FIG. 1` and numerals; exclude filing header and inventor/attorney lines. |
| Fig. 2 | 1 | `fig-2-source-crop-v4.png` | none | Accepted; do not alter until root review requests a new source comparison. |
| Fig. 3 | 1 | `fig-3-source-crop-v2.png` | `fig-3-source-crop-v3.png` | One upright source-pixel crop of the sectional plan; retain `FIG. 3` and all printed numerals; exclude filing header and signatures. |
| Fig. 4 | 2 | `fig-4-source-crop-v2.png` | `fig-4-source-crop-v3.png` | One upright source-pixel crop of the potentiometer schematic; retain `FIG. 4`, terminals, and numerals; exclude sheet header and signatures. |
| Fig. 5 | 2 | `fig-5-source-crop-v2.png` | none | Accepted; retain as the shaft-encoder preview and pair with Fig. 6 only at the disclosed page-5 erratum occurrence. |
| Fig. 6 | 2 | `fig-6-source-crop-v2.png` | `fig-6-source-crop-v3.png` | One upright source-pixel crop of the incremental-encoder circuit; retain `FIG. 6`, disc 100, contacts, sensors, and circuit numerals; exclude sheet header and signatures. |
| Fig. 7 | 3 | `fig-7-source-crop-v1.png` | `fig-7-source-crop-v2.png` | One upright source-pixel crop of the second incremental-encoder circuit; retain `FIG. 7`, labels, and numerals; exclude filing header and inventor/attorney lines. |

The companion edition test records the same pending replacement versions and
asserts that the legacy references remain in place until those files exist.
Publication stays withheld until a root reviewer accepts the new crops and the
full source-face gate is reopened.
