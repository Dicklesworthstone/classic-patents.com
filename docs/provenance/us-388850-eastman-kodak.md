# Provenance receipt: US 388,850, George Eastman

## Source identity

- Catalogue id: `us-388850-eastman-kodak`
- Granted title: *Camera*
- Inventor as printed: George Eastman, of Rochester, New York
- Grant date: 1888-09-04
- Filing date: 1888-03-30
- Serial number as printed: 268,964
- Primary public record: https://patents.google.com/patent/US388850A/en
- Local immutable facsimile: `public/patents/pdfs/us-388850-eastman-kodak.pdf`
- Retrieval and full-facsimile review date: 2026-08-18
- Rights basis: a United States patent granted in 1888; its historical text and
  drawings are public-domain United States Government material.
- SHA-256: `49c9e9ff048771cb4fcc97b811af7f666c9925bb01b3b46d1588f95c63c0cfe1`
- PDF page count: 9

## Facsimile map and comparison record

The pinned PDF was rasterized at 220 DPI and every page was visually inspected.
The continuous edition has no scan-page breaks; this table preserves the
reproducible locators.

| Facsimile locator | Content checked |
| --- | --- |
| PDF p. 1 | Drawing sheet 1 of 3. `G. EASTMAN`, `CAMERA`, No. 388,850, 4 September 1888; Figs. 1, 2, and 3; witnesses Chas. R. Bunn and C. F. Blienert; George Eastman and J. Frank Hameel, attorneys. |
| PDF p. 2 | Drawing sheet 2 of 3; Figs. 4, 5, 6, 7, 8, and 11; the same printed identification and signatures. |
| PDF p. 3 | Drawing sheet 3 of 3; Figs. 9 and 10; the same printed identification and signatures. |
| PDF p. 4 | Patent Office masthead, application line, formal preamble, the `detective cameras` description, full figure list, camera box A, block B, roller-holder C, and the light-tight front chamber. |
| PDF p. 5 | Cylindrical shutter S, lens L, lens support L', spring-and-ratchet motor, winding cord 12, cam plate 20, latch 23, push-pin 25, and spring 27. |
| PDF p. 6 | Stop-and-release sequence, shutter light exclusion, open-stop grooves, removable module statement, and opening roll-holder description. |
| PDF p. 7 | Roller-holder construction and claims 1 through 8. |
| PDF p. 8 | Claims 8 through 28. |
| PDF p. 9 | Claims 29 through 41, printed signature `GEO. EASTMAN.`, and witnesses Edwin O. Sago and Geo. W. Deming. |

## Source-sheet acceptance (2026-09-03)

Each active figure citation in the public edition was visually checked against
the pinned facsimile, then assigned to an intact 300-DPI render of its actual
three-sheet drawing page. The assets below are direct full-page renders of the
pinned PDF: no figure was reconstructed, composited, or substituted. A fresh
render of each page compared to its committed asset at zero differing pixels.

| Active source sheet | Pinned PDF locator and printed figures | Asset dimensions | SHA-256 |
| --- | --- | --- | --- |
| `source-sheet-1-v1.png` | PDF p. 1, drawing sheet 1 of 3; Figs. 1, 2, 3 | 2560 × 3300 | `67b465101abf5be4d2b653ce5e8a7df161e97a85d2166b229541484fbedc19a1` |
| `source-sheet-2-v1.png` | PDF p. 2, drawing sheet 2 of 3; Figs. 4, 5, 6, 7, 8, 11 | 2560 × 3300 | `2d6f3da0a93b5a4f5248db89f9dc950284ce6f94c836bee38540ae537534edcb` |
| `source-sheet-3-v1.png` | PDF p. 3, drawing sheet 3 of 3; Figs. 9, 10 | 2560 × 3300 | `b3d072a586e67e41c2fb960e8e92a646289f68122ce76f930df180fc107902d0` |

The eleven authored references occur only in the figure-list paragraph at
edition block 4: `edition-block-4-group-0-inline-1`, `-3`, and `-5` cite
Figs. 1–3 on source sheet 1; `-7`, `-9`, `-11`, `-13`, `-15`, and `-23` cite
Figs. 4–8 and 11 on source sheet 2; `-17` and `-19` cite Figs. 9–10 on source
sheet 3. The page carries no other authored figure references. The focused
test pins this count, order, page mapping, dimensions, asset digests, and the
continued presence of every earlier crop asset.

## Editorial and preservation boundaries

- `src/data/editions/eastmanKodakEdition.ts` is the visitor-facing source
  face. Its continuous prose, claims, term annotations, and figure references
  are authored typed React nodes, not a PDF text layer, OCR dump, Markdown, or
  generated HTML.
- Active local previews under `public/patents/figures/us-388850-eastman-kodak/`
  are the three source-sheet assets documented above. The prior
  `fig-*-source-crop-v1.png` files remain preserved, non-active evidence crops;
  they are not reconstructed illustrations.
- `public/patents/source-text/us-388850-eastman-kodak.txt` remains a machine
  text-layer research aid only. It contains recognition defects and is not
  evidence of editorial completeness.
- `public/patents/transcripts/us-388850-eastman-kodak-reviewed.txt` is the
  page-marked review ledger. It records nine PDF pages while the public edition
  remains a natural continuous reading.
- The printed grant contains forty-one claims. The edition and canonical record
  retain the complete ordered claim set; no alleged retail dimensions, shutter
  speed, film count, lens type, or litigation result was inferred from this
  facsimile.
