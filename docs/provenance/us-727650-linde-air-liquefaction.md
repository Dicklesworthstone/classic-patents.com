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

The working cache at `artifacts/raw_pdfs/us-727650-linde-air-liquefaction.pdf`
is byte-identical to the pinned public PDF: both files are 600,056 bytes,
report five pages at 2320 × 3408 source pixels per page, and have the same
SHA-256 above. The cache is therefore a container copy, not a competing
facsimile or a reason to change the pinned digest.

## Direct facsimile review

| PDF page | Checked material | Editorial treatment |
| --- | --- | --- |
| 1 | Patent notice, full sole apparatus drawing, inventor/attorney signatures, drawing-sheet witnesses | The visitor preview uses the complete upright source sheet, retaining the connected apparatus, patent furniture, and execution marks. |
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
paragraph reflow. The active preview under
`public/patents/figures/us-727650-linde-air-liquefaction/` is an unmodified
rendering of PDF page 1; it introduces no new linework or labels.

`public/patents/transcripts/us-727650-linde-air-liquefaction-reviewed.txt` is
the page-marked review ledger. Its page markers are comparison evidence only
and never appear in the continuous source face. The older unreviewed text file
remains comparison evidence and is not a served source asset.

The source contains fourteen printed claims and one unnumbered source drawing.
Every edition claim is an explicit typed node. The terms and figure reference
are authored nodes; the direct patent-local companion export is
`lindeAirLiquefactionParallelReadings`. Root must register that export in the
shared map separately.

## Source-sheet acceptance (2026-09-03)

The previous active crop clipped the right-hand separation path near G³. The
sole apparatus is a continuous drawing: a crop that retained the left
compressor and G′ apparatus but omitted that branch was not an honest
archival preview. The active evidence is therefore the complete upright source
sheet, not a newly invented G³-side crop:

- Active asset:
  `public/patents/figures/us-727650-linde-air-liquefaction/source-sheet-1-v1.png`
- Exact pinned source: PDF page 1, rendered at 300 dpi, 2320 × 3408 pixels.
- Source rectangle: `x=0`, `y=0`, `width=2320`, `height=3408`; normalized
  rectangle `(0, 0, 1, 1)`.
- Source PDF SHA-256:
  `6d5423307d5718474ea8dd5891c52bccc6c7df2103a9ed4b9c7298d27f29c776`.
- Active asset SHA-256:
  `842b7ff51fe93dcf058c0fc837164c7dfa246074389c6ea04ecfbe7b5e24da47`.
- Independent fresh 300 dpi rendering comparison: absolute-error count `0`.

Visual review confirms that the complete page preserves the connected C, K,
G′, N, R′, V′, V², S, G², and G³ apparatus paths, their printed labels, and
the original patent and execution furniture. The active PNG contains no crop
boundary, mask, reconstruction, compositing, recoloring, or added annotation.
The older `fig-1-source-crop-v1.png`, `fig-1-source-crop-v2.png`, and
`fig-1-left-pipe-source-crop-v2.png` are preserved as historical review
artifacts but are no longer offered as the source-face figure preview.

Both authored citations bind to this exact page-one source rectangle:
`edition-block-1-group-0-inline-1` and
`edition-block-8-group-0-inline-1`. Their digest-pinned attestation and
independently reviewed locators live in the archival evidence registries.
This repair only improves internal figure evidence. It neither alters nor
gates the complete patent-text reader.
