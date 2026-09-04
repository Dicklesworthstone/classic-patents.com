# US 6,162 — Corliss steam-engine valve gear: source receipt

- Catalogue id: `us-6162-corliss-steam-engine`
- Local immutable facsimile: `public/patents/pdfs/us-6162-corliss-steam-engine.pdf`
- Primary public record: [Google Patents, US6162A](https://patents.google.com/patent/US6162A/en)
- Retrieved and directly compared: 2026-08-17
- SHA-256: `22a03c717ed383165143af5aa3b85c8dac0705eaa4cdadcf93130ba28ef76ff5`
- PDF page count: 8
- Filing date: Not documented by the reviewed grant or the cited primary
  public record. The catalogue records this as `null`; it does not reuse the
  10 March 1849 grant date as a fabricated filing date.
- Rights basis: United States patent specification issued in 1849. The local
  facsimile is preserved as the source record; this receipt makes no separate
  legal clearance finding for any third-party scan presentation.

## Facsimile map

| PDF pages | Material checked | Edition treatment |
| --- | --- | --- |
| 1 | Drawing sheet 1: Fig. 1, side elevation | `FIG. 1` sheet record and active complete source-sheet preview |
| 2 | Drawing sheet 2: Fig. 2, longitudinal vertical section | `FIG. 2` sheet record and active complete source-sheet preview |
| 3 | Drawing sheet 3: Figs. 3, 6, and 7 | sheet record and active complete source-sheet previews for those citations |
| 4 | Drawing sheet 4: Figs. 4, 5, 8, and 9 | sheet record and active complete source-sheet previews for those citations |
| 5 | Masthead, reissue notice, opening, figure key, frame and valve-motion description | authored masthead and continuous paragraphs |
| 6 | Continuation of frame construction; exhaust and admission valve linkage | continuous paragraphs |
| 7 | Catch, weighted closing lever, air-cylinder cushion, governor cams, claim 1 opening | continuous paragraphs and Claim 1 node |
| 8 | Claim 1 conclusion, Claim 2, Corliss signature, witnesses, `[FIRST PRINTED 1913.]` | Claim 1 and Claim 2 nodes; execution notice |

## Editorial boundary

The public archival face is `src/data/editions/corlissSteamEngineEdition.ts`:
an explicit typed node sequence prepared from direct visual comparison of all
eight PDF pages. `public/patents/source-text/us-6162-corliss-steam-engine.txt`
is retained only as a non-authoritative OCR comparison artifact. It was not
used as public edition input or as completeness proof.

## Source-sheet acceptance (2026-09-03)

The complete pinned facsimile was visually reviewed page by page. The active
preview for every source-face figure occurrence is a direct, unmodified 300 DPI
render of its complete drawing sheet. No crop boundary, rotation, masking,
reconstruction, compositing, or OCR is used. Every render is 2320×3408 pixels;
the accepted asset has zero absolute pixel error against its own full-sheet
source rectangle.

| PDF page / printed content | Active asset | SHA-256 |
| --- | --- | --- |
| 1 / Fig. 1 | `/patents/figures/us-6162-corliss-steam-engine/source-sheet-1-v1.png` | `faa48a280c5b0b6fa42bf2f8405e9e8ff2b61fc4a17eecb54563866823453314` |
| 2 / Fig. 2 | `/patents/figures/us-6162-corliss-steam-engine/source-sheet-2-v1.png` | `3aefd2beed1a3edf5a28e72f842a65678ae8616f459a66b7bbfc5b0d6087497d` |
| 3 / Figs. 3, 6, and 7 | `/patents/figures/us-6162-corliss-steam-engine/source-sheet-3-v1.png` | `718dc57628f1822b406ee44bb1f532fc674c920de255f679b415bccd2ec5ac61` |
| 4 / Figs. 4, 5, 8, and 9 | `/patents/figures/us-6162-corliss-steam-engine/source-sheet-4-v1.png` | `05719997036b5507a4396b1f6e89ea2dd3470d682cfe45c96154ef0c3be40f9f` |

The exact active edition occurrences are: `edition-block-7-group-0-inline-0`
(Figure 1, PDF page 1); `edition-block-7-group-0-inline-2` (Fig. 2, page 2);
`edition-block-7-group-0-inline-4` (Fig. 3, page 3);
`edition-block-7-group-0-inline-6` (Fig. 4, page 4);
`edition-block-7-group-0-inline-8` (Fig. 5, page 4);
`edition-block-7-group-0-inline-10` (Figs. 6 and 7, page 3); and
`edition-block-20-group-0-inline-1` (Figs. 8 and 9, page 4). Each occurrence
has an explicit full-sheet `(0, 0, 2320, 3408)` source rectangle and a matching
locator in `src/data/editions/figureOccurrenceSourceLocators.ts`.

The earlier named previews remain preserved untouched, including
`us-6162-corliss-steam-engine-fig-1-source-crop-v2.png`,
`us-6162-corliss-steam-engine-fig-2-preview.png`,
`us-6162-corliss-steam-engine-fig-3-source-crop-v2.png`,
`us-6162-corliss-steam-engine-fig-4-preview.png`,
`us-6162-corliss-steam-engine-fig-5-preview.png`,
`us-6162-corliss-steam-engine-fig-6-source-crop-v2.png`,
`us-6162-corliss-steam-engine-fig-7-preview.png`,
`us-6162-corliss-steam-engine-fig-8-preview.png`, and
`us-6162-corliss-steam-engine-fig-9-source-crop-v2.png`. The active edition
does not rely on any of those legacy crops. This internal evidence repair does
not affect source-reader access to the complete edition or the pinned PDF.

`public/patents/transcripts/us-6162-corliss-steam-engine-reviewed.txt` is the
reviewed eight-page ledger. It preserves each drawing-sheet header and every
printed text-page continuation solely for auditability; the visitor-facing
React edition deliberately omits scan-page divisions.

The published data record names its curated excerpt as an excerpt and attaches
the complete manual edition. The specification has two printed claims, not the
three synthetic claims that preceded this receipt.
