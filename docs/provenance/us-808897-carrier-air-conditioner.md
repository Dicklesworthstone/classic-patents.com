# US 808,897 — source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-808897-carrier-air-conditioner`
- Local immutable facsimile: `public/patents/pdfs/us-808897-carrier-air-conditioner.pdf`
- Stable public record: https://patents.google.com/patent/US808897A/en
- Retrieved for this edition: 2026-08-18
- SHA-256: `b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e`
- PDF pages: 4
- Rights basis: US 808,897 was granted in 1906. Its historical patent text and
  drawings are public-domain material in the United States. This receipt does
  not claim rights in another party's scan layout or metadata.

## Direct facsimile review

| Material | Exact PDF locator | Editorial treatment |
| --- | --- | --- |
| Patent number, grant date, inventor, title, filing date; Figs. 1–6; drawing-sheet witnesses and inventor signature | PDF p. 1 | Six local source crops and a continuous figure-sheet node. |
| Patent-office masthead, formal notice, purpose, all printed figure descriptions, M/H spray system, start of separator description | PDF p. 2 | Explicit ordered source nodes, terms, and figure-preview references. |
| Separator construction and operation; pipe coils; result; Claims 1–3 | PDF p. 3 | Explicit continuous source paragraphs and exact typed claim nodes. |
| End of Claim 4, Claim 5, execution date, inventor, witnesses | PDF p. 4 | Exact typed claims and execution nodes. |

The primary facsimile identifies the filing as **September 16, 1904**, serial
**224,758**, not September 16, 1902, serial 123,618. It contains five printed
claims. Its invention is an air-purifying wet separator with sinuous plates,
not an automatically regulated chilled-water dew-point apparatus.

## Editorial boundary and review ledger

The visitor-facing Original Patent Text is the manually authored,
`carrierAirConditionerArchivalEdition` in
`src/data/editions/carrierAirConditionerEdition.ts`. It is a continuous typed
semantic edition pinned to the digest above. It is not rendered from OCR, a
PDF text layer, HTML, Markdown, or automatic paragraph reflow.

`public/patents/transcripts/us-808897-carrier-air-conditioner-reviewed.txt`
is the review ledger. It has exactly one marker for each PDF page. Those
markers are review evidence only; they do not appear in the public continuous
edition. Existing raw source-text and OCR artifacts remain comparison evidence
and are not the source used by the visitor-facing reader.

## Figures, claims, and correction record

The six local preview assets under
`public/patents/figures/us-808897-carrier-air-conditioner/` are direct crops
from the first PDF sheet. They add no reconstructed linework, labels, or
synthetic annotations. Every printed occurrence of `Fig.` or `Figure` in the
source edition is an explicit reference node to the appropriate crop.

The five typed claims are source-faithful:

1. The two-zone upright sinuous plate system with an unobstructed wet front
   and a projected liquid-separating rear.
2. The moistened-air system with smooth front plate portions and projected
   succeeding portions.
3. The upright bends and projecting flanges that form gutters.
4. Continuous `zigzig` surfaces with gutter-forming projections, retaining
   the spelling printed in the grant.
5. The angled separator plate whose overlapping sections form a gutter.

The pre-existing record's chilled spray temperature, dew-point regulator,
reheat system, three invented claims, incorrect filing data, invented
callouts, and asserted patent dispute do not appear in this facsimile. The
public canonical record now points at the manual source edition and lists only
facts supported by this document.

## Independent-review boundary

The edition author reviewed all four source sheets visually, then performed a
second source comparison while preparing the typed ledger. This is local
source evidence, not independent acceptance. Root must still integrate the
patent-local `carrierAirConditionerParallelReadings` export into the shared
parallel-reading registry, run the shared gates, and independently compare
the live page and source PDF before this Bead may be accepted or closed.
