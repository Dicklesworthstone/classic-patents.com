# US 727,650 — source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-727650-linde-air-liquefaction`
- Local immutable facsimile: `public/patents/pdfs/us-727650-linde-air-liquefaction.pdf`
- Stable public record: https://patents.google.com/patent/US727650A/en
- Retrieved and fully reviewed: 2026-08-18
- SHA-256: `6d5423307d5718474ea8dd5891c52bccc6c7df2103a9ed4b9c7298d27f29c776`
- PDF pages: 5
- Rights basis: the 1903 United States patent’s historical text and drawings
  are public-domain United States Government material. This receipt does not
  claim rights in a third party’s scan presentation or metadata.

## Direct facsimile review

| PDF page | Checked material | Editorial treatment |
| --- | --- | --- |
| 1 | Patent notice, full sole apparatus drawing, inventor/attorney signatures, drawing-sheet witnesses | One tight direct crop, rendered as the source-drawing preview. |
| 2 | Office masthead, title, inventor/assignee, July 9 1895 filing and serial 595,371, opening specification and printed formula | Typed masthead, prose, equation, and source-drawing reference. |
| 3 | Apparatus C, K, G′, P, V′, V², G², G³, operating pressures and separation paths | Continuous typed prose and patent-local companions. |
| 4 | Specification close, definition of condensation, claims 1–10 | Typed claim blocks 1–10 and exact decoders. |
| 5 | Claims 11–14, execution, Carl Linde signature, Emil Wenzel and Alex Negele | Typed claim blocks, execution, and witnesses. |

The printed application date is **July 9, 1895**. The facsimile does not
support the formerly published October 18, 1900 filing, 200-bar plant,
vacuum-Dewar, desiccant, or asserted patent-war account; those assertions are
not carried by the source-correct canonical record.

## Editorial boundary

`lindeAirLiquefactionArchivalEdition` is a continuous, explicit typed React
edition in `src/data/editions/lindeAirLiquefactionEdition.ts`. It is not
derived at render time from OCR, a PDF text layer, HTML, Markdown, or automatic
paragraph reflow. The sole preview under
`public/patents/figures/us-727650-linde-air-liquefaction/` is a direct crop of
PDF page 1; it introduces no new linework or labels.

`public/patents/transcripts/us-727650-linde-air-liquefaction-reviewed.txt` is
the page-marked review ledger. Its page markers are comparison evidence only
and never appear in the continuous source face. The older unreviewed text file
remains comparison evidence and is not a served source asset.

The source contains fourteen printed claims and one unnumbered source drawing.
Every edition claim is an explicit typed node. The terms and figure reference
are authored nodes; the direct patent-local companion export is
`lindeAirLiquefactionParallelReadings`. Root must register that export in the
shared map separately.

## Independent-review boundary

The editor visually reviewed all five pages and performed a second comparison
while making the ledger. This is local source evidence only. Root must perform
the independent PDF/live-page review and shared-map integration; this Bead
remains in progress and is not accepted or closed by this receipt.
