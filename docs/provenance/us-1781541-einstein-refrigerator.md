# US 1,781,541 — source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-1781541-einstein-refrigerator`
- Local immutable facsimile: `public/patents/pdfs/us-1781541-einstein-refrigerator.pdf`
- Stable public record: https://patents.google.com/patent/US1781541A/en
- Retrieved for this edition: 2026-08-18
- SHA-256: `5b67c380be742776b9509862e68e1fc68478a7b1cc92f215ba422efbd76b96e4`
- PDF pages: 4
- Rights basis: United States Patent No. 1,781,541 was granted in 1930. The
  historic patent text and drawings are public-domain material in the United
  States. This receipt does not claim rights in a third-party scan's layout or
  metadata.

## Direct facsimile review

| Material | Exact PDF locator | Editorial treatment |
| --- | --- | --- |
| Sole source drawing, patent date, inventor credit, filing date | PDF p. 1 | Local source-facsimile crop, plus a figure-sheet node. |
| Masthead, related prior art, apparatus description, cycle through generator return | PDF p. 2 | Explicit ordered source-paragraph nodes and authored non-lossy companion readings. |
| Weak-solution lift, vent, pressure-head condition, scope language, Claims 1–4 opening | PDF p. 3 | Explicit ordered source-paragraph nodes and exact typed claim nodes. |
| End of Claim 4, Claim 5, execution and signatures | PDF p. 4 | Exact typed claim, execution, and signature nodes. |

The page-one drawing identifies a single apparatus, not figures numbered 1 and
2. The public edition therefore calls it the **source drawing**, rather than
inventing figure numbers.

## Identity and correction record

The primary PDF identifies the grant as *Refrigeration*, US 1,781,541, to
Albert Einstein and Leo Szilard. Its masthead gives application serial
**240,566**, not 240,436, and it contains **five** printed claims, not ten.
The source explains a three-fluid absorption arrangement using butane,
ammonia, and water; it does not specify a fixed total pressure, a temperature,
a compressor type, an electromagnetic liquid-metal pump, or the historical
claims that appeared in the prior catalogue record. Those non-facsimile claims
are not repeated in the manual edition.

## Editorial boundary and review ledger

The visitor-facing Original Patent Text is
`einsteinRefrigeratorArchivalEdition` in
`src/data/editions/einsteinRefrigeratorEdition.ts`. It is an explicit,
continuous, typed semantic edition pinned to the digest above. It is not
rendered from OCR, a PDF text layer, HTML, Markdown, or a formatter's paragraph
guesses.

The independent review ledger is
`public/patents/transcripts/us-1781541-einstein-refrigerator-reviewed.txt`.
It carries one marker per source PDF page. Its page markers belong only to the
review artifact; the public edition remains continuous and does not recreate
scan-page boundaries.

The existing raw PDF text layer and OCR research files remain comparison
evidence only. They were not copied into the public reader as a source of
truth.

## Claims and source drawing

All five printed claims are explicit typed claim nodes and their exact text is
reused by the canonical record:

1. General apparatus with elevated condenser/container, inert gas, absorption
   liquid, gravity conduits, and heated liquid lift.
2. The general apparatus with the container-to-condenser vent conduit.
3. The ammonia-water-butane apparatus without that vent limitation.
4. The material-specific apparatus with the vent limitation.
5. The corresponding refrigeration method.

The legacy local preview
`public/patents/figures/us-1781541-einstein-refrigerator/fig-1-source-crop-v1.png`
is preserved as historical review material. It is no longer the active
archival preview because it has no independently recorded source-pixel
rectangle.

## Source-sheet acceptance (2026-09-03)

Both authored source-drawing references now use
`public/patents/figures/us-1781541-einstein-refrigerator/source-sheet-1-v1.png`.
It is an unmodified, upright 300-DPI render of PDF p. 1, made with
`pdftoppm -f 1 -l 1 -r 300 -png`. Its source raster is `2320 × 3408` pixels
and its SHA-256 is
`8ad5c0284168c3bc123b82b79693f49e1774dcb16c93b8b90c708bf0e2483a05`.
The active image retains the complete printed apparatus, patent number, date,
inventor/attorney signatures, and surrounding source context. It is not a
mask, composite, reconstruction, or isolated-region inference.

The two active occurrences are the "accompanying drawing" reference in
edition block 2 and the "drawing" reference in edition block 3. Each records
the complete page-one source rectangle (`x=0`, `y=0`, `width=2320`,
`height=3408`) in `figureOccurrenceSourceLocators.ts`. This archival evidence
improves only the internal review record; it does not control access to the
complete patent-text reader.

## Independent-review boundary

The current direct source-pixel review includes a visual pass of the complete
first-page drawing sheet and exact page-one raster evidence for every active
figure occurrence. A passing data test establishes structural consistency; the
facsimile, reviewed ledger, and editorial edition remain distinct artifacts.
