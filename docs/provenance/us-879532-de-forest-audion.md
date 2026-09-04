# US 879,532 — Space Telegraphy (The Audion Triode): primary-source receipt

## Pinned source

- Catalogue id: `us-879532-de-forest-audion`
- Served facsimile: `public/patents/pdfs/us-879532-de-forest-audion.pdf`
- Source record: [Google Patents, US879532A](https://patents.google.com/patent/US879532A/en)
- Retrieved for this edition: 2026-08-19
- Rights basis: United States patent granted in 1908; the document is in the public domain in the United States.
- SHA-256: `3a37d70051d784a5a086d53b8d2d09f372b8bb14d40179b68b62a5c166e7876e`
- PDF page count: 4

## Facsimile review boundary

The pinned PDF identity, four-page sequence, and page roles were checked against
the authoritative served facsimile on 2026-08-19. OCR and prior text layers are
comparison aids only and are not the basis of the published reading. The drawing
sheet was independently rendered and visually reviewed at 300 DPI on 2026-09-03;
the resulting source-sheet acceptance is recorded below.

| PDF pages | Source matter checked |
| --- | --- |
| 1 | Drawing sheet: Figs. 1–2 showing the evacuated vessel $D$, heated filament $F$, anode plate $b$, and interposed grid member $a$ with associated RF oscillation input and local indicator circuits. |
| 2 | Patent-office masthead, inventor Lee de Forest of New York, N.Y., assignor to De Forest Radio Telephone Company, title "Space Telegraphy", Serial No. 354,662, filing date January 29, 1907, grant date February 18, 1908. Full specification description of heated gaseous media, electrostatic control grid, and electrical connections. |
| 3 | Specification conclusion and printed Claims 1 through 13. |
| 4 | Printed Claims 14 through 21, Lee de Forest signature, and witnesses Thomas I. Gallagher and Hans W. Goetze. |

## Editorial boundaries

- The continuous reading is explicit typed content in
  `src/data/editions/deForestAudionEdition.ts`; it deliberately has no source-page pagination.
- The page ledger is a reviewed supporting asset at
  `public/patents/transcripts/us-879532-de-forest-audion-reviewed.txt`.
- Every figure citation displays a complete local source sheet from the pinned
  facsimile: Sheet 1 supplies both printed figures without asserting a
  speculative isolated-crop boundary.
- The printed grant contains 21 distinct claims, each rigorously transcribed and decoded.

## Exact figure locators

| Printed figures | PDF page | Local preview asset |
| --- | --- | --- |
| 1 | 1 | `source-sheet-1-v1.png` (complete Sheet 1) |
| 2 | 1 | `source-sheet-1-v1.png` (complete Sheet 1) |

The earlier files named `fig-3` through `fig-6` were subdivisions of the two
printed circuit diagrams, not printed patent figures. They remain preserved as
superseded research assets and are not referenced by the edition. The v2 Fig. 1
and Fig. 2 crops also remain preserved as prior research assets. A 2026-09-03
source-pixel review found that the active Fig. 2 crop retained part of the Fig. 1
label, so neither legacy crop remains the archival preview.

## Source-sheet acceptance (2026-09-03)

PDF p. 1 was rendered directly at 300 DPI for source-pixel inspection only; no
OCR, text extraction, masking, compositing, reconstruction, or selective
redrawing was used. The page contains both complete printed diagrams and the
genuine patent furniture. The active source preview therefore keeps the full
upright sheet rather than claiming that the legacy crops are uniformly isolated.

| Active asset | Pinned PDF page / source rectangle | Output pixels / SHA-256 | Accepted coverage |
| --- | --- | --- | --- |
| `public/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png` | p. 1; `x=0, y=0, width=2320, height=3408` | 2320×3408; `27c094b22bc5ca46c4e6c664e5c986c51d4076c2f49818b23055e6f60cff7182` | Complete printed Sheet 1, including Figs. 1–2 and its original patent furniture. |

The active asset was compared with a fresh 300-DPI render of the pinned first
page: both are 2320×3408 pixels and the absolute pixel error is zero. All six
authored Figure 1/Fig. 2 citations now bind to that source sheet. Exact page,
source-raster, and source-rectangle records are in
`src/data/editions/figureOccurrenceSourceLocators.ts`; its byte digest,
dimensions, reviewer, and occurrence count are pinned in
`src/data/editions/archivalFigureAcceptance.ts`. This internal evidence repair
does not alter the legal text or the visitor's source-reader delivery.
