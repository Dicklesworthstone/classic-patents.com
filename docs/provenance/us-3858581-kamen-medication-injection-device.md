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
- Retrieval and full-facsimile review date: 2026-09-01
- Rights basis: a United States patent granted in 1975; its historical text and
  drawings are public-domain United States Government material.
- SHA-256: `1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d`
- PDF page count: 8

## Facsimile map and comparison record

The pinned eight-page PDF was visually reviewed page by page. The manual
edition will retain a continuous historical reading, while this map records
the source-page checks used to prepare it.

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

- `src/data/editions/kamenMedicationInjectionEdition.ts` will be the complete
  visitor-facing source face: typed, manually reviewed blocks rather than an
  OCR dump, scan-page banner, or PDF text layer.
- The page-marked review ledger will be
  `public/patents/transcripts/us-3858581-kamen-medication-injection-device-reviewed.txt`.
  It records comparison evidence only; it does not replace the authored
  edition.
- Figure previews under
  `public/patents/figures/us-3858581-kamen-medication-injection-device/` will
  be crops from the two source sheets, not generated illustrations.
- The source prints five claims. All five must remain literal edition claim
  blocks, and the canonical record must obtain their text dynamically from
  those blocks.
- The public teaching model may explain the screw/follower, pulse, counter,
  and clutch topology. It is explicitly non-clinical: the historical source
  does not supply a safe dose, medical prescription, patient-specific setting,
  calibrated flow, pressure, or therapy outcome, so the visual must not claim
  any of them.
