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

## Claims and source crop

All five printed claims are explicit typed claim nodes and their exact text is
reused by the canonical record:

1. General apparatus with elevated condenser/container, inert gas, absorption
   liquid, gravity conduits, and heated liquid lift.
2. The general apparatus with the container-to-condenser vent conduit.
3. The ammonia-water-butane apparatus without that vent limitation.
4. The material-specific apparatus with the vent limitation.
5. The corresponding refrigeration method.

The locally served preview
`public/patents/figures/us-1781541-einstein-refrigerator/fig-1-source-crop-v1.png`
is cropped directly from PDF p. 1. It adds no linework, labels, or synthetic
annotations.

## Independent-review boundary

The first author performed a full visual pass across all four PDF pages and
compared every source block, claim, figure reference, and printed name against
the facsimile. A second, independent orchestrator review is still required
before this Bead can be accepted or closed. A passing data test establishes
structural consistency, not archival acceptance on its own.
