# US 608,969 — Marine Steam-Turbine

## Source identity

| Field | Reviewed fact |
| --- | --- |
| Catalogue id | `us-608969-parsons-turbine` |
| Printed title | *Marine Steam-Turbine* |
| Inventor as printed | Charles Algernon Parsons |
| Inventor location as printed | Heaton Works, Newcastle-upon-Tyne, England |
| Grant date | August 9, 1898 |
| Application filing date | March 4, 1898 |
| Serial number | 672,594 |
| Primary public record | https://patents.google.com/patent/US608969/en |
| Pinned facsimile | `public/patents/pdfs/us-608969-parsons-turbine.pdf` |
| Retrieved and fully reviewed | 2026-08-18 |
| SHA-256 | `fafd0884e61225ee7f93d0a88c81229cbbb4984e48869c204af58cb6af64b991` |
| PDF pages | 7 |
| Rights basis | Historical United States patent text and drawings are United States Government material in the public domain. |

The page headers and page-four masthead identify this source as *Marine
Steam-Turbine*, not the different axial reaction-turbine account formerly
carried by the catalogue record. The source's application date is March 4,
1898, not September 7, 1897.

## Facsimile map

| PDF page | Reviewed material |
| --- | --- |
| 1 | Drawing sheet 1 of 3: Figure 1, eight turbines on four screw-shafts; inventor, witnesses, and attorney signature panel. |
| 2 | Drawing sheet 2 of 3: Figure 2, four main turbines with reversing turbines X and Y. |
| 3 | Drawing sheet 3 of 3: Figure 3, six turbines on three screw-shafts. |
| 4 | Patent-office masthead, title, filing/serial matter, opening specification, and the first description of series and compound-parallel operation. |
| 5 | Capacity and coupling discussion; Figure 1 description and the opening valve-and-pipe sequences. |
| 6 | Completion of Figure 1 routes; Figure 2 reversing arrangement; Figure 3 introduction. |
| 7 | Completion of Figure 3 routes; all three printed claims; Parsons signature and witness names. |

## Editorial and preservation boundaries

- `src/data/editions/parsonsTurbineEdition.ts` is the continuous, manually
  authored visitor-facing source edition. It contains the three formal claims,
  all specification prose, drawing-sheet records, explicit figure references,
  selected period-term definitions, and source-bounded companions.
- `public/patents/transcripts/us-608969-parsons-turbine-reviewed.txt` is the
  page-marked, human-reviewed comparison ledger. It is not rendered as the
  public source face.
- The active figure previews are complete, unmodified drawing-sheet renders at
  `public/patents/figures/us-608969-parsons-turbine/`. Earlier tight crops are
  retained as legacy research assets and are not active evidence.
- `public/patents/source-text/us-608969-parsons-turbine.txt` and the prior
  unreviewed transcript are retained legacy research evidence only. They are
  not authority for the public edition and are not a reviewed transcription.
- The facsimile prints three numbered claims. The canonical record reads each
  legal string from the archival edition to prevent a second transcription from
  drifting.

## Deferred clean source-crop plan (cloud visual acceptance required)

The pinned PDF embeds each drawing sheet as a 2320 × 3408 px raster (300 dpi).
Figure 2's existing crop is accepted. Figures 1 and 3 remain pending clean
re-crops; the following bounds are the exact source-pixel rectangles for the
next versioned assets. They retain the printed sheet title and all pipe,
valve, turbine-bank, screw-shaft, and condenser labels while excluding the
outer scan border and the filing header above the drawing.

| Figure | PDF page | Source-pixel rectangle `(x, y, width, height)` | Required visible content | Next asset |
| --- | ---: | --- | --- | --- |
| Fig. 1 | 1 | `(180, 300, 1960, 2960)` | Eight A/A′/B/B′/C/C′/D/D′ turbines, shafts 1–4, boiler pipe P, valves R¹–R¹⁶, pipes P¹–P¹⁰ and Q¹–Q⁸, condenser E, and sheet title | `fig-1-source-crop-v2.png` |
| Fig. 3 | 3 | `(180, 300, 1960, 2960)` | Six A/A′/B/B′/C/C′ turbines, shafts 1–3, U-pipes and V/W valves, condenser K, and sheet title | `fig-3-source-crop-v2.png` |

These are crop instructions, not accepted assets: no edition reference is
repointed until an independent cloud reviewer confirms that every listed
label and route junction is legible and that no adjacent sheet material is
included. Existing `v1` files remain preserved as research candidates.
