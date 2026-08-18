# Provenance receipt: US 3,633

## Identity and source

- Catalogue id: `us-3633-goodyear-rubber`
- Patent: **US 3,633, Improvement in India-Rubber Fabrics**
- Named inventor in the facsimile: Charles Goodyear, of New York, N. Y.
- Grant date printed in the facsimile: June 15, 1844
- Primary public record: <https://patents.google.com/patent/US3633A/en>
- Retrieval date: 2026-08-17
- Pinned served facsimile: `public/patents/pdfs/us-3633-goodyear-rubber.pdf`
- SHA-256: `efd8490327472ea50fd873afd35ec759489f9587c9a9df1a590a500f7a66a8a7`
- PDF page count: 2
- Rights basis: the 1844 United States patent publication is in the public domain in the United States. The repository preserves the source PDF as an immutable facsimile.

## Editorial layers

1. **Facsimile:** the PDF above is the controlling historical source and is not modified by this edition.
2. **Reviewed transcription:** `public/patents/transcripts/us-3633-goodyear-rubber.txt` is a manual, non-authoritative reading transcription checked against the two printed source pages. It is not OCR output.
3. **Continuous edition:** `src/data/editions/goodyearRubberEdition.ts` contains explicit typed source nodes for the published Original Patent Text face. It deliberately omits scan-page labels and pagination.
4. **Editorial explanation:** `src/data/patents/goodyear-rubber.ts` provides the record-level engineering explanation and claim decoders. It is distinct from the source wording.

## Direct comparison log

The entire facsimile was visually reviewed twice on 2026-08-17: once before transcription and once after the typed blocks and transcription were authored. The source contains two text pages, no drawing sheet, no printed figure reference, no table, and no printed equation. No crop, figure link, callout, or synthetic schematic is represented as archival material for this grant.

| Source material | Exact PDF locator | Edition treatment |
| --- | --- | --- |
| Patent-office masthead, inventor line, title, and grant notice | PDF p. 1, top quarter | One `masthead` node, preserving printed capitalization and the June 15, 1844 notice. |
| Opening declaration through the roller method and odor wash | PDF p. 1, both columns | Five ordered explicit paragraph nodes. Scan line-wrap hyphens are joined only where a word continues across a printed line. |
| Cotton-wool laminate description and cure-temperature passage through “upon a” | PDF p. 1, right column, lower half | Two explicit paragraph nodes; the second continues at PDF p. 2 without a synthetic page break. |
| Continuation “fabric consisting…” through the earlier-patent disclaimer | PDF p. 2, left column | The continuation is joined to the prior cure paragraph; the disclaimer is a separate paragraph node. |
| “I do claim—” and claims 1–3 | PDF p. 2, lower left and right columns | An explicit lead-in plus three ordered `claim` nodes. Claim 1 includes its continuation across columns. |
| Signature and witness lines | PDF p. 2, lower right | Two closing paragraph nodes. The facsimile spells the second witness `B. R. MORSELL`. |

## Source limits

The facsimile does not state a filing date and does not contain a drawing. Any visitor-facing filing-date field or synthetic visualization requires separate source support; neither is evidence from this grant. The Google Patents public record reports the June 15, 1844 publication/grant date and lists no application number or filing date.
