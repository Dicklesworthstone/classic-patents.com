# US 381,968 — Electro-Magnetic Motor: primary-source receipt

## Pinned source

- Catalogue id: `us-381968-tesla-motor`
- Served facsimile: `public/patents/pdfs/us-381968-tesla-motor.pdf`
- Source record: [Google Patents, US381968A](https://patents.google.com/patent/US381968A/en)
- Retrieved for this edition: 2026-08-18
- Rights basis: United States patent granted in 1888; the document is in the public domain in the United States.
- SHA-256: `cffd7ff061b05feef92c2d6ef4d767c7b7e8c6b4e0d10cc9be3fbd51841dce12`
- PDF page count: 9

## Two direct facsimile checks

The pinned PDF was rendered and visually inspected page by page twice on
2026-08-18. The first pass established the source sequence and the second pass
checked the authored edition against the printed pages. OCR and the prior
`source-pdf-text-layer` were comparison aids only and are not the basis of the
published reading.

| PDF pages | Source matter checked |
| --- | --- |
| 1–4 | Four drawing sheets: Figs. 1–8 and 1a–8a; Figs. 9–12; Figs. 13–16; Figs. 17–19; printed title, date, inventor, witnesses, and attorney notices. |
| 5 | Patent-office masthead, assignee line, title, grant date, application date, serial number, opening matter, Figs. 1–8/1a–8a description, and start of Fig. 9 system. |
| 6 | Completion of Fig. 9, the full phase-sequence explanation, disk discussion, and start of Figs. 10–12. |
| 7 | Completion of Figs. 10–12, Figs. 13–14 three-circuit apparatus, Figs. 15–16, and start of Figs. 17–19. |
| 8 | Completion of Figs. 17–19, stated operating characteristics, stated advantages, limitation of “independent,” prior-method distinction, and claim preamble. |
| 9 | Claims 1–4 exactly as printed, Nikola Tesla signature, and witness names Frank E. Hartley and Frank B. Murphy. |

## Editorial boundaries

- The continuous reading is explicit typed content in
  `src/data/editions/teslaMotorEdition.ts`; it deliberately has no source-page
  pagination.
- The page ledger is a reviewed supporting asset. The published archival face
  renders only the typed edition, never the former OCR/PDF text layer.
- Active figure previews are complete, upright drawing sheets rendered from
  the pinned source. Sheet 1 supplies Figs. 1–8 and 1a–8a; Sheet 2 supplies
  Figs. 9–12; Sheet 3 supplies Figs. 13–16; Sheet 4 supplies Figs. 17–19.
  Earlier individual crop files remain preserved on disk as research evidence
  and are not used as archival citations.
- The printing says “Application filed October 12, 1887.” The previous
  text-layer reading of “1857” is a scan/OCR error and is not retained.
- The printed grant has four claims, all presented as independent combination
  claims. A former three-claim record with a spurious claim 9 was corrected.

## Source-sheet crop review (2026-09-03)

The four pinned-PDF drawing pages were rendered at 300 dpi and visually
reviewed as source pixels. Every active figure citation uses its entire
upright source-sheet raster rather than an inferred individual-figure boundary:

| Printed figures | PDF page | Active asset | Source raster and accepted rectangle |
| --- | --- | --- | --- |
| 1–8 and 1a–8a | 1 | `figs-1-to-8-and-1a-to-8a-source-sheet-v2.png` | 2320 × 3408 px; `[0, 0, 2320, 3408]` |
| 9–12 | 2 | `figs-9-to-12-source-sheet-v2.png` | 2320 × 3408 px; `[0, 0, 2320, 3408]` |
| 13–16 | 3 | `figs-13-to-16-source-sheet-v2.png` | 2320 × 3408 px; `[0, 0, 2320, 3408]` |
| 17–19 | 4 | `figs-17-to-19-source-sheet-v2.png` | 2320 × 3408 px; `[0, 0, 2320, 3408]` |

The source-sheet assets are byte-pinned in
`src/data/editions/archivalFigureAcceptance.ts`. All 57 figure-reference
occurrences are explicitly bound to the appropriate PDF page and complete
source rectangle in `src/data/editions/figureOccurrenceSourceLocators.ts`.
The reviewer was `Classic Patents editorial agent (GPT-5.6); direct 300 dpi
source-pixel review`, dated 2026-09-03. This review establishes the active
asset's source page and extent; it does not restate or replace the separate
edition and ledger review recorded above.

## Known editorial scope

This receipt establishes source identity and the manual edition’s coverage. It
does not claim that a local typecheck, a software test, or this editorial pass
is independent acceptance. The orchestrator must independently compare the
live edition to the pinned PDF before closing its Bead.
