# US 233,692 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-233692-pelton-water-wheel`
- Local immutable facsimile: `public/patents/pdfs/us-233692-pelton-water-wheel.pdf`
- Stable public record: https://patents.google.com/patent/US233692A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c`
- PDF pages: 3
- Rights basis: United States Patent No. 233,692 was granted in 1880. Its
  historic text and drawings are public-domain material in the United States.

## Direct facsimile review

The pinned document has three source sheets. Page 1 is the drawing sheet with
Figs. 1 through 4, the printed title block, witness/inventor signatures, and
the N. Peters photo-lithographer line. Page 2 contains the masthead and the
complete specification through the transition to the claim. Page 3 contains
the one printed claim, execution, signature, and witnesses. The specification
and claim sheets were read in the cloud. The drawing sheet was independently
inspected against the pinned facsimile, and its printed title block, four figure
labels, reference letters, witness/inventor lines, and photo-lithographer line
are entered in the reviewed ledger. The raw PDF text layer was comparison
evidence only.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| p. 1 | Figs. 1-4: wheel, nozzle layout, bucket, bucket section; title block and signatures | Direct visual review and literal printed-matter ledger; crop binding withheld pending clean source-coordinate crops |
| p. 2 | Masthead and complete specification body | Direct visual review and manual transcription |
| p. 3 | Single claim, execution, signature, witnesses | Direct visual review and manual transcription |

## Corrected source facts

The former record inserted a second claim, a 170-degree turning angle, more
than 90 percent energy recovery, a half-jet-speed rule, a needle nozzle,
emergency deflector, materials, dimensions, pressure, speed, and several
historical and legal assertions not found in this three-sheet facsimile. Those
claims are not used in the public edition.

The source has one claim. It protects a specified combination: curved bottoms
`c` meeting at apex `d`, continuing to inclined discharge sides `e`, together
with sloped bucket front `b`, so the nozzle stream enters without striking the
front face. The specification permits separately fastened or integral buckets
and one or more nozzles, but it does not turn those optional details into a
second claim.

## Candidate edition, ledger, and figure crops

`peltonWaterWheelArchivalEdition` in
`src/data/editions/peltonWaterWheelEdition.ts` is a manually authored typed
React/TypeScript edition. It is continuous reading content, not OCR cleanup,
HTML, Markdown, a PDF text dump, or scan-page reconstruction. Its
`completeFacsimileReviewed` attestation remains false while the drawing-sheet
ledger and clean preview crops are unfinished.

`public/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt` is the
separate source ledger. Its page markers establish ordered review coverage but
are never shown in the visitor reader. The older source-text layer remains
research evidence only.

| Source figure | Crop status and next source-coordinate plan |
| --- | --- |
| Fig. 1 | Hold: source coordinates x=10–70%, y=21–69%; include the full wheel/nozzle arrangement, exclude the title header and Fig. 2 overlap. |
| Fig. 2 | Hold: source coordinates x=11–77%, y=53–84%; isolate the side elevation/distributing box, exclude Fig. 1, Fig. 4, and signature matter. |
| Fig. 3 | Hold: source coordinates x=69–85%, y=23–40%; regenerate a bounded bucket-only crop after the load gate permits image work. |
| Fig. 4 | Hold: source coordinates x=70–83%, y=63–77%; include both `e` labels and the bucket section, exclude neighboring drawing matter. |

Versioned crop files remain on disk as prior research artifacts but are not
bound by the archival edition: the current Fig. 1, Fig. 2, and Fig. 4 files
include neighboring source matter, and the crop pass is load-gated. No crop
is currently attested as a clean public figure preview. No reconstructed
linework, labels, or historical claims may be added.

## Review boundary

The pinned local PDF, its digest, and direct visual comparison are the edition
authority. Passing tests and software gates prove only the stated relationships;
they do not replace independent editorial acceptance against the facsimile and
the deployed Wright-quality reference.
