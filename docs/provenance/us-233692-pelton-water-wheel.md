# US 233,692 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-233692-pelton-water-wheel`
- Local immutable facsimile: `public/patents/pdfs/us-233692-pelton-water-wheel.pdf`
- Stable public record: https://patents.google.com/patent/US233692A/en
- Retrieved for source review: 2026-08-18
- Complete direct facsimile review: 2026-09-03
- SHA-256: `b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c`
- PDF pages: 3
- Rights basis: United States Patent No. 233,692 was granted in 1880. Its
  historic text and drawings are public-domain material in the United States.

## Direct facsimile review

The pinned document has three source sheets. Page 1 is the drawing sheet with
Figs. 1 through 4, the printed title block, witness/inventor signatures, and
the N. Peters photo-lithographer line. Page 2 contains the masthead and the
complete specification through the transition to the claim. Page 3 contains
the one printed claim, execution, signature, and witnesses. On 2026-09-03 all
three sheets were rendered from the pinned local PDF and visually checked
against the edition and reviewed ledger. The claim transition is retained at
its actual sheet boundary: “Having thus described my invention, what” ends
page 2 and “I claim as new, and desire to secure by Letters Patent, is—” begins
page 3. The raw PDF text layer was comparison evidence only; no local OCR was
run.

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

The visitor visual is likewise source-bounded: it shows the wheel, a
representative bucket, the pipe/nozzle and distributing-box arrangement, and
the two described discharge paths. It does not show a later turbine casing,
bearings, tailrace, pressure gauge, runner-speed control, or hydraulic
performance telemetry, because none is specified by this grant.

The source has one claim. It protects a specified combination: curved bottoms
`c` meeting at apex `d`, continuing to inclined discharge sides `e`, together
with sloped bucket front `b`, so the nozzle stream enters without striking the
front face. The specification permits separately fastened or integral buckets
and one or more nozzles, but it does not turn those optional details into a
second claim.

## Archival edition, ledger, and source-sheet evidence

`peltonWaterWheelArchivalEdition` in
`src/data/editions/peltonWaterWheelEdition.ts` is a manually authored typed
React/TypeScript edition. It is continuous reading content, not OCR cleanup,
HTML, Markdown, a PDF text dump, or scan-page reconstruction. Its
`completeFacsimileReviewed` is true after the 2026-09-03 direct three-sheet
review. The source-text review and the drawing-sheet review use distinct,
explicit evidence records.

`public/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt` is the
separate source ledger. Its page markers establish ordered review coverage but
are never shown in the visitor reader. The older source-text layer remains
research evidence only.

## Source-sheet acceptance (2026-09-03)

The page-one drawing sheet is a single 2320 × 3408-pixel, upright 300-DPI
render of the pinned facsimile. It contains Figs. 1–4, their printed labels,
the title block, witnesses, inventor signature, and photo-lithographer line in
one interleaved historical layout. An isolated crop would require asserting
boundaries between neighboring printed figures and formal source matter, so the
edition deliberately uses the complete source sheet for each of its eight
figure occurrences.

| Active evidence | Value |
| --- | --- |
| Asset | `public/patents/figures/us-233692-pelton-water-wheel/source-sheet-1-v1.png` |
| Source extent | PDF p. 1; x=0, y=0, width=2320, height=3408 pixels; normalized extent x=0, y=0, width=1, height=1 |
| Render / dimensions | Direct 300-DPI PNG render; 2320 × 3408 pixels |
| Asset SHA-256 | `a1766af4b2a4d72bef0a3578fda56c8c5949060ec8a0fa4554d227db9546c512` |
| Pinned-PDF SHA-256 | `b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c` |
| Reviewer / date | Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review; 2026-09-03 |
| Bound occurrences | Fig. 1–4 in the figure-sheet schedule and Fig. 1–4 in the explanatory paragraph (eight total) |

The active asset was rendered directly from p. 1 of the pinned PDF, without
OCR, masking, compositing, reconstruction, clipping, or added labels. A fresh
same-resolution render compared pixel-for-pixel with the active asset has an
absolute-error count of zero. The active preview is therefore an honest,
complete source sheet, not a claim that one individual figure was cleanly
isolated.

All prior versioned `fig-*-source-crop-v*.png` files remain preserved on disk
as research artifacts and are no longer bound to the archival edition. This
evidence improvement does not control source-reader availability: the complete
edition, reviewed ledger, and pinned PDF remain available independently.
No reconstructed linework, labels, or historical claims may be added.

## Review boundary

The pinned local PDF, its digest, and direct visual comparison are the edition
authority. Passing tests and software gates prove only the stated relationships;
they do not replace independent editorial acceptance against the facsimile and
the deployed Wright-quality reference.
