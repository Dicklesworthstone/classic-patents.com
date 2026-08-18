# Provenance receipt: US 821,393, Orville Wright and Wilbur Wright

## Source identity

- Catalogue id: `us-821393-wright-flyer`
- Granted title: *Flying-Machine*
- Inventors as printed: Orville Wright and Wilbur Wright, of Dayton, Ohio
- Grant date: 1906-05-22
- Filing date: 1903-03-23
- Primary public record: https://patents.google.com/patent/US821393A/en
- Local immutable facsimile: `public/patents/pdfs/us-821393-wright-flyer.pdf`
- Retrieval and full-facsimile review date: 2026-08-18
- Rights basis: a United States patent granted in 1906; its historical text and
  drawings are public-domain United States Government material.
- SHA-256: `678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966`
- PDF page count: 10

## Facsimile map and comparison record

The pinned ten-page PDF was visually reviewed at 300 DPI. The public source
face is deliberately continuous, so it does not impose these scan-page breaks
on a reader. They are retained here to make the editorial comparison
reproducible.

| Facsimile locator | Content checked |
| --- | --- |
| PDF p. 1 | Drawing sheet 1 of 3: `FIG. 1`, the perspective view; Patent No. 821,393; the 23 March 1903 application line; the 22 May 1906 grant line; witness names William H. Bauer and Ernie Huller; inventors Orville and Wilbur Wright; H. A. Toulmin, attorney. |
| PDF p. 2 | Drawing sheet 2 of 3: `FIG. 2`, the plan view, with the same patent, application, grant, witness, inventor, and attorney matter. |
| PDF p. 3 | Drawing sheet 3 of 3: `FIGS. 3, 4, and 5`, respectively the side elevation and two flexible-joint details, with the same printed identification and signature matter. |
| PDF p. 4 | Patent Office masthead and formal preamble; the statement of the apparatus and its control objective; the figure list; the opening account of the aeroplane frame and fabric. |
| PDF p. 5 | Completion of the cloth construction; standards, flexible joints, stay-wires, ropes, and cradle; opening account of warping the lateral margins. |
| PDF p. 6 | Completion of the wing-warping description; lateral balance; the vertical rear rudder, its supports, and its connection to the cradle. |
| PDF p. 7 | Completion of the vertical-rudder account; forward struts and skids; the front horizontal rudder; its flexible ribs, springs, rollers, and links. |
| PDF p. 8 | Completion of the front-rudder account; the definition of `aeroplane`; the non-limitation paragraph; claims 1 through 3. |
| PDF p. 9 | Claims 3 through 11. |
| PDF p. 10 | Claims 11 through 18; Orville Wright and Wilbur Wright signature lines; witnesses Chas. E. Taylor and E. Earle Forrer. |

## Editorial and preservation boundaries

- `src/data/editions/wrightFlyerEdition.ts` is the complete visitor-facing
  source face. Its prose, claims, glossary annotations, and figure references
  are individually authored typed React nodes. It does not render OCR, a PDF
  text layer, generated HTML, or a page-by-page scan transcription.
- Each figure reference in the edition points to a local crop in
  `public/patents/figures/` taken from the pinned drawing sheets. `Fig. 1`
  and `Fig. 2` use their respective sheets; `Figs. 3, 4, and 5` use sheet 3.
- The legacy source-text asset is retained as research evidence only. It is
  not a reviewed transcription and must never be used as a substitute for the
  authored edition or promoted merely because it has page markers.
- `public/patents/transcripts/us-821393-wright-flyer-reviewed.txt` is the
  review ledger for this edition. It records all ten facsimile pages, while
  the visitor-facing React edition deliberately remains continuous.
- The source contains eighteen printed claims. The manual edition preserves
  the ordered set, including the final two rope-and-rudder combinations; no
  claim is compressed into a summary or silently omitted.
