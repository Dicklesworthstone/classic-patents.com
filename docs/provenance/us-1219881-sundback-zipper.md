# Provenance receipt: US 1,219,881, Gideon Sundback

## Source identity

- Catalogue id: `us-1219881-sundback-zipper`
- Granted title: *Separable Fastener*
- Inventors as printed: Gideon Sundback, a subject of the King of Sweden, residing at Meadville, in the county of Crawford and State of Pennsylvania, assignor to Hookless Fastener Company, a corporation of Pennsylvania.
- Grant date: 1917-03-20
- Filing date: 1914-08-27
- Application Serial No.: 858,848
- Primary public record: https://patents.google.com/patent/US1219881A/en
- Local immutable facsimile: `public/patents/pdfs/us-1219881-sundback-zipper.pdf`
- Retrieval and full-facsimile review date: 2026-09-01
- Rights basis: a United States patent granted in 1917; its historical text and drawings are public-domain United States Government material.
- SHA-256: `8b73a4db400d449ec6349a07c05b38df6f5bed609562a2c96ba893890a41a3b9`
- PDF page count: 5

## Facsimile map and comparison record

The pinned five-page PDF was visually reviewed at 300 DPI. The public source face is deliberately continuous, so it does not impose these scan-page breaks on a reader. They are retained here to make the editorial comparison reproducible.

| Facsimile locator | Content checked |
| --- | --- |
| PDF p. 1 | Drawing sheet 1 of 1: `FIG. 1` (perspective view of complete fastener), `FIG. 2` (detail view showing locking and unlocking action through slider cam), `FIG. 3` (cross section on line 3-3 of Fig. 1 showing clamped jaws on corded tape edge), `FIG. 4` (detail view of single locking member showing recess and jaws), `FIG. 5` (cross section on line 5-5 of Fig. 4), `FIG. 6` (detail view of stringer tape with cords), `FIG. 7` (cross section on line 7-7 of Fig. 6), `FIG. 8` (cross section of Y-slider cam), `FIG. 9` (enlarged detail of interlocking members); Patent No. 1,219,881; application filed Aug. 27, 1914; patented Mar. 20, 1917; inventor Gideon Sundback. |
| PDF p. 2 | Patent Office masthead and formal preamble; statement of field of invention, prior art defects, and objects of the invention; brief description of drawings (Figures 1 through 9); detailed mechanical specification of stringers, corded edges, stop members, and Y-slider cam. |
| PDF p. 3 | Completion of detailed description: jaws clamping onto corded edges, alternating scoop nesting, transverse flexibility without disengagement, single-form stamping economics, cross-reference to co-pending application Serial No. 19,474; formal claim intro; Claims 1 through 5. |
| PDF p. 4 | Claims 6 through 11; signature of inventor Gideon Sundback; signatures of witnesses Lewis C. Bell and Maude Harper. |
| PDF p. 5 | Official Disclaimer: Disclaimer filed April 6, 1932 by assignee Hookless Fastener Company restricting scope of claims 1, 2, and 3 to fasteners where longitudinal thickness and clearances enable sharp transverse flexing without opening automatically (published in Official Gazette April 26, 1932). |

## Editorial and preservation boundaries

- `src/data/editions/sundbackZipperEdition.ts` is the complete visitor-facing source face. Its prose, claims, glossary annotations, and figure references are individually authored typed React nodes. It does not render raw OCR, an unedited PDF text layer, or scan-page banners.
- Each figure reference in the edition points to the complete local source sheet in `public/patents/figures/us-1219881-sundback-zipper/`. This deliberately preserves the one-sheet layout rather than treating a clipped or mixed-detail crop as an isolated figure.
- `public/patents/transcripts/us-1219881-sundback-zipper-reviewed.txt` is the review ledger for this edition, recording all five facsimile pages with standard ordered page markers.
- The source contains eleven printed claims plus the 1932 disclaimer. The manual edition preserves the complete ordered set without summary compression or truncation.

## Source-sheet acceptance (2026-09-03)

The pinned drawing sheet (PDF p. 1) was rendered directly at 300 DPI for
source-pixel inspection only; no OCR, text extraction, masking, compositing,
or reconstruction was used. The source raster is 2320×3408 pixels, upper-left
origin. Inspection showed that the prior figure-specific assets did not provide
a dependable uniform basis for an isolated-figure assertion: the one printed
sheet interleaves Figures 1–9, with adjacent figures and printed patent
furniture close to several crop boundaries. The old assets remain preserved as
research artifacts and are not overwritten.

The active preview is therefore the complete, unmodified source drawing sheet,
not a synthetic composite or a misleadingly named isolated crop:

| Active asset | Pinned PDF page / source rectangle | Output pixels / SHA-256 | Accepted coverage |
| --- | --- | --- | --- |
| `public/patents/figures/us-1219881-sundback-zipper/source-sheet-1-v1.png` | p. 1; `x=0, y=0, width=2320, height=3408` | 2320×3408; `d2c2c475fb2fe63d493c6cb15377af95b8b4fcbc0f76fa695c98a4c2bde44fc6` | The complete printed sheet containing Figures 1 through 9 and its genuine patent furniture. |

Every one of the edition’s 25 authored figure-reference occurrences now names
that same complete source sheet. Exact page, source-raster, and full-sheet
rectangle evidence is recorded in
`src/data/editions/figureOccurrenceSourceLocators.ts`; the byte digest,
dimensions, reviewer, and occurrence count are pinned in
`src/data/editions/archivalFigureAcceptance.ts`. This evidence repair changes
neither the legal text nor the visitor’s source-reader delivery.

An independent source-pixel check rendered PDF p. 1 afresh at 300 DPI and
compared it with the active asset: both are 2320×3408 pixels and the absolute
pixel error is zero. That check confirms that Figures 1–9 remain legible and
complete in the active sheet, with no clipping, mask, reconstruction, or
compositing.
