# US 135,245 — Improvement in Brewing Beer and Ale

## Source receipt

- Inventor: Louis Pasteur, of Paris, France.
- U.S. grant: US 135,245, January 28, 1873.
- Local immutable facsimile: `public/patents/pdfs/us-135245-pasteur-fermentation.pdf`.
- SHA-256: `7c9145e813b652e9da76472a8e6d0b2fa3088aeb1cea34b5ae3163f4d673a649`.
- Page count: 3.
- Stable catalog record: [Google Patents, US135245A](https://patents.google.com/patent/US135245A/en).
- Retrieved: 2026-08-17; all three source pages visually rechecked during this repair on 2026-08-21.
- Rights basis: the 1873 U.S. patent document is in the public domain; this receipt records the source and does not claim rights in a third-party scan.

## Page locators and review boundary

| Source PDF page | Matter manually checked | Local editorial output |
| --- | --- | --- |
| 1 | Drawing sheet: Fig. 1, Fig. 2, title, patent date, inventor and witness signatures | `figure-1-v3.png`, `figure-2-v3.png`; figure-sheet blocks in `pasteurFermentationEdition.ts` |
| 2 | Masthead; opening specification through the start of the operating sequence | Reviewed transcript page 2; archival blocks 0–13 |
| 3 | Completion of operating sequence; optional filtered/hot air; scale note; gas reuse; asserted results; sole claim; execution and witnesses | Reviewed transcript page 3; archival blocks 13–24; typed claim 1 |

The reviewed drawing-sheet ledger inventories the readable reference characters
printed beside both figures rather than substituting a generic drawing summary.
This inventory is comparison evidence only; the continuous visitor edition keeps
the drawing-page boundary out of its prose and exposes the source pixels through
the authored figure references.

The continuous edition preserves the source paragraph break between the
introductory sentence ending “my said improved process” and the following
apparatus paragraph beginning “At Figure 1.” It removes scan-page boundaries,
not the patent's own rhetorical structure.

The edition is manually authored from the facsimile. Existing
`source-text/us-135245-pasteur-fermentation.txt` and
`transcripts/us-135245-pasteur-fermentation.txt` were preserved as legacy
research artifacts and were not treated as authorities, because their content
does not match this facsimile. The reviewed transcription is a new asset:
`transcripts/us-135245-pasteur-fermentation-reviewed.txt`.

The grant gives its execution date as December 8, 1871 and says a French patent
was granted June 28, 1871. Neither the reviewed grant nor the primary public
record supplies a U.S. application number or filing date. The catalogue
`filingDate` is therefore `null`: the execution and grant dates are preserved
as their own facts and are not substituted for an unknown U.S. filing event.

## Figure-crop review and preservation boundary

The visitor-facing figure previews are direct, upright, 300-dpi pixel crops
from source PDF page 1 (rendered at 2320 × 3408 pixels). `figure-1-v3.png`
uses source coordinates `x=280, y=620, width=1750, height=1150`; it contains
the complete printed Fig. 1 apparatus and label, but no masthead, Fig. 2, or
execution signatures. `figure-2-v3.png` uses `x=710, y=1770, width=900,
height=750`; it contains the complete printed Fig. 2 apparatus and label, but
no masthead, Fig. 1, or execution signatures. The files are 1750 × 1150 and
900 × 750 pixels, respectively, and retain the rendered source pixels without
reconstruction or stylistic alteration. Their SHA-256 values are, respectively,
`8c5e6f806cc5570a6364168b31e4dc3dcc48a85b2f73494574dce363bbf78541` and
`adec6a5da1c2b0b36d2fe40412a06bb4bfcd27342fad78bbeec573195474658f`.

The earlier `figure-1.png`, `figure-1-v2.png`, and `figure-2.png` assets are
preserved as historical working artifacts and are not referenced by this
edition. The v3 files are pinned by the edition test with their exact paths,
dimensions, and SHA-256 values. There are exactly three printed specification
citations in the source text: `Figure 1`, `Fig. 1`, and `Fig. 2`; each is an
authored semantic reference to the corresponding v3 source crop.

Root visual QC on 2026-08-21 separately opened both active v3 files. Fig. 1 is
upright and contains the whole three-vessel apparatus and printed label without
the sheet masthead, Fig. 2, or signatures. Fig. 2 is upright and contains the
whole modified vessel B, its label, rim marks `g` and `g′`, outlet `R`, and
spray head without masthead, Fig. 1, or signatures.

## Visitor-facing model boundary

The 2D, Three.js, schematic, telemetry, weave, and colorized-equation paths are
limited to the sequence and apparatus printed in this grant: closed vessels A,
carbonic-acid-gas generator M M and line w, pipe E and nozzles P, exterior
spray cooling, exit tube x and cup v, and the 16°–18° Réaumur yeast-addition
band. The process percentages are explicitly labelled reader-animation
controls. The source gives no gas flow, pressure, residual oxygen, water flow,
cooling time, or vessel dimensions for a numerical simulator. It permits
galvanized iron, wood, or another suitable vessel material without selecting a
single construction for the reader model.

The Three.js studio deliberately isolates one representative vessel A with the
shared gas and spray services so its labeled flow path remains legible. The 2D
face and archival Fig. 1 preview retain the complete printed three-vessel
arrangement; the isolated 3D composition is not presented as a facsimile.

The root publication hold remains in place pending the deferred executable and
independent visitor-acceptance passes. The shared claim-state predicate has been
corrected to the source's paired air-expulsion and cooling operations: it now
requires both operations to be present, without inventing a minimum percentage
or treating a broad temperature interval as the legal test.
The source-correct constraint definition in `claimConstraints.ts` states the
same two-operation boundary.

An earlier visitor implementation instead taught a later modern pasteurization
story—thermal hold, microbial log kill, alcohol yield, pressure, shelf life,
swan-neck/cotton-filter hardware, and invented construction details. Those
claims and controls are retained only in a non-serving legacy equation entry;
they are not reachable through the public patent id. The active 2D, 3D, and
schematic paths were replaced with source-bounded apparatus readers on
2026-08-21. Fig. 1 and Fig. 2 now have distinct schematic treatments rather
than presenting the three-vessel Fig. 1 diagram for both catalogue drawings.

## Editorial claims and limits

The source prints **one** legal claim, not three. It claims subjecting wort to
a process for expulsion of air and cooling it. It does not state a 50–60 °C
heating band, a duration, or a separate pure-culture claim. “Réaumur” in the
operating description is converted for explanation only: 16°–18° Réaumur equals
20°–22.5 °C. The conversion and heat-transfer statements in the Plain English
face are modern explanatory context, not quoted patent language.
