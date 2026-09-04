# Provenance receipt: US 4,750, *Improvement in Sewing-Machines*

## Pinned local evidence

- Catalogue id: `us-4750-howe-sewing-machine`
- Served facsimile: `public/patents/pdfs/us-4750-howe-sewing-machine.pdf`
- SHA-256: `8f7449b3d54c2652dd74bab62fd079fdf76bd7216d8f15dd32c6af5def57b053`
- PDF page count: 6 (`pdfinfo`, reviewed 2026-08-17)
- Patent-office heading: Elias Howe, Jr., of Cambridge, Massachusetts; *Improvement in Sewing-Machines*; No. 4,750; dated September 10, 1846.
- Filing-date boundary: the pinned grant does not print an application or filing date; the canonical record therefore leaves `filingDate` null rather than asserting an undocumented date.

## Source and rights basis

- Canonical public record: <https://patents.google.com/patent/US4750A/en>
- Retrieved for this review: 2026-08-17.
- Primary comparison object: the locally pinned six-page facsimile above, not the record site's OCR or HTML transcription.
- Rights basis: the 1846 United States patent text and drawings are a United States publication far outside the United States copyright term. This receipt is an archival provenance statement, not legal advice about any separate scan-provider rights.

## Direct facsimile review ledger

| PDF page | Reviewed material | Edition treatment |
| --- | --- | --- |
| 1 | Drawing sheet 1 of 3: front elevation Fig. 1; needle section Fig. 4; shuttle Fig. 7. | Typed `figure-sheet` record; active complete source sheet for Figs. 1, 4, and 7. |
| 2 | Drawing sheet 2 of 3: end elevation Fig. 2; shuttle-box detail Fig. 5. | Typed `figure-sheet` record; active complete source sheet for Figs. 2 and 5. |
| 3 | Drawing sheet 3 of 3: top view Fig. 3; feed Fig. 6; lever details Figs. 8 and 9. | Typed `figure-sheet` record; active complete source sheet for Figs. 3, 6, 8, and 9. |
| 4 | Patent-office masthead; notice; opening specification; lockstitch description; baster-plate; Fig. 1 through Fig. 4 references. | Continuous typed masthead and paragraph nodes; every printed figure reference is an authored reference node. |
| 5 | Shuttle-box, cam, needle arm, baster-plate, feed, thread delivery, lifting rod, and guide mechanism. | Continuous typed paragraph nodes with authored figure references and occurrence annotations for `picker-staves`, `baster-plate`, `tempering-screw`, `lifting-rod`, and `clipping-piece` (plus `needle`, `shuttle`, and `basting`). |
| 6 | Shuttle-thread holder and sliding-box description; claim preamble; claims 1-5; Elias Howe, Jr. signature and witnesses Thos. P. Jones and George Fisher. | Typed paragraphs, five source-exact `claim` nodes, signature, and witness node. |

## Layer boundary

- Raw comparison layer retained: `public/patents/source-text/us-4750-howe-sewing-machine.txt`. It is a deterministic PDF text layer and contains scan-recognition errors; it is not public editorial copy and was not used as an authority for uncertain glyphs.
- Reviewed transcription: `public/patents/transcripts/us-4750-howe-sewing-machine-reviewed.txt`, linked to the same digest and six-page ledger. The earlier un-suffixed ledger is retained as a legacy artifact; the canonical record points only to the `-reviewed.txt` path.
- Published reading edition: `src/data/editions/us-4750-howe-sewing-machine.ts`. It is explicit typed content, not an OCR, Markdown, HTML, or PDF-text reflow.
- Editorial interpretation: the typed patent record's claim decoders and plain-English engineering material. It is kept distinct from the source-language nodes.

## Review limits

The facsimile supports the source text, figure identity, formal execution, and claim wording recorded here. It does not by itself establish later litigation, commercial history, simulator behavior, deployment state, or a legal determination beyond the stated archival rights basis.

## Complete source-sheet acceptance (2026-09-04)

The complete six-page pinned facsimile was visually reviewed at 300 DPI.
Pages 1 through 3 are the complete drawing sheets and pages 4 through 6 are
the specification, execution, and five claims. Every active figure citation
now opens its complete upright source sheet, directly rendered from the pinned
PDF. No crop boundary, rotation, reconstruction, compositing, or substitute
image is used by an active source reference.

| Active source sheet | Pinned PDF locator and printed figures | Dimensions | SHA-256 |
| --- | --- | ---: | --- |
| `/patents/figures/us-4750-howe-sewing-machine/source-sheet-1-v1.png` | PDF p. 1, Sheet 1 of 3: Figs. 1, 4, 7 | 2320 × 3408 | `d91899bccbce2eaedeea23fddff2137cadaf0fac1ef2c011e6a64a421ea03cf7` |
| `/patents/figures/us-4750-howe-sewing-machine/source-sheet-2-v1.png` | PDF p. 2, Sheet 2 of 3: Figs. 2, 5 | 2320 × 3408 | `74dfb5350fd16740b2bfeb0d153da87bca795bcd004797feef38d40dc59ac58b` |
| `/patents/figures/us-4750-howe-sewing-machine/source-sheet-3-v1.png` | PDF p. 3, Sheet 3 of 3: Figs. 3, 6, 8, 9 | 2320 × 3408 | `df84b4e87e3ca2b5261e82e3b2dc1e7baae677ab654cf055fabd62d47a7b79d2` |

The edition has 36 authored figure-reference occurrences. Their first active
sheet is recorded by the edition test and is ready for the shared
occurrence-locator registry: 14 refer to PDF p. 1, 10 to PDF p. 2, and 12 to
PDF p. 3. Three plural references retain a second source-sheet preview where
the printed text names figures on two sheets: block 20 inline 10 (Figs. 2 and
3), and block 23 inlines 1 and 5 (Figs. 1 and 2). Each source locator covers
the full source raster: `(0, 0, 2320, 3408)`.

The legacy flat `us-4750-howe-sewing-machine-fig-*-preview.png` assets remain
preserved and untouched. They are not active source evidence. This archival
repair does not change availability of the complete edition, reviewed ledger,
or pinned PDF.
