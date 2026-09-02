# Provenance receipt: US 3,858,581, Dean Kamen

## Source identity

- Catalogue id: `us-3858581-kamen-medication-injection-device`
- Granted title: *Medication Injection Device*
- Inventor as printed: Dean Kamen, 99 Bulsar Rd., Rockville Centre, New York
  11570
- Grant date: 1975-01-07
- Filing date: 1973-07-02
- Primary public record: https://patents.google.com/patent/US3858581A/en
- Official facsimile source:
  https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/3858581
- Local immutable facsimile:
  `public/patents/pdfs/us-3858581-kamen-medication-injection-device.pdf`
- Retrieval and full-facsimile review date: 2026-09-02
- Rights basis: a United States patent granted in 1975; its historical text and
  drawings are public-domain United States Government material.
- SHA-256: `1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d`
- PDF page count: 8

## Facsimile map and comparison record

The pinned eight-page PDF was visually reviewed page by page. The manual
edition retains a continuous historical reading, while this map records the
source-page checks used to prepare it.

| Facsimile locator | Content checked |
| --- | --- |
| PDF p. 1 | Front matter: printed title, inventor/address, application number 375,955, filing and grant dates, abstract, “5 Claims, 6 Drawing Figures,” and sectional Fig. 3. |
| PDF p. 2 | Drawing sheet 1 of 2: Figs. 1–3, including the housed syringe, lead screw, follower, controls, and sectional arrangement. |
| PDF p. 3 | Drawing sheet 2 of 2: Figs. 4–6, including the pulse-switch sections and two-counter control diagram. |
| PDF p. 4 | Printed specification pp. 1–2: field/prior-art discussion, stated objectives, figure list, and opening device description. |
| PDF p. 5 | Printed specification pp. 3–4: lead screw/follower construction, uniform-pitch relation, scale, and rotation-based pulse count. |
| PDF p. 6 | Printed specification pp. 5–6: timer/pulse arrangement, limit contact, override, visual signal, and clutch discussion. |
| PDF p. 7 | Printed specification pp. 7–8: counter circuitry, pulse relationships, and the described primary/alternative use context. |
| PDF p. 8 | Printed specification pp. 9–10: conclusion, “What is claimed,” and all five claims. |

## Editorial and preservation boundaries

- `src/data/editions/kamenMedicationInjectionEdition.ts` is the complete
  visitor-facing source face: typed, manually reviewed blocks rather than an
  OCR dump, scan-page banner, or PDF text layer.
- The page-marked review ledger is
  `public/patents/transcripts/us-3858581-kamen-medication-injection-device-reviewed.txt`.
  It records comparison evidence only; it does not replace the authored
  edition.
- Figure previews under
  `public/patents/figures/us-3858581-kamen-medication-injection-device/` are
  crops from the two source sheets, not generated illustrations.
- The source prints five claims. All five must remain literal edition claim
  blocks, and the canonical record must obtain their text dynamically from
  those blocks.
- The public teaching model may explain the screw/follower, pulse, counter,
  and clutch topology. It is explicitly non-clinical: the historical source
  does not supply a safe dose, medical prescription, patient-specific setting,
  calibrated flow, pressure, or therapy outcome, so the visual must not claim
  any of them.

## Figure-crop review and preservation boundary

The active `-v2` PNG previews are direct rectangular crops from manually
reviewed 9,667 by 14,200 pixel renders of the pinned drawing sheets. No
caption, callout, linework, or image content was generated or retouched. The
source rectangle and its normalized counterpart are recorded per authored
figure-reference occurrence in
`src/data/editions/figureOccurrenceSourceLocators.ts`; repeated citations use
the same source rectangle.

| Active source crop | PDF page | Source rectangle (`x`, `y`, `width`, `height`) | Review note |
| --- | ---: | --- | --- |
| `fig-1-source-crop-v2.png` | 2 | 500, 1850, 8700, 3400 | Complete Fig. 1 and its printed label; excludes the sheet header and Fig. 2. |
| `fig-2-source-crop-v2.png` | 2 | 350, 5100, 9000, 3250 | Complete Fig. 2. A narrow strip of adjacent original Fig. 1 material remains because removing it would clip Fig. 2's upper source content. |
| `fig-3-source-crop-v2.png` | 2 | 500, 9000, 8700, 4200 | Complete Fig. 3 and its printed label; excludes Fig. 2. |
| `fig-4-source-crop-v2.png` | 3 | 600, 1700, 4000, 4200 | Complete Fig. 4, including the upper `32` callout and printed label. |
| `fig-5-source-crop-v2.png` | 3 | 4000, 3400, 4300, 3200 | Complete Fig. 5 and its printed label. |
| `fig-6-source-crop-v2.png` | 3 | 600, 6000, 8500, 7300 | Complete Fig. 6. The original Fig. 5 label remains because a tighter rectangle would clip the Fig. 6 `134` callout. |

The inclusion of those neighboring source marks in Figs. 2 and 6 is a
preservation decision, not a reconstruction: retaining the unmodified source
pixels is preferable to clipping printed figure content or masking it with
invented pixels. The six active assets were independently reviewed against the
pinned PDF on 2026-09-02; their byte hashes and dimensions are pinned in
`archivalFigureAcceptance.ts`.
