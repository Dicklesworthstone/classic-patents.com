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

### Cloud-only recrop handoff (pending)

The current previews are preserved as comparison evidence. Before any
replacement is bound, a GPT-5.6 Luna image worker must inspect PDF page 1 at
the native 2320 × 3408 source-pixel raster and return an image-space rectangle
`(left, top, width, height)` for each target below. The rectangle must include
the complete printed figure, its printed `Fig.` caption, and all source letters
needed by the matching description, while excluding neighboring figures,
page borders, and synthetic labels. The worker must also return the crop's
pixel dimensions and a visual note explaining the boundary. No local render,
crop, OCR, or image-processing operation is authorized for this handoff;
rendering the pinned PDF solely to inspect source evidence does not create an
accepted crop.

| Figure | Target on PDF page 1 | Required versioned output | Binding rule |
| --- | --- | --- | --- |
| 1 | Complete apparatus, part elevation and part vertical section; retain the `m`, `h`, `i`, and `k` source letters where printed | `fig-1-source-crop-v2.png` | Keep `fig-1-source-crop-v1.png` and bind v2 only after independent visual review |
| 2 | Enlarged horizontal section through the separator; retain the `j`, `b`, `c`, and adjacent sinuous passage lettering | `fig-2-source-crop-v3.png` | Keep v1/v2; do not repoint the edition until v3 exists and is accepted |
| 3 | Diagram of the separating device; include the complete diagram and its printed source letters, without inferred airflow arrows | `fig-3-source-crop-v2.png` | Keep v1; bind only a cloud-reviewed replacement |
| 4 | Perspective of one separator plate or element; retain the `i`, `j`, `f`, `g`, `b`, `c`, and `a` letters when present | `fig-4-source-crop-v2.png` | Keep v1; no generated plate geometry may substitute for the facsimile |
| 5 | Enlarged spray-nozzle section in its first plane; retain the printed `h` lettering | `fig-5-source-crop-v2.png` | Keep v1; bind only after the worker confirms nozzle boundaries |
| 6 | Enlarged spray-nozzle section in the second plane; retain the printed `h` lettering | `fig-6-source-crop-v2.png` | Keep v1; bind only after the worker confirms the distinct plane |

Until all six native-pixel rectangles and replacement files exist, the figure
acceptance issue remains an internal archival remediation. Existing edition
references intentionally continue to point at the preserved previews rather
than an unverified crop. That internal issue must never remove or downgrade a
visitor's complete source text.

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

On 2026-09-03, an independent visual re-review inspected all four pages of the
pinned PDF against the reviewed ledger and continuous edition. The source PDF
digest remained `b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e`.
The review confirmed the document identity, filing date, all five claims,
execution block, and the air-washer/plate-separator mechanism. It corrected
one factual mismatch: the printed page-4 execution block names **C. B.
Hornbeck**, not G. B. Hornbeck. The drawing sheet's handwritten witness marks
are retained as such rather than being normalized to the printed execution
names.

This supports removing the obsolete facsimile-review hold only. It does not
accept the existing figure crops, assert a completed figure review, or alter
the complete visitor-facing source reader.
