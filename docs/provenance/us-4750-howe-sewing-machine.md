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
| 1 | Drawing sheet 1 of 3: front elevation Fig. 1; needle section Fig. 4; shuttle Fig. 7. | Typed `figure-sheet` record; local source crops for Figs. 1, 4, and 7. |
| 2 | Drawing sheet 2 of 3: end elevation Fig. 2; shuttle-box detail Fig. 5. | Typed `figure-sheet` record; local source crops for Figs. 2 and 5. |
| 3 | Drawing sheet 3 of 3: top view Fig. 3; feed Fig. 6; lever details Figs. 8 and 9. | Typed `figure-sheet` record; local source crops for Figs. 3, 6, 8, and 9. |
| 4 | Patent-office masthead; notice; opening specification; lockstitch description; baster-plate; Fig. 1 through Fig. 4 references. | Continuous typed masthead and paragraph nodes; every printed figure reference is an authored reference node. |
| 5 | Shuttle-box, cam, needle arm, baster-plate, feed, thread delivery, lifting rod, and guide mechanism. | Continuous typed paragraph nodes with authored figure references and occurrence annotations for `picker-staves`, `baster-plate`, `tempering-screw`, `lifting-rod`, and `clipping-piece` (plus `needle`, `shuttle`, and `basting`). |
| 6 | Shuttle-thread holder and sliding-box description; claim preamble; claims 1-5; Elias Howe, Jr. signature and witnesses Thos. P. Jones and George Fisher. | Typed paragraphs, five source-exact `claim` nodes, signature, and witness node. |

## Layer boundary

- Raw comparison layer retained: `public/patents/source-text/us-4750-howe-sewing-machine.txt`. It is a deterministic PDF text layer and contains scan-recognition errors; it is not public editorial copy and was not used as an authority for uncertain glyphs.
- Reviewed transcription: `public/patents/transcripts/us-4750-howe-sewing-machine.txt`, linked to the same digest and six-page ledger.
- Published reading edition: `src/data/editions/us-4750-howe-sewing-machine.ts`. It is explicit typed content, not an OCR, Markdown, HTML, or PDF-text reflow.
- Editorial interpretation: the typed patent record's claim decoders and plain-English engineering material. It is kept distinct from the source-language nodes.

## Review limits

The facsimile supports the source text, figure identity, formal execution, and claim wording recorded here. It does not by itself establish later litigation, commercial history, simulator behavior, deployment state, or a legal determination beyond the stated archival rights basis.

## vNext source-pixel crop plan (publication-blocking)

The current local v1 crop assets are preserved as audit evidence and remain rejected for publication where they contain sheet headers, neighboring figures, incomplete geometry, or non-upright framing. No replacement crop is generated locally. Each replacement must be cut from the corresponding official Google Patents cloud page image and then manually reviewed for upright orientation, complete labels/leaders/numerals, and exclusion of headers, signatures, and neighboring figures.

| Figure | Official cloud page image | Exact vNext crop fence |
| --- | --- | --- |
| Fig. 1 | <https://patentimages.storage.googleapis.com/a3/44/79/e960fd5e3a61f1/US4750-drawings-page-3.png> | Tight source-pixel crop of the complete front elevation; retain the printed Fig. 1 identifier and every visible leader/label used by the edition, while excluding the sheet header, signatures, and Figs. 4/7. |
| Fig. 2 | <https://patentimages.storage.googleapis.com/ab/78/15/4da1911cb76faf/US4750-drawings-page-4.png> | Tight source-pixel crop of the complete end elevation; retain all source numerals/letters and leaders, excluding the sheet header and the neighboring Fig. 5 detail. |
| Fig. 3 | <https://patentimages.storage.googleapis.com/b4/fe/3a/be9b52eef4b293/US4750-drawings-page-5.png> | Tight source-pixel crop of the complete top view; retain the baster-plate, rack holes, cam, and regulating-screw labels/leaders, excluding Figs. 6, 8, and 9 and page furniture. |
| Fig. 4 | <https://patentimages.storage.googleapis.com/a3/44/79/e960fd5e3a61f1/US4750-drawings-page-3.png> | Tight source-pixel crop of the complete needle-and-cloth section, including the source Fig. 4 identifier and `f`/`e'` labels, excluding Fig. 1, Fig. 7, and sheet furniture. |
| Fig. 5 | <https://patentimages.storage.googleapis.com/ab/78/15/4da1911cb76faf/US4750-drawings-page-4.png> | Tight source-pixel crop of the complete shuttle-box top view, including shuttle, spool, sliding box/piece, and spring labels, excluding Fig. 2 and all page furniture. |
| Fig. 7 | <https://patentimages.storage.googleapis.com/a3/44/79/e960fd5e3a61f1/US4750-drawings-page-3.png> | Tight source-pixel crop of the complete shuttle detail, including the source `d'` hole and `f' f'` slot labels, excluding Fig. 1, Fig. 4, and sheet furniture. |
| Fig. 8 | <https://patentimages.storage.googleapis.com/b4/fe/3a/be9b52eef4b293/US4750-drawings-page-5.png> | Tight source-pixel crop of the complete small retaining-lever detail, including `m'`, `n'`, and `p'` labels/leaders, excluding Figs. 3, 6, and 9 and page furniture. |
| Fig. 9 | <https://patentimages.storage.googleapis.com/b4/fe/3a/be9b52eef4b293/US4750-drawings-page-5.png> | Tight source-pixel crop of the complete lever/spring detail, including `z z'` and `c'` labels/leaders, excluding Figs. 3, 6, and 8 and page furniture. |
